import { Platform } from 'react-native';

import Router from './push/v2/router';
import logService from './log.service';
import type IosPlatfom from './push/ios-platform';
import type AndroidPlatfom from './push/android-platform';

/**
 * Push Service
 */
export class PushService {
  push: IosPlatfom | AndroidPlatfom;
  router;

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

    this.push.setOnNotificationOpened((notification) => {
      // get notification data
      const data = notification.getData();
      if (data.json) data.json = JSON.parse(data.json);
      // navigate
      this.router.navigate(data);
    });

    this.push.setOnInitialNotification((notification) => {
      // get notification data
      const data = notification.getData();
      if (data.json) data.json = JSON.parse(data.json);
      // delay navigation on app start
      setTimeout(() => {
        this.router.navigate(data);
      }, 500);
    });
  }

  /**
   * Init
   */
  init() {
    this.router = new Router();
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
   * Stop listen for push notification
   */
  stop() {
    this.push.stop();
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
   * Set initial notification handler
   * @param {function} fn
   */
  setOnInitialNotification(fn) {
    this.push.setOnInitialNotification(fn);
  }

  /**
   * Handle the notification that open the app
   */
  handleInitialNotification() {
    this.push.handleInitialNotification();
  }
}

export default new PushService();
