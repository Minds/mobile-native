import messaging from '@react-native-firebase/messaging';

import AbstractPlatform from './abstract-platform';

/**
 * Android Platform
 */
export default class IosPlatform extends AbstractPlatform {
  async requestPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  }
}
