import { Platform } from 'react-native';

import { CameraRoll } from '@react-native-camera-roll/camera-roll';

import RNFS from 'react-native-fs';
import i18nService from './i18n.service';
import { showNotification } from '../../../AppMessages';
import type ActivityModel from '../../newsfeed/ActivityModel';
import permissionsService from './permissions.service';

/**
 * Download Service
 */
class DownloadService {
  /**
   * Download media to the gallery
   * @param {url} string
   * @param {object} entity
   */
  async downloadToGallery(url: string, entity?: ActivityModel, name?: string) {
    try {
      // if it was iOS or the url wasn't a remote resource, use cameraroll
      if (Platform.OS === 'ios' || url.indexOf('http') < 0) {
        return CameraRoll.save(url, { type: 'photo' });
      } else {
        let allowed = await permissionsService.checkWriteExternalStorage(true);

        if (!allowed) {
          allowed = await permissionsService.writeExternalStorage();
        }

        if (!allowed) {
          return;
        }

        const type = entity && this.isGif(entity) ? 'gif' : 'jpg';
        const filePath = `${RNFS.CachesDirectoryPath}/${
          entity?.guid || name || 'untitled'
        }.${type}`;
        const download = RNFS.downloadFile({
          fromUrl: url,
          toFile: filePath,
          progressDivider: 1,
        });

        return download.promise.then(result => {
          if (result.statusCode === 200) {
            return CameraRoll.save(filePath, { type: 'photo' });
          } else {
            showNotification(i18nService.t('errorDownloading'), 'danger');
          }
        });
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
