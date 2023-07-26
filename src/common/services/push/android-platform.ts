//@ts-nocheck
import {
  NotificationsAndroid,
  PendingNotifications,
} from 'react-native-notifications';
import AbstractPlatform from './abstract-platform';
import logService from '../log.service';
import sessionService from '../session.service';
import EventEmitter from 'eventemitter3';
import permissionsService from '~/common/services/permissions.service';

/**
 * Android Platform
 */
export default class AndroidPlatfom extends AbstractPlatform {
  events: EventEmitter = new EventEmitter();

  /**
   * Init push service
   */
  init() {
    NotificationsAndroid.setNotificationReceivedListener(
      this.handleForegroundNotification,
    );
    NotificationsAndroid.setRegistrationTokenUpdateListener(deviceToken => {
      this.token = deviceToken;
      sessionService.deviceToken = deviceToken;
      if (this.shouldRegister) {
        this.registerToken();
      }
    });
  }

  /**
   * Handles the global foreground and sends it to the listeners
   */
  private handleForegroundNotification = notification => {
    this.events.emit('foreground', notification);
  };

  registerOnNotificationReceived(callback: (notification) => void) {
    this.events.addListener('foreground', callback);
  }

  unregisterOnNotificationReceived(callback: (notification) => void) {
    this.events.removeListener('foreground', callback);
  }

  /**
   * Set app badge
   * @param {integer} num
   */
  setBadgeCount(num) {
    NotificationsAndroid.setBadgeCount(num);
  }

  registerToken() {
    super.registerToken('fcm');
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
      .then(notification => {
        if (notification && this.onInitialNotification)
          this.onInitialNotification(notification);
      })
      .catch(err => logService.exception('[PushService]', err));
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
    return permissionsService.requestNotificationPermission();
  }

  requestPermission() {
    permissionsService.requestNotificationPermission();
  }
}
