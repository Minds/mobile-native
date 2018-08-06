import {
  CameraRoll,
  Platform,
} from 'react-native';
import service from '../../../src/common/services/download.service';
import session from '../../../src/common/services/session.service';
import RNFetchBlob from 'react-native-fetch-blob';
import permissions from '../../../src/common/services/android-permissions.service';

CameraRoll.saveToCameraRoll = jest.fn();

jest.mock('../../../src/common/services/android-permissions.service');
jest.mock('../../../src/common/services/session.service');
jest.mock('react-native-fetch-blob');
/**
 * Tests
 */
describe('Download service', () => {


  it('should call camera roll on android', async () => {
    permissions.checkWriteExternalStorage = jest.fn();
    permissions.writeExternalStorage = jest.fn();
    permissions.checkWriteExternalStorage.mockReturnValue(false);
    permissions.writeExternalStorage.mockReturnValue(false);
    Platform.OS = 'notios';
    await service.downloadToGallery('url');
    expect(CameraRoll.saveToCameraRoll).not.toHaveBeenCalled();
  });
  
  it('should call camera roll', async () => {
    // call tested method
    Platform.OS = 'ios';
    await service.downloadToGallery('url');
    expect(CameraRoll.saveToCameraRoll).toHaveBeenCalled();

  }); 
});