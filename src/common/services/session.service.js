import { AsyncStorage } from 'react-native';

const namespace = '@Minds:';

class SessionService {

  async getAccessToken() {
    try {
      const token = await AsyncStorage.getItem(namespace + 'access_token');
      return token;
    } catch(err) {
      return null;
    }
  }

  getPrivateKey() {
    return AsyncStorage.getItem(namespace + 'private_key');
  }

  setPrivateKey(privateKey) {
    AsyncStorage.setItem(namespace + 'private_key', privateKey);
  }

  async setAccessToken(access_token) {
    await AsyncStorage.setItem(namespace + 'access_token', access_token);
    return true;
  }

  async clear() {
    await AsyncStorage.removeItem(namespace + 'access_token');
    await AsyncStorage.removeItem(namespace + 'private_key');
    // TODO: navigate to login
  }

  async isLoggedIn() {
    const loggedin = await this.getAccessToken();
    return loggedin !== null;
  }

}

export default new SessionService();