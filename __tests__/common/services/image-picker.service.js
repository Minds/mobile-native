import * as ImagePicker from 'expo-image-picker';
import service from '../../../src/common/services/image-picker.service';

import androidPermissions from '../../../src/common/services/permissions.service';

jest.mock('expo-image-picker');
jest.mock('../../../AppMessages', () => ({}));
jest.mock('../../../src/common/services/permissions.service');
jest.mock('../../../src/common/services/i18n.service', () => ({
  t: jest.fn(),
  p: jest.fn(),
  l: jest.fn(),
  getCurrentLocale: jest.fn(),
  setLocale: jest.fn(),
  getSupportedLocales: jest.fn(),
}));

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
  Platform: {
    OS: 'android',
    select: obj => 'android',
  },
}));

/**
 * Tests
 */
describe('Image picker service', () => {
  it('should launch camera', async () => {
    androidPermissions.checkCamera.mockResolvedValue(true);
    androidPermissions.camera.mockResolvedValue(true);

    androidPermissions.checkReadExternalStorage.mockResolvedValue(true);
    androidPermissions.readExternalStorage.mockResolvedValue(true);

    ImagePicker.launchCameraAsync.mockResolvedValue({ assets: null });

    await service.launchCamera({ type: 'Images' });

    expect(ImagePicker.launchCameraAsync).toHaveBeenCalled();
  });

  it('should launch gallery picker', async () => {
    androidPermissions.checkCamera.mockResolvedValue(true);
    androidPermissions.camera.mockResolvedValue(true);

    androidPermissions.checkReadExternalStorage.mockResolvedValue(true);
    androidPermissions.readExternalStorage.mockResolvedValue(true);

    ImagePicker.launchImageLibraryAsync.mockResolvedValue({ assets: null });

    await service.launchImageLibrary({ type: 'Images' });

    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
  });
});
