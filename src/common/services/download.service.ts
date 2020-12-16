import { Platform } from 'react-native';

import CameraRoll from '@react-native-community/cameraroll';

import RNFS from 'react-native-fs';
import i18nService from './i18n.service';
import { showNotification } from '../../../AppMessages';
import type ActivityModel from '../../newsfeed/ActivityModel';
import imagePickerService from './image-picker.service';

/**
 * Download Service
 */
class DownloadService {
  /**
   * Download media to the gallery
   * @param {url} string
   * @param {object} entity
   */
  async downloadToGallery(url: string, entity: ActivityModel) {
    try {
      const hasPermission = await imagePickerService.checkGalleryPermissions();
      if (hasPermission) {
        if (Platform.OS === 'ios') {
          return CameraRoll.saveToCameraRoll(url);
        } else {
          const type = this.isGif(entity) ? 'gif' : 'jpg';
          const filePath = `${RNFS.CachesDirectoryPath}/${entity.guid}.${type}`;
          const download = RNFS.downloadFile({
            fromUrl: url,
            toFile: filePath,
            progressDivider: 1,
          });

          return download.promise.then((result) => {
            if (result.statusCode === 200) {
              return CameraRoll.saveToCameraRoll(filePath);
            } else {
              showNotification(i18nService.t('errorDownloading'), 'danger');
            }
          });
        }
      }
    } catch (e) {
      showNotification(i18nService.t('errorDownloading'), 'danger');
    }
  }

  /**
   * Check if entity has gif flag
   * @param {object} entity
   */
  isGif(entity: ActivityModel): boolean {
    let isGif = false;
    if (entity && entity.custom_data && Array.isArray(entity.custom_data)) {
      if (entity.custom_data.length > 0) {
        const data = entity.custom_data[0];
        isGif = !!data.gif;
      }
    }
    return isGif;
  }
}

export default new DownloadService();
