import { Platform } from 'react-native';
import service from '../../../src/common/services/download.service';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import permissions from '../../../src/common/services/permissions.service';

jest.mock('../../../src/common/services/permissions.service');
jest.mock('../../../src/common/services/session.service');
jest.mock('@react-native-camera-roll/camera-roll');
const FAKE_URL = 'https://fake.com';
/**
 * Tests
 */
describe('Download service', () => {
  it('should call camera roll on android', async () => {
    permissions.checkWriteExternalStorage.mockReturnValue(false);
    permissions.writeExternalStorage.mockReturnValue(false);
    Platform.OS = 'notios';
    await service.downloadToGallery(FAKE_URL);
    expect(CameraRoll.save).not.toHaveBeenCalled();
  });

  it('should call camera roll', async () => {
    // call tested method
    Platform.OS = 'ios';
    permissions.checkMediaLibrary.mockReturnValue(true);
    await service.downloadToGallery(FAKE_URL);
    expect(CameraRoll.save).toHaveBeenCalled();
  });
});
