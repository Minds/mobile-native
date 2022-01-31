import { Platform } from 'react-native';
import Share from 'react-native-share';
import Web3 from 'web3';
import storageService from '../common/services/storage.service';

function storageKey(key) {
  return `BlockchainWallet:${key}`;
}

function privateKeyStorageKey(address) {
  return storageKey(`wallet:${address.toLowerCase()}:privateKey`);
}

export async function fetchListFromStorage(): Promise<Array<any>> {
  return (await storageService.getItem(storageKey('wallets'))) || [];
}

export async function setWallets(wallets) {
  await storageService.setItem(storageKey('wallets'), wallets);
}

export async function hasPrivateKeyInStorage(address) {
  return await storageService.hasItem(privateKeyStorageKey(address));
}

export async function fetchPrivateKeyFromStorage(address, secret) {
  return await storageService.getItem(privateKeyStorageKey(address), secret);
}

/**
 * Returns the wallets with private key stored
 */
export async function getExportableWallets(
  showExported = false,
): Promise<Array<any>> {
  try {
    const wallets = await fetchListFromStorage();
    for (let index = 0; index < wallets.length; index++) {
      const w = wallets[index];
      if (w.address) {
        w.hasPrivate = await hasPrivateKeyInStorage(w.address);
      }
    }
    return wallets.filter(
      showExported ? w => w.hasPrivate : w => w.hasPrivate && !w.exported,
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function normalizePrivateKey(privateKey) {
  if (!privateKey || typeof privateKey !== 'string') {
    throw new Error('E_INVALID_PRIVATE_KEY_VALUE');
  }

  privateKey = privateKey.toLowerCase();

  if (privateKey.substr(0, 2) !== '0x') {
    privateKey = `0x${privateKey}`;
  }

  return privateKey;
}

function getAddressFromPK(privateKey) {
  if (!privateKey) {
    return null;
  }

  if (privateKey.substr(0, 2).toLowerCase() !== '0x') {
    privateKey = `0x${privateKey}`;
  }

  const web3 = new Web3();

  return web3.eth.accounts.privateKeyToAccount(privateKey).address;
}

export function isValidPrivateKey(privateKey) {
  try {
    privateKey = normalizePrivateKey(privateKey);
    return (
      !!privateKey && privateKey.length === 66 && !!getAddressFromPK(privateKey)
    );
  } catch (e) {
    return false;
  }
}

export async function exportPrivate(privateKey: string) {
  if (privateKey.substr(0, 2).toLowerCase() === '0x') {
    privateKey = privateKey.substr(2);
  }

  const shareOptions: any = {
    message: privateKey,
  };

  if (Platform.OS === 'android') {
    shareOptions.url = 'data:text/plain;base64,';
  }

  await Share.open(shareOptions);
}
