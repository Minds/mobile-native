import KeychainStore from '../../keychain/KeychainStore';

class KeychainService {
  unlocked = {};

  async getSecret(keychain) {
    if (typeof this.unlocked[keychain] !== 'undefined') {
      return this.unlocked[keychain];
    }

    let secret = await KeychainStore.waitForUnlock(keychain);
    await new Promise(r => setTimeout(r, 500)); // Modals have a "cooldown"

    if (!secret) {
      return null;
    }

    this.unlocked[keychain] = secret;
    return secret;
  }

  disposeCachedSecret(keychain) {
    if (typeof this.unlocked[keychain] !== 'undefined') {
      delete this.unlocked[keychain];
    }
  }
}

export default new KeychainService();
