import {
  CameraRoll,
  Platform,
} from 'react-native';
import session from './session.service';
import RNFS from 'react-native-fs';
import permissions from './android-permissions.service';
import i18nService from './i18n.service';

/**
 * Download Service
 */
class DownloadService {

  /**
   * Download media to the gallery
   * @param {url} string
   * @param {object} entity
   */
  async downloadToGallery(url, entity) {

    if (Platform.OS === 'ios') {
      return CameraRoll.saveToCameraRoll(url);
    } else {

      let hasPermission = await permissions.checkWriteExternalStorage();
      if (!hasPermission) hasPermission = await permissions.writeExternalStorage();

      if (hasPermission) {
        const filePath = `${RNFS.CachesDirectoryPath}/${entity.guid}.jpg`;
        const download = RNFS.downloadFile({
          fromUrl: url+'?acces_token='+session.token.toString(),
          toFile: filePath,
          progressDivider: 1
        });

        return download.promise
          .then(result => {
            if (result.statusCode == 200) {
              return CameraRoll.saveToCameraRoll(filePath);
            } else {
              alert(i18nService.t('errorDownloading'));
            }
          });
      }
    }
  }

}

export default new DownloadService();
