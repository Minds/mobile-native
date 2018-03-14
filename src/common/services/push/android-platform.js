import { NotificationsAndroid, PendingNotifications } from 'react-native-notifications';
import AbstractPlatform from './abstract-platform';

/**
 * Android Platform
 */
export default class AndroidPlatfom extends AbstractPlatform {

  /**
   * Init push service
   */
  init() {
    NotificationsAndroid.setNotificationReceivedListener((notification) => {
      console.log("Notification received", notification);
      //NotificationsAndroid.localNotification(notification.data);
    });


    NotificationsAndroid.setRegistrationTokenUpdateListener((deviceToken) => {
      this.token = deviceToken;
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

          if (notification && this.onInitialNotification) this.onInitialNotification(notification);
      })  	
      .catch((err) => console.error("getInitialNotifiation() failed", err));
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
    return Promise.resolve(true)
  }

}