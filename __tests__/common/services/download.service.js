import { Platform } from 'react-native';
import service from '../../../src/common/services/download.service';
import CameraRoll from '@react-native-community/cameraroll';
import permissions from '../../../src/common/services/permissions.service';

CameraRoll.save = jest.fn();

jest.mock('../../../src/common/services/permissions.service');
jest.mock('../../../src/common/services/session.service');
/**
 * Tests
 */
describe('Download service', () => {
  it('should call camera roll on android', async () => {
    permissions.checkWriteExternalStorage.mockReturnValue(false);
    permissions.writeExternalStorage.mockReturnValue(false);
    Platform.OS = 'notios';
    await service.downloadToGallery('url');
    expect(CameraRoll.save).not.toHaveBeenCalled();
  });

  it('should call camera roll', async () => {
    // call tested method
    Platform.OS = 'ios';
    permissions.checkMediaLibrary.mockReturnValue(true);
    await service.downloadToGallery('url');
    expect(CameraRoll.save).toHaveBeenCalled();
  });
});
