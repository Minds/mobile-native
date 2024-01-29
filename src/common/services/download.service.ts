import { Platform } from 'react-native';

import * as MediaLibrary from 'expo-media-library';

import RNFS from 'react-native-fs';
import i18nService from './i18n.service';
import { showNotification } from '../../../AppMessages';
import type ActivityModel from '../../newsfeed/ActivityModel';
import DeviceInfo from 'react-native-device-info';

const ANDROID_API_VERSION = parseInt(`${DeviceInfo.getBuildNumber()}`, 10);
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
        return MediaLibrary.saveToLibraryAsync(this.checkAndFixImageURI(url));
      } else if (ANDROID_API_VERSION < 11) {
        let permission = await MediaLibrary.getPermissionsAsync(true);

        if (permission.status !== 'granted') {
          permission = await MediaLibrary.requestPermissionsAsync();
        }

        if (!permission) {
          return;
        }
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
          return MediaLibrary.saveToLibraryAsync(filePath);
        } else {
          showNotification(i18nService.t('errorDownloading'), 'danger');
        }
      });
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

  checkAndFixImageURI(uri) {
    // Regular expression to match common image file extensions
    const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|svg)$/i;

    // Check if the URI ends with a '/'
    if (uri.endsWith('/')) {
      uri = uri.slice(0, -1); // Remove the trailing '/'
    }

    // Check if the URI doesn't have an extension
    if (!uri.match(imageExtensions)) {
      uri += '.jpg'; // Add the '.jpg' extension
    }

    return uri;
  }
}

export default new DownloadService();
