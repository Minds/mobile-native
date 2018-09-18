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
      const data = await AsyncStorage.getItem(namespace + 'access_token');
      return JSON.parse(data);
    } catch (err) {
      return null;
    }
  }

  /**
   * Set access token
   * @param {string} token
   */
  setAccessToken(token, expires) {
    return AsyncStorage.setItem(namespace + 'access_token', JSON.stringify({
      access_token: token,
      access_token_expires: expires
    }));
  }

  /**
   * Get refresh token
   */
  async getRefreshToken() {
    try {
      const data = await AsyncStorage.getItem(namespace + 'refresh_token');
      return JSON.parse(data);
    } catch (err) {
      return null;
    }
  }

  /**
   * Set access token
   * @param {string} token
   * @param {string} guid
   */
  setRefreshToken(token, expires) {
    return AsyncStorage.setItem(namespace + 'refresh_token', JSON.stringify({
      refresh_token: token,
      refresh_token_expires: expires
    }));
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
   * Clear messenger private keys
   */
  clearPrivateKey() {
    return AsyncStorage.removeItem(namespace + 'private_key');
  }

  /**
   * Clear all session data (logout)
   */
  async clear() {
    await AsyncStorage.removeItem(namespace + 'access_token');
    await AsyncStorage.removeItem(namespace + 'refresh_token');
    await AsyncStorage.removeItem(namespace + 'private_key');
  }
}

export default new SessionStorageService();