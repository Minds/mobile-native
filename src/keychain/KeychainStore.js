import {
  observable,
  action,
  observe
} from 'mobx'

let unlockingSecretDispose;

/**
 * Keychain Store
 */
class KeychainStore {
  @observable isUnlocking = false;
  @observable unlockingKeychain = '';
  @observable unlockingSecret = '';

  @action setUnlock(keychain) {
    this.isUnlocking = true;
    this.unlockingKeychain = keychain;
    this.unlockingSecret = '';
  }

  waitForUnlock() {
    if (!this.isUnlocking) {
      throw new Error('E_NOT_UNLOCKING');
    }

    return new Promise((resolve, reject) => {
      if (unlockingSecretDispose) {
        unlockingSecretDispose();
        unlockingSecretDispose = void 0;
      }

      unlockingSecretDispose = observe(this, 'unlockingSecret', action(change => {
        unlockingSecretDispose();
        console.log('unlockingSecret', change);

        if (change.newValue) {
          resolve(change.newValue);
        } else {
          reject(Error('E_NO_SECRET_OR_CANCELLED'));
        }

        this.unlockingSecret = '';
      }));
    });
  }

  @action doUnlock(secret) {
    this.isUnlocking = false;
    this.unlockingKeychain = '';
    this.unlockingSecret = secret;
  }

  @action cancelUnlock() {
    this.isUnlocking = false;
    this.unlockingKeychain = '';
    this.unlockingSecret = '';
  }
}

export default new KeychainStore()
