import { AsyncStorage } from 'react-native';
import CryptoJS from 'crypto-js';

const STORAGE_KEY_PREFIX = '@MindsStorage:';
const STORAGE_KEY_KEYCHAIN_PREFIX = '@MindsStorageKeychainLookup:';
const CRYPTO_AES_PREFIX = 'crypto:aes:';

import KeychainService from './keychain.service';

class StorageService {
  async getItem(key) {
    let value = await AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);

    if (value === null) {
      // No data
      return null;
    }

    if (value.startsWith(CRYPTO_AES_PREFIX)) {
      const keychain = await AsyncStorage.getItem(`${STORAGE_KEY_KEYCHAIN_PREFIX}${key}`);

      value = CryptoJS.AES.decrypt(value.substr(CRYPTO_AES_PREFIX.length), await KeychainService.getSecret(keychain))
        .toString(CryptoJS.enc.Utf8);

      if (!value) {
        throw new Error('E_INVALID_STORAGE_PASSWORD');
      }
    }

    return JSON.parse(value);
  }

  async setItem(key, value = null, encrypt = false, keychain = '') {
    let rawValue = JSON.stringify(value);

    if (encrypt) {
      if (!keychain) {
        throw new Error('E_INVALID_KEYCHAIN');
      }

      rawValue = CRYPTO_AES_PREFIX + CryptoJS.AES.encrypt(rawValue, await KeychainService.getSecret(keychain))
        .toString();

      await AsyncStorage.setItem(`${STORAGE_KEY_KEYCHAIN_PREFIX}${key}`, keychain);
    }

    await AsyncStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, rawValue);

    return this;
  }

  async removeItem(key) {
    await AsyncStorage.removeItem(`${STORAGE_KEY_PREFIX}${key}`);

    return this;
  }
}

export default new StorageService();
