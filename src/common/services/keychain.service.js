import { AsyncStorage } from 'react-native';

import KeychainStore from '../../keychain/KeychainStore';

class KeychainService {
  unlocked = {};

  async getSecret(keychain) {
    if (typeof this.unlocked[keychain] !== 'undefined') {
      return this.unlocked[keychain];
    }

    KeychainStore.setUnlock(keychain);
    let secret = await KeychainStore.waitForUnlock();

    if (!secret) {
      // TODO: Retry?
    }

    this.unlocked[keychain] = secret;
    return secret;
  }
}

export default new KeychainService();
