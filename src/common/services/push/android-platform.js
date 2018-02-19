import { NotificationsAndroid } from 'react-native-notifications';
import AbstractPlatform from './abstract-platform';

/**
 * Android Platform
 */
export default class AndroidPlatfom extends AbstractPlatform {

  /**
   * Init push service
   */
  init() {
    console.log('init')
    NotificationsAndroid.setRegistrationTokenUpdateListener((deviceToken) => {
      //cd reconsole.log('token', deviceToken);
      this.token = deviceToken;
    });
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
   * Stop push notification service
   */
  stop() {
    NotificationsAndroid.setNotificationOpenedListener(undefined);
  }

  /**
   * Android don't need permissions from user
   */
  checkPermissions() {
    return Promise.resolve(true)
  }

}