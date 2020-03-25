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
  @observable unlockingSecret = void 0;
  @observable unlockingExisting = false;
  @observable unlockingAttempts = 0;

  @action async waitForUnlock(keychain, existing = false, attempts = 0) {
    if (this.isUnlocking) {
      throw new Error('E_ALREADY_UNLOCKING');
    }

    this.isUnlocking = true;
    this.unlockingKeychain = keychain;
    this.unlockingSecret = void 0;
    this.unlockingExisting = existing;
    this.unlockingAttempts = attempts;

    return await new Promise(resolve => {
      if (unlockingSecretDispose) {
        unlockingSecretDispose();
        unlockingSecretDispose = void 0;
      }

      unlockingSecretDispose = observe(this, 'unlockingSecret', action(change => {
        unlockingSecretDispose();

        this.isUnlocking = false;
        this.unlockingKeychain = '';
        this.unlockingSecret = void 0;
        this.unlockingExisting = false;
        this.unlockingAttempts = 0;

        if (typeof change.newValue !== 'undefined') {
          resolve(change.newValue);
        }
      }));
    });
  }

  @action unlock(secret) {
    this.isUnlocking = false;
    this.unlockingKeychain = '';
    this.unlockingSecret = secret;
    this.unlockingExisting = false;
    this.unlockingAttempts = 0;
  }

  @action cancel() {
    this.isUnlocking = false;
    this.unlockingKeychain = '';
    this.unlockingSecret = '';
    this.unlockingExisting = false;
    this.unlockingAttempts = 0;
  }

  @action
  reset() {
    this.isUnlocking = false;
    this.unlockingKeychain = '';
    this.unlockingSecret = void 0;
    this.unlockingExisting = false;
    this.unlockingAttempts = 0;
  }

}

export default KeychainStore
