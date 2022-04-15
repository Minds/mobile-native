import { Platform } from 'react-native';

import logService from './log.service';
import type IosPlatfom from './push/ios-platform';
import type AndroidPlatfom from './push/android-platform';

/**
 * Push Service
 */
export class PushService {
  push: IosPlatfom | AndroidPlatfom;

  /**
   * Constructor
   */
  constructor() {
    // build platform instance
    const platform =
      Platform.OS === 'ios'
        ? require('./push/ios-platform').default
        : require('./push/android-platform').default;
    this.push = new platform();
  }

  /**
   * Init
   */
  init() {
    try {
      this.push.init();
    } catch (err) {
      logService.exception(
        '[PushService] Error on push notification initialization',
        err,
      );
    }
  }

  /**
   * Register push service token
   */
  registerToken() {
    this.push.registerToken();
  }

  /**
   * Set app badge
   * @param {integer} num
   */
  setBadgeCount(num) {
    this.push.setBadgeCount(num);
  }

  /**
   * Handle the notification that open the app
   */
  handleInitialNotification() {
    this.push.handleInitialNotification();
  }

  /**
   * Request notification permission
   */
  requestNotificationPermission() {
    return this.push.requestPermission();
  }
}

export default new PushService();
