import { AsyncStorage } from 'react-native';
import CryptoJS from 'crypto-js';

const STORAGE_KEY_PREFIX = '@MindsStorage:';
const STORAGE_KEY_KEYCHAIN_PREFIX = '@MindsStorageKeychainLookup:';
const CRYPTO_AES_PREFIX = 'crypto:aes:';

import KeychainService from './keychain.service';

class StorageService {
  MAX_ATTEMPTS = 3;

  async getItem(key) {
    let value = await AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`),
      originalValue = value;

    if (value === null) {
      // No data
      return null;
    }

    if (value.startsWith(CRYPTO_AES_PREFIX)) {
      const keychain = await AsyncStorage.getItem(`${STORAGE_KEY_KEYCHAIN_PREFIX}${key}`);

      let attempts = 0;

      while (attempts < this.MAX_ATTEMPTS) {
        attempts++;

        try {
          let secret = await KeychainService.getSecret(keychain);

          if (!secret) {
            value = '';
            break;
          }

          value = CryptoJS.AES.decrypt(originalValue.substr(CRYPTO_AES_PREFIX.length), secret)
            .toString(CryptoJS.enc.Utf8);
        } catch (e) {
          value = null;
        }

        if (value) {
          break;
        }

        KeychainService.disposeCachedSecret(keychain);
      }

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

      let secret = await KeychainService.getSecret(keychain);

      if (!secret) {
        throw new Error('E_NO_SECRET');
      }

      rawValue = CRYPTO_AES_PREFIX + CryptoJS.AES.encrypt(rawValue, secret)
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
