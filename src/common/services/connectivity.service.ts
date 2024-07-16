import NetInfo from '@react-native-community/netinfo';
import { observable, action, computed } from 'mobx';

/**
 * Connectivity service
 */
export class ConnectivityService {
  @observable isInternetReachable = false;

  @observable connectionInfo = {
    type: 'unknown',
    isConnected: false,
  };

  /**
   * Is connected
   */
  @computed get isConnected() {
    // TODO: add back  after fixed https://github.com/react-native-netinfo/react-native-netinfo/issues/669
    return this.connectionInfo.type !== 'none'; // && this.isInternetReachable;
  }

  /**
   * Constructor
   */
  constructor() {
    NetInfo.configure({
      reachabilityUrl: 'https://1.1.1.1/cdn-cgi/trace',
      reachabilityTest: async response => response.status === 200,
      reachabilityLongTimeout: 120 * 1000, // 120s
      reachabilityShortTimeout: 60 * 1000, // 60s
      reachabilityRequestTimeout: 300 * 1000, // 300s
    });
    NetInfo.addEventListener(this.handleConnectivityChange);
  }

  /**
   * Connectivity changes handler
   */
  @action
  handleConnectivityChange = connectionInfo => {
    this.connectionInfo = connectionInfo;
    if (__DEV__) {
      console.log('Connection change, type: ' + connectionInfo.type);
    }
    this.setisInternetReachable(connectionInfo.isConnected);
  };

  @action
  setisInternetReachable(value) {
    this.isInternetReachable = value;
  }
}
