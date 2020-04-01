//@ts-nocheck
import storageService from "./storage.service";

/**
 * Session service
 */
class SessionStorageService {

  /**
   * Get tokens of the current user
   */
  async getAll() {
    try {
      const data = await storageService.multiGet(['access_token', 'refresh_token', 'logged_in_user']);

      const accessToken = data[0][1], refreshToken = data[1][1], user = data[2][1];

      return [accessToken ,refreshToken, user];
    } catch (err) {
      return null;
    }
  }

  /**
   * Get access token of the current user
   */
  async getAccessToken() {
    return await storageService.getItem('access_token');
  }

  /**
   * Set access token
   * @param {string} token
   */
  setAccessToken(token, expires) {
    return storageService.setItem('access_token', {
      access_token: token,
      access_token_expires: expires
    });
  }

  /**
   * Set user
   * @param {object} user
   */
  setUser(user) {
    return storageService.setItem('logged_in_user', user);
  }

  /**
   * Get user
   */
  async getUser() {
    return await storageService.getItem('logged_in_user');
  }

  /**
   * Get refresh token
   */
  async getRefreshToken() {
    return await storageService.getItem('refresh_token');
  }

  /**
   * Set access token
   * @param {string} token
   * @param {string} guid
   */
  setRefreshToken(token, expires) {
    return storageService.setItem('refresh_token', {
      refresh_token: token,
      refresh_token_expires: expires
    });
  }

  /**
   * Get messenger private key of the current user
   */
  async getPrivateKey() {
    return await storageService.getItem('private_key');
  }

  /**
   * Set private key
   * @param {string} privateKey
   */
  setPrivateKey(privateKey) {
    storageService.setItem('private_key', privateKey);
  }

  /**
   * Clear messenger private keys
   */
  clearPrivateKey() {
    return storageService.removeItem('private_key');
  }

  /**
   * Clear all session data (logout)
   */
  async clear() {
    await storageService.multiRemove(['access_token', 'refresh_token', 'private_key', 'logged_in_user']);
  }
}

export default new SessionStorageService();