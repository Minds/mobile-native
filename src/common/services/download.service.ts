//@ts-nocheck
import {
  Platform,
} from 'react-native';

import CameraRoll from "@react-native-community/cameraroll";

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
        const type = this.isGif(entity) ? 'gif' : 'jpg';
        const filePath = `${RNFS.CachesDirectoryPath}/${entity.guid}.${type}`;
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

  /**
   * Check if entity has gif flag
   * @param {object} entity
   */
  isGif(entity){
    let isGif = false;
    if('custom_data' in entity){
      if(entity.custom_data.length > 0){
        const data = entity.custom_data[0];
        isGif = !!data.gif;
      }
    }
    return isGif;
  }

}

export default new DownloadService();
