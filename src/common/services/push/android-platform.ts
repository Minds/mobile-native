//@ts-nocheck
import {
  NotificationsAndroid,
  PendingNotifications,
} from 'react-native-notifications';
import AbstractPlatform from './abstract-platform';
import logService from '../log.service';

/**
 * Android Platform
 */
export default class AndroidPlatfom extends AbstractPlatform {
  /**
   * Init push service
   */
  init() {
    NotificationsAndroid.setNotificationReceivedListener((notification) => {
      logService.log('Notification received', notification);
      //NotificationsAndroid.localNotification(notification.data);
    });

    NotificationsAndroid.setRegistrationTokenUpdateListener((deviceToken) => {
      this.token = deviceToken;
      if (this.shouldRegister) {
        this.registerToken();
      }
    });
  }

  /**
   * Set app badge
   * @param {integer} num
   */
  setBadgeCount(num) {
    NotificationsAndroid.setBadgeCount(num);
  }

  registerToken() {
    super.registerToken('google');
  }

  /**
   * Set on notification opened handler
   * @param {function} handler
   */
  setOnNotificationOpened(handler) {
    NotificationsAndroid.setNotificationOpenedListener(handler);
  }

  /**
   * Handle the notification that open the app
   */
  handleInitialNotification() {
    PendingNotifications.getInitialNotification()
      .then((notification) => {
        if (notification && this.onInitialNotification)
          this.onInitialNotification(notification);
      })
      .catch((err) => logService.exception('[PushService]', err));
  }
  /**
   * Stop push notification service
   */
  stop() {
    NotificationsAndroid.clearNotificationOpenedListener();
  }

  /**
   * Android don't need permissions from user
   */
  checkPermissions() {
    return Promise.resolve(true);
  }
}
