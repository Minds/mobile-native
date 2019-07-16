import NetInfo from "@react-native-community/netinfo";
import {
  observable,
  action,
  computed,
} from 'mobx'

import {
  CONECTIVITY_CHECK_INTERVAL,
  CONECTIVITY_CHECK_URI
} from '../../config/Config';

/**
 * Connectivity service
 */
class ConnectivityService {

  @observable isInternetReachable = true;

  @observable connectionInfo = {
    type: 'unknown',
    isConnected: false
  };

  /**
   * Is connected
   */
  @computed get isConnected() {
    return this.connectionInfo.type !== 'none' && this.isInternetReachable;
  }

  /**
   * Constructor
   */
  constructor() {
    // add listener
    NetInfo.addEventListener(
      this.handleConnectivityChange
    );
  }

  /**
   * Init
   */
  @action
  init = async () => {
    // get initial connection (call twice to fix a bug)
    await NetInfo.getConnectionInfo();
    const connectionInfo = await NetInfo.getConnectionInfo();

    this.connectionInfo = connectionInfo;
    console.log('Initial connection, type: ' + connectionInfo.type);

    return connectionInfo;
  }

  /**
   * Connectivity changes handler
   */
  @action
  handleConnectivityChange = (connectionInfo) => {
    this.connectionInfo = connectionInfo;

    if (this.connectionInfo.type != 'none') {
      this.startConnectivityCheck();
    } else {
      this.stopConnectivityCheck();
    }

    console.log('Connection change, type: ' + connectionInfo.type);
  }

  @action
  setisInternetReachable(value) {
    this.isInternetReachable = value;
  }

  /**
   * Start connectivity check
   */
  async startConnectivityCheck() {
    // clear previous interval
    this.stopConnectivityCheck();
    // create interval
    this.checkInterval = setInterval( async() => {
      this.setisInternetReachable(await this.checkInternet());
    }, CONECTIVITY_CHECK_INTERVAL);
    // check immediately
    this.setisInternetReachable(await this.checkInternet());
  }

  /**
   * Stop connectivity check
   */
  stopConnectivityCheck() {
    if (this.checkInterval) clearInterval(this.checkInterval);
  }

  /**
   * Check connectivity fetching only headers
   */
  checkInternet() {
    return new Promise((resolve) => {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', CONECTIVITY_CHECK_URI, true);
        xhr.timeout = 3000;
        xhr.onload = function () {
          resolve(true);
        };
        xhr.onerror = function() {
          resolve(false);
        }
        xhr.ontimeout = function() {
          resolve(false);
        }
        xhr.send(null);
      } catch (e) {
        resolve(false);
      }
    });
  }
}

export default new ConnectivityService();