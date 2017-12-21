import { AsyncStorage } from 'react-native';

const namespace = '@Minds:';

/**
 * Session service
 */
class SessionService {
  _onLogout = null;

  /**
   * set onlogout callback
   */
  onLogout(fn) {
    this._onLogout = fn;
  }


  /**
   * Get access token of the current user
   */
  async getAccessToken() {
    try {
      const token = await AsyncStorage.getItem(namespace + 'access_token');
      return token;
    } catch(err) {
      return null;
    }
  }

  /**
   * Get messenger private key of the current user
   */
  getPrivateKey() {
    return AsyncStorage.getItem(namespace + 'private_key');
  }

  /**
   * Set private key
   * @param {string} privateKey
   */
  setPrivateKey(privateKey) {
    AsyncStorage.setItem(namespace + 'private_key', privateKey);
  }

  /**
   * Set access token
   * @param {string} access_token
   */
  async setAccessToken(access_token) {
    await AsyncStorage.setItem(namespace + 'access_token', access_token);
    return true;
  }

  /**
   * Clear all session data (logout)
   */
  async clear() {
    await AsyncStorage.removeItem(namespace + 'access_token');
    await AsyncStorage.removeItem(namespace + 'private_key');

    if (this._onLogout) {
      this._onLogout();
    }
    // TODO: navigate to login
  }

  /**
   * There is a user logged in?
   */
  async isLoggedIn() {
    const loggedin = await this.getAccessToken();
    return loggedin !== null;
  }

}

export default new SessionService();