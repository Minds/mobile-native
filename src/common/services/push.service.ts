//@ts-nocheck
import {
  Platform,
} from 'react-native';
import { platform } from 'os';

import Router from './push/router';
import logService from './log.service';

/**
 * Push Service
 */
class PushService {
  push;
  router;

  /**
   * Constructor
   */
  constructor() {
    // build platform instance
    const platform = (Platform.OS == 'ios') ? require('./push/ios-platform').default : require('./push/android-platform').default;
    this.push = new platform();

    this.router = new Router();

    this.push.setOnNotificationOpened((notification) => {
      // get notification data
      const data = notification.getData();
      if (data.json) data.json = JSON.parse(data.json);
      // navigate
      this.router.navigate(data);

    })

    this.push.setOnInitialNotification((notification) => {
      // get notification data
      const data = notification.getData();
      if (data.json) data.json = JSON.parse(data.json);
      // delay navigation on app start
      setTimeout(() => {
        this.router.navigate(data);
      }, 100);

    })
  }

  /**
   * Init
   */
  init() {
    try {
      this.push.init();
    } catch(err) {
      logService.exception('[PushService] Error on push notification initialization', err);
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