import { ISessionStorage, IWalletConnectSession } from '@walletconnect/types';
import AsyncStorage from '@react-native-community/async-storage';

const WC_NAMESPACE = 'walletconnect_session';

export default class SessionStorage implements ISessionStorage {
  session: IWalletConnectSession | null = null;

  async loadFromStorage() {
    const data = await AsyncStorage.getItem(WC_NAMESPACE);
    if (data) {
      this.session = JSON.parse(data);
    } else {
      console.log('NO SESSION STORED');
    }
  }

  getSession(): IWalletConnectSession | null {
    console.log('READING SESSION');
    return this.session;
  }
  setSession(session: IWalletConnectSession) {
    console.log('setSession', session);
    this.session = session;
    AsyncStorage.setItem(WC_NAMESPACE, JSON.stringify(session));
    return session;
  }
  removeSession() {
    this.session = null;
    AsyncStorage.removeItem(WC_NAMESPACE);
  }
}
