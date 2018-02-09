import { PermissionsAndroid } from 'react-native';

class AndroidPermissionsService {

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
}

export default new AndroidPermissionsService();