import { PermissionsAndroid, Rationale, Permission } from 'react-native';
import i18nService from './i18n.service';

/**
 * Android permissions service
 */
class AndroidPermissionsService {
  /**
   * Request external storage read permission
   */
  readExternalStorage() {
    return this._request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
      title: 'Minds',
      message: i18nService.t('permissions.externalStorage'),
      buttonPositive: i18nService.t('permissions.grant'),
    });
  }

  /**
   * Check external storage read permission
   */
  async checkReadExternalStorage() {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      console.log('granted', granted);
      return granted;
    } catch (err) {
      console.warn(err);
      return err;
    }
  }

  /**
   * Request read sms permission
   */
  readSms() {
    return this._request(PermissionsAndroid.PERMISSIONS.READ_SMS, {
      title: 'Minds',
      message: i18nService.t('permissions.sms'),
      buttonPositive: i18nService.t('permissions.grant'),
    });
  }

  /**
   * Check read sms permission
   */
  async checkReadSms() {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
      );
      return granted;
    } catch (err) {
      console.warn(err);
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
        title: 'Minds',
        message: i18nService.t('permissions.writeExternalStorage'),
        buttonPositive: i18nService.t('permissions.grant'),
      },
    );
  }

  /**
   * Check external storage write permission
   */
  async checkWriteExternalStorage(): Promise<boolean> {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      return granted;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  /**
   * Request camera permission
   */
  camera() {
    return this._request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Minds',
      message: i18nService.t('permissions.camera'),
      buttonPositive: i18nService.t('permissions.grant'),
    });
  }

  /**
   * Check camera
   */
  async checkCamera(): Promise<boolean> {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      return granted;
    } catch (err) {
      console.warn(err);
      return err;
    }
  }

  /**
   * Request permissions
   * @param {string} permission
   * @param {object} opt
   */
  async _request(
    permission: Permission,
    opt: Rationale | undefined = undefined,
  ) {
    try {
      const granted = await PermissionsAndroid.request(permission, opt);

      if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        return -1;
      }

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      return err;
    }
  }
}

export default new AndroidPermissionsService();
