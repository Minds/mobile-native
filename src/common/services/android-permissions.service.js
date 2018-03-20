import { PermissionsAndroid } from 'react-native';

/**
 * Android permissions service
 */
class AndroidPermissionsService {

  /**
   * Request external storage read permission
   */
  async readExternalStorage() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          'title': 'Minds',
          'message': 'Minds needs access to your external storage ' +
            'so you can upload awesome pictures.'
        }
      )
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err)
    }
  }

  /**
   * Check external storage read permission
   */
  async checkReadExternalStorage() {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err)
    }
  }

  /**
   * Request camera permission
   */
  async camera() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          'title': 'Minds',
          'message': 'Minds needs access to your external camera ' +
            'so you can upload awesome pictures.'
        }
      )
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err)
    }
  }

  /**
   * Check camera
   */
  async checkCamera() {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err)
    }
  }

}

export default new AndroidPermissionsService();