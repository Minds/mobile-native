import { NetInfo } from 'react-native';
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

  @observable hasInternet = true;

  @observable connectionInfo = {
    type: 'unknown',
    effectiveType: 'unknown',
  };

  checkInterval = null;

  /**
   * Is connected
   */
  @computed get isConnected() {
    return this.connectionInfo.type !== 'none' && this.hasInternet;
  }

  /**
   * Constructor
   */
  constructor() {
    // add listener
    NetInfo.addEventListener(
      'connectionChange',
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
    console.log('Initial connection, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);

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

    console.log('Connection change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
  }

  @action
  setHasInternet(value) {
    this.hasInternet = value;
  }

  /**
   * Start connectivity check
   */
  startConnectivityCheck() {
    this.checkInterval = setInterval( async() => {
      this.setHasInternet(await this.checkInternet());
      console.log('checking internet', this.hasInternet);
    }, 3000);
  }

  /**
   * Stop connectivity check
   */
  stopConnectivityCheck() {
    clearInterval(this.checkInterval);
  }

  /**
   * Check connectivity fetching only headers
   */
  checkInternet() {
    return new Promise((resolve) => {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', CONECTIVITY_CHECK_URI, true);
        xhr.timeout = CONECTIVITY_CHECK_INTERVAL;
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