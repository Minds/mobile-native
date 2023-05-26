import 'react-native';
import service from '../../../src/common/services/push.service';
import { MINDS_FEATURES } from '../../../src/config/Config';
import push from '../../../src/common/services/push/ios-platform';
import Router from '../../../src/common/services/push/v2/router';
import { Platform } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

jest.mock('../../../src/common/services/push/v2/router');
jest.mock('../../../src/common/services/push/ios-platform');
/**
 * Tests
 */
describe('Push service', () => {
  it('should push notifs', async () => {
    Platform.OS = 'ios';
    service.init();
    expect(service.push.init).toHaveBeenCalled();

    service.stop();
    expect(service.push.stop).toHaveBeenCalled();

    service.registerToken(2);
    expect(service.push.registerToken).toHaveBeenCalled();

    service.setOnInitialNotification(() => {});
    expect(service.push.setOnInitialNotification).toHaveBeenCalled();

    service.handleInitialNotification();
    expect(service.push.handleInitialNotification).toHaveBeenCalled();

    service.setBadgeCount();
    expect(service.push.setBadgeCount).toHaveBeenCalled();
  });
});
