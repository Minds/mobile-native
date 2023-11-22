import { Platform } from 'react-native';
import service from '../../../src/common/services/download.service';
import * as MediaLibrary from 'expo-media-library';

jest.mock('../../../src/common/services/session.service');
jest.mock('expo-media-library');
const FAKE_URL = 'https://fake.com';
/**
 * Tests
 */
describe('Download service', () => {
  it('should call camera roll on android', async () => {
    Platform.OS = 'notios';
    await service.downloadToGallery(FAKE_URL);
    expect(MediaLibrary.saveToLibraryAsync).not.toHaveBeenCalled();
  });

  it('should call camera roll', async () => {
    // call tested method
    Platform.OS = 'ios';
    await service.downloadToGallery(FAKE_URL);
    expect(MediaLibrary.saveToLibraryAsync).toHaveBeenCalled();
  });
});
