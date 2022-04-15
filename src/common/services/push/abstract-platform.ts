import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

import { router } from './v2/router';
import sessionService from '../session.service';
import api from '../api.service';
import logService from '../log.service';
import { Alert } from 'react-native';

/**
 * Abstract Platform
 */
export default class AbstractPlatform {
  token: string | null = null;
  service = 'fcm';

  shouldRegister = false;

  onInitialNotification;

  async retrieveToken() {
    try {
      // Register the device with FCM
      await messaging().registerDeviceForRemoteMessages();

      // Get the token
      const token = await messaging().getToken();

      if (token) {
        console.log('[PushService] register ', token);
        this.token = token;
        sessionService.deviceToken = token;
        if (this.shouldRegister) {
          this.registerToken();
        }
      }
    } catch (err) {
      console.log('[PushService]', err);
    }
  }

  /**
   * Set app badge
   * @param {integer} num
   */
  setBadgeCount(num) {
    notifee.setBadgeCount(num);
  }

  /**
   * Init push service
   */
  init() {
    this.retrieveToken();

    //TODO: unregister
    notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          router.navigate(detail.notification.data);
          break;
      }
    });
  }

  /**
   * Handle the notification that open the app
   */
  async handleInitialNotification() {
    const batteryOptimizationEnabled = await notifee.isBatteryOptimizationEnabled();
    if (batteryOptimizationEnabled) {
      // 2. ask your users to disable the feature
      Alert.alert(
        'Restrictions Detected',
        'To ensure notifications are delivered, please disable battery optimization for the app.',
        [
          // 3. launch intent to navigate the user to the appropriate screen
          {
            text: 'OK, open settings',
            onPress: async () =>
              await notifee.openBatteryOptimizationSettings(),
          },
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        { cancelable: false },
      );
    }
    notifee.getInitialNotification().then(notification => {
      if (notification) {
        console.log('initial notification', notification);
        router.navigate(notification.notification.data);
      }
    });
  }

  /**
   * Register device to backend
   * @param {string} service apple or google
   */
  registerToken() {
    if (this.token) {
      api
        .post('api/v3/notifications/push/token', {
          service: this.service,
          token: this.token,
        })
        .catch(err => logService.exception('[PushService]', err))
        .then(() => logService.log('[PushService]: Registered'));
    } else {
      this.shouldRegister = true;
    }
  }
}
