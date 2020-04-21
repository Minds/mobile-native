//@ts-nocheck
import { Platform, Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker';

import androidPermissions from './android-permissions.service';

import i18n from './i18n.service';

/**
 * Image picker service
 */
class ImagePickerService {
  showMessage(message) {
    setTimeout(() => {
      // without settimeout alert is not shown
      Alert.alert(message);
    }, 100);
  }

  /**
   * Check if we have permission or ask the user
   */
  async checkGalleryPermissions() {
    let allowed = true;

    if (Platform.OS != 'ios') {
      allowed = await androidPermissions.checkReadExternalStorage();

      if (allowed === -1) {
        this.showMessage(i18n.t('imagePicker.deniedExternal'));
      } else if (!allowed) {
        // request user permission
        allowed = await androidPermissions.readExternalStorage();
      }
    }

    return allowed;
  }

  /**
   * Check if we have permission or ask the user
   */
  async checkCameraPermissions() {
    let allowed = true;

    if (Platform.OS != 'ios') {
      allowed = await androidPermissions.checkCamera();

      if (allowed === -1) {
        this.showMessage(i18n.t('imagePicker.deniedCamera'));
      } else if (!allowed) {
        // request user permission
        allowed = await androidPermissions.camera();
      }
    }

    return allowed;
  }

  async checkPermissions() {
    const camera = await this.checkCameraPermissions();
    const gallery = await this.checkGalleryPermissions();

    return gallery === true && camera === true;
  }

  /**
   * Launch Camera
   *
   * @param {string} type photo or video
   */
  async launchCamera(type = 'photo') {
    // check or ask for permissions
    const allowed = await this.checkPermissions();

    if (!allowed) return false;

    const opt = this.buildOptions('', type);

    return new Promise((resolve, reject) => {
      ImagePicker.launchCamera(opt, (response) => {
        if (response.didCancel) {
          resolve(null);
        } else if (response.error) {
          reject(response.error);
        } else if (response.customButton) {
          resolve(null);
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Launch image gallery
   *
   * @param {string} type photo or video
   */
  async launchImageLibrary(type = 'photo') {
    // check or ask for permissions
    const allowed = await this.checkPermissions();

    if (!allowed) return false;

    const opt = this.buildOptions('', type);

    return new Promise((resolve, reject) => {
      ImagePicker.launchImageLibrary(opt, (response) => {
        if (response.didCancel) {
          resolve(null);
        } else if (response.error) {
          reject(response.error);
        } else if (response.customButton) {
          resolve(null);
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Show image picker selector
   *
   * @param {string} title
   * @param {string} type   photo or video
   */
  async show(title, type = 'photo') {
    // check or ask for permissions
    const allowed = this.checkPermissions();

    if (!allowed) return false;

    const opt = this.buildOptions(title, type);

    return new Promise((resolve, reject) => {
      ImagePicker.showImagePicker(opt, (response) => {
        if (response.didCancel) {
          resolve(null);
        } else if (response.error) {
          reject(response.error);
        } else if (response.customButton) {
          resolve(null);
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Build the options with i18n translated texts
   * @param {string} title
   * @param {string} type
   */
  buildOptions(title, type) {
    return {
      title,
      mediaType: type,
      takePhotoButtonTitle: i18n.t('imagePicker.camera'),
      chooseFromLibraryButtonTitle: i18n.t('imagePicker.gallery'),
      cancelButtonTitle: i18n.t('imagePicker.cancel'),
      noData: true, // improve performance! (no base64 conversion field)
      storageOptions: {
        cameraRoll: true,
        waitUntilSaved: true,
      },
    };
  }
}

export default new ImagePickerService();
