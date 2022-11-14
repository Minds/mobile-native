import { Platform } from 'react-native';

import { router } from './push/v2/router';
import logService from './log.service';
import type IosPlatfom from './push/ios-platform';
import type AndroidPlatfom from './push/android-platform';
import analyticsService from './analytics.service';

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

    this.push.setOnNotificationOpened(notification => {
      //TODO: remove after we check the push notification issue

      // get notification data
      let data = notification.getData();
      console.log('[App] PUSH NOTIFICATION OPENED', data);
      data = data.pushNotification ? data.pushNotification : data;
      // navigate
      router.navigate(data);
      analyticsService.trackClick('push-notification');
    });

    this.push.setOnInitialNotification(notification => {
      // get notification data
      const data = notification.getData();
      if (data.json) data.json = JSON.parse(data.json);
      // delay navigation on app start
      setTimeout(() => {
        router.navigate(data);
      }, 500);
    });
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

  /**
   * Request notification permission
   */
  requestNotificationPermission() {
    return this.push.requestPermission();
  }

  /**
   * Registers a listener for received foreground push
   */
  registerOnNotificationReceived(callback: (notification) => void) {
    this.push.registerOnNotificationReceived(callback);
  }

  /**
   * Unregisters a listener for received foreground push
   */
  unregisterOnNotificationReceived(callback: (notification) => void) {
    this.push.unregisterOnNotificationReceived(callback);
  }
}

export default new PushService();
