//@ts-nocheck
import AsyncStorage from '@react-native-community/async-storage';
// import CryptoJS from 'crypto-js';

const STORAGE_KEY_PREFIX = '@MindsStorage:';
const STORAGE_KEY_KEYCHAIN_PREFIX = '@MindsStorageKeychainLookup:';
const CRYPTO_AES_PREFIX = 'crypto:aes:';

import KeychainService from './keychain.service';

/**
 * Storage service
 */
class StorageService {
  /**
   * Get item
   *
   * @param {string} key
   * @return {any}
   */
  async getItem(key) {
    let value = await AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);

    if (value === null) {
      // No data
      return null;
    }

    value = await this._decryptIfNeeded(value, key);

    return JSON.parse(value);
  }

  /**
   * Decrypt value if needed
   *
   * @param {any} value
   */
  async _decryptIfNeeded(value, key) {
    if (value.startsWith(CRYPTO_AES_PREFIX)) {
      const keychain = await AsyncStorage.getItem(
        `${STORAGE_KEY_KEYCHAIN_PREFIX}${key}`,
      );

      let output = null;
      try {
        let secret = await KeychainService.getSecret(keychain);

        if (secret) {
          output = CryptoJS.AES.decrypt(
            value.substr(CRYPTO_AES_PREFIX.length),
            secret,
          ).toString(CryptoJS.enc.Utf8);
        }
      } catch (e) {}

      if (!output) {
        throw new Error('E_INVALID_STORAGE_PASSWORD');
      }
      return output;
    }
    return value;
  }

  /**
   * Set item
   *
   * @param {string} key
   * @param {any} value
   * @param {boolean} encrypt
   * @param {string} keychain
   */
  async setItem(
    key: string,
    value: any | null = null,
    encrypt: boolean = false,
    keychain: string = '',
  ) {
    let rawValue = JSON.stringify(value);

    if (encrypt) {
      if (!keychain) {
        throw new Error('E_INVALID_KEYCHAIN');
      }

      let secret = await KeychainService.getSecret(keychain);

      if (!secret) {
        throw new Error('E_NO_SECRET');
      }

      rawValue =
        CRYPTO_AES_PREFIX + CryptoJS.AES.encrypt(rawValue, secret).toString();

      await AsyncStorage.setItem(
        `${STORAGE_KEY_KEYCHAIN_PREFIX}${key}`,
        keychain,
      );
    }

    await AsyncStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, rawValue);

    return this;
  }

  /**
   * Remove item
   *
   * @param {string} key
   */
  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(`${STORAGE_KEY_PREFIX}${key}`);
      await AsyncStorage.removeItem(`${STORAGE_KEY_KEYCHAIN_PREFIX}${key}`);
    } catch (e) {
      console.warn('Storage.removeItem', key, e);
    }

    return this;
  }

  /**
   * Has item
   *
   * @param {string} key
   * @returns {boolean}
   */
  async hasItem(key) {
    return !!(await AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`));
  }

  /**
   * Multi remove
   *
   * @param {Array<string>} keys
   */
  async multiRemove(keys) {
    return await AsyncStorage.multiRemove(
      keys.map((k) => `${STORAGE_KEY_PREFIX}${k}`),
    );
  }

  /**
   * Multi get
   *
   * @param {Array<string>} keys
   * @returns {Array<any>}
   */
  async multiGet(keys) {
    const values = await AsyncStorage.multiGet(
      keys.map((k) => `${STORAGE_KEY_PREFIX}${k}`),
    );

    return values.map((value) => {
      try {
        value[1] = JSON.parse(value[1]);
      } catch (err) {
        value[1] = null;
      }
      return value;
    });
  }

  /**
   * Get keys with given prefix
   *
   * @param {string} prefix
   */
  async getKeys(prefix) {
    if (!prefix) {
      return [];
    }

    return (await AsyncStorage.getAllKeys())
      .filter((key) => key.indexOf(`${STORAGE_KEY_PREFIX}${prefix}`) === 0)
      .map((key) => key.substr(STORAGE_KEY_PREFIX.length));
  }
}

export default new StorageService();
