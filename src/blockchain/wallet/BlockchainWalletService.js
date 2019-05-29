import appStores from '../../../AppStores';
import StorageService from '../../common/services/storage.service';
import Web3Service from '../services/Web3Service';
import BlockchainTokenService from '../services/BlockchainTokenService';
import KeychainService from '../../common/services/keychain.service';
import api from '../../common/services/api.service';
import noExponents from '../../common/helpers/no-exponents';
import logService from '../../common/services/log.service';
import i18n from '../../common/services/i18n.service';

// Helper functions

function storageKey(key) {
  return `BlockchainWallet:${key}`;
}

function privateKeyStorageKey(address) {
  return storageKey(`wallet:${address.toLowerCase()}:privateKey`);
}

async function fetchListFromStorage() {
  return (await StorageService.getItem(storageKey('wallets'))) || [];
}

async function saveListToStorage(wallets) {
  return await StorageService.setItem(storageKey('wallets'), wallets);
}

async function hasPrivateKeyInStorage(address) {
  return await StorageService.hasItem(privateKeyStorageKey(address));
}

async function fetchPrivateKeyFromStorage(address) {
  return await StorageService.getItem(privateKeyStorageKey(address));
}

async function savePrivateKeyToStorage(address, privateKey) {
  return await StorageService.setItem(privateKeyStorageKey(address), privateKey, true, 'wallet');
}

async function fetchCurrentWalletAddressFromStorage() {
  return await StorageService.getItem(storageKey('currentWalletAddress'));
}

async function saveCurrentWalletAddressToStorage(address) {
  return await StorageService.setItem(storageKey('currentWalletAddress'), address);
}

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

function isCacheStillValid(cacheEntry) {
  if (!cacheEntry || !cacheEntry.timestamp) {
    return false;
  }

  const expires = cacheEntry.timestamp + CACHE_TTL;

  return Date.now() < expires;
}

// Service

export class BlockchainWalletService {
  current = null;

  fundsCache = {};

  async init() {
    return await this.restoreCurrentFromStorage();
  }

  // Normalization and Checking
  isValidAddress(address) {
    return !!address && Web3Service.web3.utils.isAddress(address);
  }

  normalizePrivateKey(privateKey) {
    if (!privateKey || typeof privateKey !== 'string') {
      throw new Error('E_INVALID_PRIVATE_KEY_VALUE');
    }

    privateKey = privateKey.toLowerCase();

    if (privateKey.substr(0, 2) !== '0x') {
      privateKey = `0x${privateKey}`;
    }

    return privateKey;
  }

  isValidPrivateKey(privateKey) {
    try {
      privateKey = this.normalizePrivateKey(privateKey);
      return !!privateKey && privateKey.length === 66 && !!Web3Service.getAddressFromPK(privateKey)
    } catch (e) {
      return false;
    }
  }

  // Fetching and finding

  async getAll() {
    const wallets = await fetchListFromStorage(),
    current = this.current && this.current.address;

    for (let i = 0; i < wallets.length; i++) {
      wallets[i] = Object.assign({}, wallets[i], {
        current: !!current && wallets[i].address.toLowerCase() === current.toLowerCase(),
        privateKey: await hasPrivateKeyInStorage(wallets[i].address)
      });
    }

    return wallets;
  }

  async get(address) {
    if (!address) {
      return null;
    }

    const wallets = await this.getAll() || [];

    return wallets
      .find(wallet => wallet.address.toLowerCase() === address.toLowerCase());
  }

  // Storage

  async set(address, data = {}) {
    if (!address) {
      throw new Error('E_NO_ADDRESS');
    }

    const wallets = await fetchListFromStorage(),
      i = wallets.findIndex(wallet => wallet.address.toLowerCase() === address.toLowerCase());

    if (i < 0) {
      throw new Error('E_ADDRESS_NOT_FOUND');
    }

    if (typeof data.alias !== 'undefined') {
      wallets[i].alias = data.alias;
    }

    await saveListToStorage(wallets);
  }

  async delete(address) {
    if (!address) {
      throw new Error('E_NO_ADDRESS');
    }

    const wallets = await fetchListFromStorage(),
      i = wallets.findIndex(wallet => wallet.address.toLowerCase() === address.toLowerCase());

    if (i < 0) {
      throw new Error('E_ADDRESS_NOT_FOUND');
    }

    wallets.splice(i, 1);
    await StorageService.removeItem(privateKeyStorageKey(address));

    await saveListToStorage(wallets);
  }

  // Current wallet management

  async getCurrent(onlyWithPrivateKey = false) {
    if (!this.current || (!this.current.privateKey && onlyWithPrivateKey)) {
      const payload = await this.selectCurrent(i18n.t('blockchain.selectTheWallet'), { signable: onlyWithPrivateKey, offchain: false, buyable: false });

      if (payload && payload.type === 'onchain') {
        this.current = payload.wallet;
      } else {
        throw new Error('E_CANCELLED');
      }
    }

    return this.current;
  }

  async unlock(address) {
    if (!address) {
      throw new Error(i18n.t('blockchain.missingWallet'));
    }

    const privateKey = await fetchPrivateKeyFromStorage(address);

    if (!privateKey) {
      throw new Error('E_CANNOT_UNLOCK_WALLET');
    }

    return privateKey;
  }

  async selectCurrent(message = '', opts = {}) {
    const payload = await appStores.blockchainWalletSelector.waitForSelect(message, opts);

    if (!payload) {
      this.current = null;

      return {
        type: '',
        cancelled: true
      };
    }

    if (payload.type === 'onchain') {
      this.current = payload.wallet;
      await saveCurrentWalletAddressToStorage(payload.wallet.address);
    }

    return payload;
  }

  async setCurrent(address) {
    if (!address) {
      return;
    }

    const wallet = await this.get(address);

    if (!wallet) {
      return;
    }

    this.current = wallet;
    await saveCurrentWalletAddressToStorage(wallet.address);

    return wallet.address;
  }

  async restoreCurrentFromStorage() {
    const address = await fetchCurrentWalletAddressFromStorage();

    if (!address) {
      return;
    }

    return await this.setCurrent(address);
  }

  // Wallets list management

  async create() {
    const wallets = await fetchListFromStorage();

    if (wallets.length >= 20) {
      throw new Error('E_TOO_MANY_WALLETS');
    }

    const { address, privateKey } = Web3Service.createWallet();

    await savePrivateKeyToStorage(address, privateKey);

    if (await this.get(address)) {
      throw new Error('E_ALREADY_EXISTS');
    }

    wallets.push({ address });

    await saveListToStorage(wallets);

    return address;
  }

  async import(privateKey) {
    if (!this.isValidPrivateKey(privateKey)) {
      throw new Error('E_INVALID_PRIVATE_KEY');
    }

    const wallets = await fetchListFromStorage();

    if (wallets.length >= 20) {
      throw new Error('E_TOO_MANY_WALLETS');
    }

    privateKey = this.normalizePrivateKey(privateKey);
    const address = Web3Service.getAddressFromPK(privateKey);

    await savePrivateKeyToStorage(address, privateKey);

    if (await this.get(address)) {
      throw new Error('E_ALREADY_EXISTS');
    }

    wallets.push({ address });

    await saveListToStorage(wallets);

    return true;
  }

  // Funds

  async getFunds(address, force = false) {
    if (!force && isCacheStillValid(this.fundsCache[address])) {
      return this.fundsCache[address];
    }

    const result = address.toLowerCase() !== 'offchain' ?
      await this.getOnchainFunds(address) :
      await this.getOffchainFunds(address);

    this.fundsCache[address] = Object.assign({}, result);

    return result;
  }

  async getOnchainFunds(address) {
    return {
      tokens: await BlockchainTokenService.balanceOf(address),
      eth: await Web3Service.getBalance(address),
      timestamp: Date.now()
    };
  }

  async getOffchainFunds(address) {
    try {
      let response = await api.get(`api/v2/blockchain/wallet/balance`);

      return {
        tokens: Web3Service.web3.utils.fromWei(noExponents(response.addresses[1].balance), 'ether'),
        eth: 0,
        timestamp: Date.now()
      }
    } catch (e) {
      logService.exception(e);

      return {
        tokens: 'N/A',
        eth: 0,
        timestamp: Date.now()
      }
    }
  }

  // !! DANGEROUS !! Wipe

  async _DANGEROUS_wipe(confirmation) {
    if (confirmation !== true) {
      return;
    }

    await KeychainService._DANGEROUS_wipe(true, 'wallet');

    const keys = await StorageService.getKeys(storageKey(''));

    for (key of keys) {
      await StorageService.removeItem(key);
    }
  }
}

const serviceInstance = new BlockchainWalletService();
serviceInstance.init();

export default serviceInstance;
