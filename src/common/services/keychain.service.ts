//@ts-nocheck
import AsyncStorage from '@react-native-community/async-storage';
import CryptoJS from 'crypto-js';

const STORAGE_KEY_PREFIX = '@MindsKeychainChallenge:';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function isCacheStillValid(cacheEntry) {
  if (!cacheEntry || !cacheEntry.timestamp) {
    return false;
  }

  const expires = cacheEntry.timestamp + CACHE_TTL;

  return Date.now() < expires;
}

async function isKeychainInStorage(keychain) {
  return !!(await AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}${keychain}`));
}

async function saveKeychainToStorage(keychain, secret) {
  await AsyncStorage.setItem(
    `${STORAGE_KEY_PREFIX}${keychain}`,
    CryptoJS.AES.encrypt(secret, secret).toString(),
  );
}

async function removeKeychainFromStorage(keychain) {
  await AsyncStorage.removeItem(`${STORAGE_KEY_PREFIX}${keychain}`);
}

async function challengeKeychainFromSecret(keychain, secretAttempt) {
  if (!secretAttempt) {
    return false;
  }

  const value = await AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}${keychain}`);

  if (!value) {
    return null;
  }

  try {
    const secret = CryptoJS.AES.decrypt(value, secretAttempt).toString(
      CryptoJS.enc.Utf8,
    );

    if (!secret) {
      return null;
    }

    return secret;
  } catch (e) {
    return null;
  }
}

class KeychainService {
  unlocked = {};

  async getSecret(keychain, secretAttempt) {
    if (!keychain) {
      throw new Error('E_INVALID_KEYCHAIN');
    }

    if (
      typeof this.unlocked[keychain] !== 'undefined' &&
      isCacheStillValid(this.unlocked[keychain])
    ) {
      return this.unlocked[keychain].secret;
    }

    let secret;

    if (await isKeychainInStorage(keychain)) {
      try {
        if (!secretAttempt) {
          throw new Error('Missing passord');
        }

        secret = await challengeKeychainFromSecret(keychain, secretAttempt);
      } catch (e) {}

      if (!secret) {
        throw new Error('E_INVALID_PASSWORD_CHALLENGE_OUTCOME');
      }
    } else {
      secret = secretAttempt;
      if (!secretAttempt) {
        throw new Error('E_INVALID_SECRET');
      }

      await saveKeychainToStorage(keychain, secretAttempt);
    }

    this.storeToCache(keychain, secret);

    return secret;
  }

  async setSecretIfEmpty(keychain, secret) {
    if (!keychain) {
      throw new Error('E_INVALID_KEYCHAIN');
    }

    if (!secret) {
      throw new Error('E_INVALID_SECRET');
    }

    if (await isKeychainInStorage(keychain)) {
      throw new Error('E_ALREADY_SET');
    }

    await saveKeychainToStorage(keychain, secret);
    this.storeToCache(keychain, secret);
  }

  storeToCache(keychain, secret) {
    this.unlocked[keychain] = {
      secret,
      timestamp: Date.now(),
    };
  }

  async hasSecret(keychain) {
    return await isKeychainInStorage(keychain);
  }

  async _DANGEROUS_wipe(confirmation, keychain) {
    if (confirmation !== true) {
      return;
    }

    await removeKeychainFromStorage(keychain);

    if (typeof this.unlocked[keychain] !== 'undefined') {
      delete this.unlocked[keychain];
    }

    return true;
  }
}

export default new KeychainService();
