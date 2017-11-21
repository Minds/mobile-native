import { AsyncStorage } from 'react-native';

const namespace = '@Minds:access_token';

class SessionService {

  async getAccessToken() {
    try {
      const token = await AsyncStorage.getItem(namespace);
      return token;
    } catch(err) {
      return null;
    }
  }

  async setAccessToken(access_token) {
    await AsyncStorage.setItem(namespace, access_token);
    return true;
  }

  async clear() {
    await AsyncStorage.removeItem(namespace);
    // TODO: navigate to login
  }

  async isLoggedIn() {
    const loggedin = await this.getAccessToken();
    return loggedin !== null;
  }

}

export default new SessionService();