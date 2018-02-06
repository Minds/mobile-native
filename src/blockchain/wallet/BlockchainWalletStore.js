import {
  observable,
  computed,
  action,
} from 'mobx'

import BlockchainApiService from '../BlockchainApiService';
import BlockchainWalletService from './BlockchainWalletService';

class BlockchainWalletStore {

  @observable inProgress = false;
  @observable loaded = false;
  @observable wallets = [];

  canImport(privateKey) {
    return BlockchainWalletService.isValidPrivateKey(privateKey);
  }

  @computed get signableWallets() {
    return this.wallets
      .filter(wallet => !!wallet.privateKey);
  }

  getList(signableOnly, allowOffchain, allowCreditCard) {
    const wallets = (signableOnly ? this.signableWallets : this.wallets).slice();

    if (allowOffchain) {
      wallets.push({
        address: 'offchain',
        alias: 'OffChain Wallet',
        offchain: true
      })
    }

    if (allowCreditCard) {
      wallets.push({
        address: 'creditcard',
        alias: 'Credit Card',
        creditcard: true
      })
    }

    return wallets;
  }

  @action async load(force) {
    if (this.inProgress && !force) {
      return false;
    }

    this.inProgress = true;
    this.wallets = [];

    let remoteWallet,
      wallets = [];

    wallets.push(...await BlockchainWalletService.getAll());

    try {
      remoteWallet = await BlockchainApiService.getWallet();
    } catch (e) { }

    if (remoteWallet) {
      let existingServerWalletIndex = wallets.findIndex(item => item.address.toLowerCase() === remoteWallet.toLowerCase());

      if (existingServerWalletIndex > -1) {
        wallets[existingServerWalletIndex].remote = true;
      } else {
        wallets.push({ address: remoteWallet, alias: 'Desktop', remote: true });
      }
    }

    wallets = wallets.sort((a, b) => {
      if (!a || !b) {
        return 0;
      }

      if (a.current && !b.current) {
        return -1;
      } else if (b.current && !a.current) {
        return 1;
      }

      if (!a.remote && b.remote && !b.privateKey) {
        return -1;
      } else if (!b.remote && a.remote && !a.privateKey) {
        return 1;
      }

      if (a.alias && !b.alias) {
        return -1;
      } else if (!a.alias && b.alias) {
        return 1;
      } else if (!a.alias && !b.alias) {
        return 0;
      }

      return `${a.alias}`.localeCompare(`${b.alias}`);
    });

    this.wallets = wallets;
    this.loaded = true;
    this.inProgress = false;
  }

  @action async import(privateKey) {
    await BlockchainWalletService.import(privateKey);
    this.load(true);
  }

  @action async save(address, data) {
    if (!address || address.toLowerCase().indexOf('0x') !== 0) {
      return;
    }

    await BlockchainWalletService.set(address, data);
    this.load(true);
  }

  @action async delete(address) {
    const unlocked = await BlockchainWalletService.unlock(address);

    if (!unlocked) {
      throw new Error('E_LOCKED_WALLET');
    }

    await BlockchainWalletService.delete(address);
    this.load(true);
  }

  @action
  reset() {
    this.inProgress = false;
    this.loaded = false;
    this.wallets = [];
  }

  @action async _DANGEROUS_wipe(confirmation) {
    if (confirmation !== true) {
      return;
    }

    await BlockchainWalletService._DANGEROUS_wipe(confirmation);
    this.load(true);
  }
}

export default new BlockchainWalletStore();
