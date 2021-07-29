import { storages } from './storages.service';

/**
 * Session service
 */
export class SessionStorageService {
  /**
   * Get tokens of the current user
   */
  getAll() {
    try {
      const data = storages.session.getMultipleItems([
        'access_token',
        'refresh_token',
        'logged_in_user',
      ]);

      const accessToken = data[0][1],
        refreshToken = data[1][1],
        user = data[2][1];

      return [accessToken, refreshToken, user];
    } catch (err) {
      return null;
    }
  }

  /**
   * Set access token
   * @param {string} token
   */
  setAccessToken(token, expires) {
    storages.session.setMap('access_token', {
      access_token: token,
      access_token_expires: expires,
    });
  }

  /**
   * Set user
   * @param {object} user
   */
  setUser(user) {
    storages.session.setMap('logged_in_user', user);
  }

  /**
   * Set access token
   * @param {string} token
   * @param {string} guid
   */
  setRefreshToken(token, expires) {
    storages.session.setMap('refresh_token', {
      refresh_token: token,
      refresh_token_expires: expires,
    });
  }

  /**
   * Get messenger private key of the current user
   */
  getPrivateKey(): Promise<string | null | undefined> {
    return storages.session.getStringAsync('private_key');
  }

  /**
   * Set private key
   * @param {string} privateKey
   */
  setPrivateKey(privateKey: string) {
    storages.session.setString('private_key', privateKey);
  }

  /**
   * Clear messenger private keys
   */
  clearPrivateKey() {
    storages.session.removeItem('private_key');
  }

  /**
   * Clear all session data (logout)
   */
  async clear() {
    await storages.session.clearStore();
  }
}
