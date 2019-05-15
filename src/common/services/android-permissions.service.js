import { PermissionsAndroid } from 'react-native';
import i18nService from './i18n.service';

/**
 * Android permissions service
 */
class AndroidPermissionsService {

  /**
   * Request external storage read permission
   */
  readExternalStorage() {
    return this._request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        'title': 'Minds',
        'message': i18nService.t('permissions.externalStorage')
      }
    );
  }

  /**
   * Check external storage read permission
   */
  async checkReadExternalStorage() {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      return granted;
    } catch (err) {
      console.warn(err)
      return err;
    }
  }

  /**
   * Request read sms permission
   */
  readSms() {
    return this._request(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      {
        'title': 'Minds',
        'message': i18nService.t('permissions.sms')
      }
    );
  }

  /**
   * Check read sms permission
   */
  async checkReadSms() {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_SMS
      );
      return granted;
    } catch (err) {
      console.warn(err)
      return err;
    }
  }

  /**
   * Request external storage write permission
   */
  writeExternalStorage() {
    return this._request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        'title': 'Minds',
        'message': i18nService.t('permissions.writeExternalStorage')
      }
    );
  }

  /**
   * Check external storage write permission
   */
  async checkWriteExternalStorage() {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      return granted;
    } catch (err) {
      console.warn(err)
      return err;
    }
  }

  /**
   * Request camera permission
   */
  camera() {
    return this._request(PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        'title': 'Minds',
        'message': i18nService.t('permissions.camera')
      }
    );
  }

  /**
   * Check camera
   */
  async checkCamera() {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      return granted;
    } catch (err) {
      console.warn(err)
      return err;
    }
  }

  /**
   * Request permissions
   * @param {string} permission
   * @param {object} opt
   */
  async _request(permission, opt={}) {
    try {
      const granted = await PermissionsAndroid.request(permission, opt);

      if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) return -1;

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return err;
    }
  }

}

export default new AndroidPermissionsService();