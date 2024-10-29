import { Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

import { DownloadService } from '~/common/services/download.service';
import { I18nService } from '~/common/services/i18n.service';
jest.mock('~/common/services/i18n.service');
jest.mock('expo-media-library');

const FAKE_URL = 'https://fake.com';

/**
 * Tests
 */
describe('Download service', () => {
  const i18n = new I18nService();
  const service = new DownloadService(i18n);

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
