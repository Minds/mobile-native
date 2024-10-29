import {
  Notification,
  Notifications,
  Registered,
  RegistrationError,
} from 'react-native-notifications';
import { PermissionsAndroid, Platform } from 'react-native';

import { router } from './push/v2/router';
import { NotificationActionResponse } from 'react-native-notifications/lib/src/interfaces/NotificationActionResponse';
import { IS_IOS } from '~/config/Config';
import type { ApiService } from './api.service';
import type { AnalyticsService } from './analytics.service';
import type { LogService } from './log.service';

/**
 * Push Service
 */
export class PushService {
  token: string = '';
  /**
   * Constructor
   */
  constructor(
    private apiService: ApiService,
    private analyticsService: AnalyticsService,
    private logService: LogService,
  ) {
    Notifications.events().registerNotificationOpened(
      (
        notification: Notification,
        completion: () => void,
        action?: NotificationActionResponse,
      ) => {
        if (__DEV__) {
          console.log(
            '[PushService] Notification opened by device user',
            JSON.stringify(notification),
          );
          action &&
            console.log(
              `[PushService] Notification opened with an action identifier: ${action?.identifier} and response text: ${action?.text}`,
            );
        }
        let data = notification?.payload;
        // navigate
        data.uri && analyticsService.trackPushNotificationOpenedEvent(data.uri);
        router.navigate(data);
        completion();
      },
    );
  }

  onInitialNotification = notification => {
    if (!notification) {
      return;
    }
    if (__DEV__) {
      console.log('[PushService] onInitialNotification', notification);
    }
    // get notification data
    const data = notification?.payload;
    if (data?.json) {
      data.json = JSON.parse(data.json);
    }
    // delay navigation on app start
    setTimeout(() => {
      data.uri &&
        this.analyticsService.trackPushNotificationOpenedEvent(data.uri);
      router.navigate(data);
    }, 500);
  };

  /**
   * Register push service token
   */
  async registerToken() {
    console.log('[PushService] registerToken...');
    // ask for permissions for android 13
    if (!IS_IOS && (Platform.Version as number) >= 33) {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
    Notifications.registerRemoteNotifications();
    Notifications.events().registerRemoteNotificationsRegistered(
      (event: Registered) => {
        // TODO: Send the token to my server so it could send back push notifications...
        console.log('[PushService] Device Token Received', event.deviceToken);
        if (event.deviceToken) {
          this.token = event.deviceToken;
          this.apiService
            .post('api/v3/notifications/push/token', {
              service: IS_IOS ? 'apns' : 'fcm',
              token: event.deviceToken,
            })
            .catch(err => this.logService.exception('[PushService]', err))
            .then(() => this.logService.log('[PushService]: Registered'));
        }
      },
    );
    Notifications.events().registerRemoteNotificationsRegistrationFailed(
      (event: RegistrationError) => {
        console.error('[PushService] registration failed', event);
      },
    );
  }

  /**
   * Clear all notifications
   */
  clearNotifications() {
    Notifications.removeAllDeliveredNotifications();
  }

  /**
   * Set app badge
   * @param {integer} num
   */
  setBadgeCount(num) {
    if (IS_IOS) {
      Notifications.ios.setBadgeCount(num);
    } else {
      Notifications.android.setBadgeCount(num);
    }
  }

  /**
   * Handle the notification that open the app
   */
  handleInitialNotification() {
    Notifications.getInitialNotification().then(notification =>
      this.onInitialNotification(notification),
    );
  }

  /**
   * Get the device's push token if it is allowed
   */
  getToken() {
    return this.token;
  }
}
