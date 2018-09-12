import {
  CameraRoll,
  Platform,
} from 'react-native';
import session from './session.service';
import RNFetchBlob from 'rn-fetch-blob';
import permissions from './android-permissions.service';

/**
 * Download Service
 */
class DownloadService {
  /**
   * Download media to the gallery
   * @param {url} string
   */
  async downloadToGallery(url) {

    if (Platform.OS === 'ios') {
      return CameraRoll.saveToCameraRoll(url);
    } else {

      let hasPermission = await permissions.checkWriteExternalStorage();
      if (!hasPermission) hasPermission = await permissions.writeExternalStorage();

      if (hasPermission) {
        return RNFetchBlob
          .config({
            fileCache : true,
            appendExt : 'jpg'
          })
          .fetch('GET', url+'?acces_token='+session.token.toString())
          .then((res) => {
            return CameraRoll.saveToCameraRoll(res.path());
          });
      }
    }
  }

}

export default new DownloadService();
