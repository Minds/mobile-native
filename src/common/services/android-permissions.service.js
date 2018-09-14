import { PermissionsAndroid } from 'react-native';

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
        'message': 'Minds needs access to your external storage ' +
        'so you can upload awesome pictures.'
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
        'message': 'Minds needs access to read sms ' +
        'to auto-detect the validation code.'
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
        'message': 'Minds needs access to your external storage ' +
        'so you can download awesome pictures.'
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
        'message': 'Minds needs access to your external camera ' +
          'so you can upload awesome pictures.'
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