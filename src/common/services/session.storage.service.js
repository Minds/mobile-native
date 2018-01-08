import { AsyncStorage } from 'react-native';

const namespace = '@Minds:';

/**
 * Session service
 */
class SessionStorageService {

  /**
   * Get access token of the current user
   */
  async getAccessToken() {
    try {
      const token = await AsyncStorage.getItem(namespace + 'access_token');
      return token;
    } catch (err) {
      return null;
    }
  }

  /**
   * Set access token
   * @param {string} access_token
   */
  setAccessToken(access_token) {
    return AsyncStorage.setItem(namespace + 'access_token', access_token);
  }

  /**
   * Get messenger private key of the current user
   */
  async getPrivateKey() {
    try {
      const privateKey = await AsyncStorage.getItem(namespace + 'private_key');
      return privateKey;
    } catch (err) {
      return null;
    }
  }

  /**
   * Set private key
   * @param {string} privateKey
   */
  setPrivateKey(privateKey) {
    AsyncStorage.setItem(namespace + 'private_key', privateKey);
  }

  /**
   * Clear all session data (logout)
   */
  async clear() {
    await AsyncStorage.removeItem(namespace + 'access_token');
    await AsyncStorage.removeItem(namespace + 'private_key');
  }
}

export default new SessionStorageService();