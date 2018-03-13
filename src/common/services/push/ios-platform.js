import NotificationsIOS from 'react-native-notifications';
import AbstractPlatform from './abstract-platform';

/**
 * Ios Platform
 */
export default class IosPlatfom extends AbstractPlatform {

  /**
   * Init push service
   */
  init() {
    NotificationsIOS.addEventListener('remoteNotificationsRegistered', this._onPushRegistered.bind(this));
    NotificationsIOS.addEventListener('remoteNotificationsRegistrationFailed', this._onPushRegistrationFailed.bind(this));
    NotificationsIOS.addEventListener('notificationOpened', this._onNotificationOpened.bind(this));
    NotificationsIOS.requestPermissions();
  }

  /**
   * Stop push service
   */
  stop() {
    NotificationsIOS.removeEventListener('remoteNotificationsRegistered', this._onPushRegistered.bind(this));
    NotificationsIOS.removeEventListener('remoteNotificationsRegistrationFailed', this._onPushRegistrationFailed.bind(this));
    NotificationsIOS.removeEventListener('notificationOpened', this._onNotificationOpened.bind(this));
  }

  /**
   * Set app badge
   * @param {integer} num 
   */
  setBadgeCount(num) {
    NotificationsIOS.setBadgeCount(num);
  }

  /**
   * Set on notification opened handler
   * @param {function} handler
   */
  setOnNotificationOpened(handler) {
    this._onNotificationOpenedHandler = handler;
  }

  /**
   * Returns a promise that resolves the user permissions
   */
  checkPermissions() {
    return NotificationsIOS.checkPermissions();
  }

  _onNotificationOpened(notification) {
    this._onNotificationOpenedHandler(handler);
  }

  _onPushRegistered(deviceToken) {
    this.token = deviceToken;
  }

  // register token into backend
  registerToken() {
    super.registerToken('apple');
  }


  _onPushRegistrationFailed(error) {
    // For example:
    //
    // error={
    //   domain: 'NSCocoaErroDomain',
    //   code: 3010,
    //   localizedDescription: 'remote notifications are not supported in the simulator'
    // }
    console.error(error);
  }
}