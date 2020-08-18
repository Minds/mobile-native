import { Platform, Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import service from '../../../src/common/services/image-picker.service';
import i18n from '../../../src/common/services/i18n.service';

import androidPermissions from '../../../src/common/services/permissions.service';

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
  },
}));

/**
 * Tests
 */
describe('Session storage service', () => {
  it('should check if needs to ask for permission', async () => {
    androidPermissions.checkReadExternalStorage.mockResolvedValue(false);

    service.checkGalleryPermissions();

    expect(androidPermissions.checkReadExternalStorage).toHaveBeenCalled();
  });

  it('should check if needs to ask for permission', async () => {
    androidPermissions.checkReadExternalStorage.mockResolvedValue(false);

    await service.checkGalleryPermissions();

    expect(androidPermissions.checkReadExternalStorage).toHaveBeenCalled();
  });

  it('should check if needs to ask for camera permission', async () => {
    androidPermissions.checkCamera.mockResolvedValue(-1);

    service.checkCameraPermissions();

    expect(androidPermissions.checkCamera).toHaveBeenCalled();
  });

  it('should check if needs to ask for camera permission', async () => {
    androidPermissions.checkCamera.mockResolvedValue(false);
    androidPermissions.camera.mockResolvedValue(false);

    await service.checkCameraPermissions();

    expect(androidPermissions.checkCamera).toHaveBeenCalled();
    expect(androidPermissions.camera).toHaveBeenCalled();
  });

  it('should check if needs to ask for general permissions', async () => {
    androidPermissions.checkCamera.mockResolvedValue(false);
    androidPermissions.camera.mockResolvedValue(false);

    androidPermissions.checkReadExternalStorage.mockResolvedValue(false);
    androidPermissions.readExternalStorage.mockResolvedValue(false);

    await service.checkPermissions();

    expect(androidPermissions.checkCamera).toHaveBeenCalled();
  });

  it('should check if needs to ask for general permissions', async () => {
    androidPermissions.checkCamera.mockResolvedValue(true);
    androidPermissions.camera.mockResolvedValue(true);

    androidPermissions.checkReadExternalStorage.mockResolvedValue(true);
    androidPermissions.readExternalStorage.mockResolvedValue(true);

    await service.checkPermissions();

    expect(androidPermissions.checkCamera).toHaveBeenCalled();
  });

  it('should launch camera', async () => {
    androidPermissions.checkCamera.mockResolvedValue(true);
    androidPermissions.camera.mockResolvedValue(true);

    androidPermissions.checkReadExternalStorage.mockResolvedValue(true);
    androidPermissions.readExternalStorage.mockResolvedValue(true);
    ImagePicker.openCamera.mockImplementation();

    await service.launchCamera('photo');

    expect(ImagePicker.openCamera).toHaveBeenCalled();
  });

  it('should launch gallery picker', async () => {
    androidPermissions.checkCamera.mockResolvedValue(true);
    androidPermissions.camera.mockResolvedValue(true);

    androidPermissions.checkReadExternalStorage.mockResolvedValue(true);
    androidPermissions.readExternalStorage.mockResolvedValue(true);
    ImagePicker.openPicker.mockImplementation();

    await service.launchImageLibrary();

    expect(ImagePicker.openPicker).toHaveBeenCalled();
  });

  it('should launch show', async () => {
    androidPermissions.checkCamera.mockResolvedValue(true);
    androidPermissions.camera.mockResolvedValue(true);

    androidPermissions.checkReadExternalStorage.mockResolvedValue(true);
    androidPermissions.readExternalStorage.mockResolvedValue(true);
    ImagePicker.openPicker.mockImplementation();

    await service.show();

    expect(ImagePicker.openPicker).toHaveBeenCalled();
  });
});
