import { Platform, Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import service from '../../../src/common/services/image-picker.service';
import i18n from '../../../src/common/services/i18n.service';

import androidPermissions from '../../../src/common/services/android-permissions.service';

jest.mock('../../../src/common/services/android-permissions.service');
jest.mock('../../../src/common/services/i18n.service', () => ({ 
    t: jest.fn(),
    p: jest.fn(),
    l: jest.fn(),
    getCurrentLocale: jest.fn(),
    setLocale: jest.fn(),
    getSupportedLocales: jest.fn()
}));


jest.mock('react-native', () => ({
  Alert: { 
    alert: jest.fn()
  },
  Platform: {
    OS: 'androit'
  }
}));

/**
 * Tests
 */
describe('Session storage service', () => {

  it('should set and get initial values', async () => {
    Alert.alert = jest.fn();

    service.showMessage('message');
    jest.runAllTimers();
    expect(Alert.alert).toHaveBeenCalled();
  });

  it('should check if needs to ask for permission', async () => {
    androidPermissions.checkReadExternalStorage.mockResolvedValue(-1);

    service.checkGalleryPermissions();

    expect(androidPermissions.checkReadExternalStorage).toHaveBeenCalled();
  });

  it('should check if needs to ask for permission', async () => {
    androidPermissions.checkReadExternalStorage.mockResolvedValue(false);
    androidPermissions.readExternalStorage.mockResolvedValue(false);

    await service.checkGalleryPermissions();

    expect(androidPermissions.checkReadExternalStorage).toHaveBeenCalled();
    expect(androidPermissions.readExternalStorage).toHaveBeenCalled();
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
    ImagePicker.launchCamera.mockResolvedValue({})

    service.launchCamera('photo');

    expect(ImagePicker.launchCamera).toHaveBeenCalled();
  });


  it('should launch gallery picker', async () => {
    androidPermissions.checkCamera.mockResolvedValue(true);
    androidPermissions.camera.mockResolvedValue(true);

    androidPermissions.checkReadExternalStorage.mockResolvedValue(true);
    androidPermissions.readExternalStorage.mockResolvedValue(true);
    ImagePicker.launchImageLibrary.mockResolvedValue({})

    service.launchImageLibrary();

    expect(ImagePicker.launchImageLibrary).toHaveBeenCalled();
  });


  it('should launch show', async () => {
    androidPermissions.checkCamera.mockResolvedValue(true);
    androidPermissions.camera.mockResolvedValue(true);

    androidPermissions.checkReadExternalStorage.mockResolvedValue(true);
    androidPermissions.readExternalStorage.mockResolvedValue(true);
    ImagePicker.showImagePicker.mockResolvedValue({})

    service.show();

    expect(ImagePicker.showImagePicker).toHaveBeenCalled();
  });
});