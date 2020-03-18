import { useLocalStore } from 'mobx-react';
import { Platform, Alert } from 'react-native';
import RNConvertPhAsset from 'react-native-convert-ph-asset';

import attachmentService from '../services/attachment.service';
import mindsService from '../services/minds.service';
import logService from '../services/log.service';
import i18n from '../services/i18n.service';

/**
 * Local attachment store hook
 */
export default function() {
  const store = useLocalStore(() => ({
    hasAttachment: false,
    uploading: false,
    progress: 0,
    uri: '',
    type: '',
    license: '',
    guid: '',
    fileName: null,
    transcoding: false,

    /**
     * Attach media
     * @param {Object} media
     * @param {Object} extra
     */
    async attachMedia(media, extra = null) {
      if (store.transcoding) {
        return;
      }

      if (store.uploading) {
        // abort current upload
        store.cancelCurrentUpload();
      } else if (store.hasAttachment) {
        // delete uploaded media
        try {
          await attachmentService.deleteMedia(store.guid);
        } catch (error) {
          // we ignore delete error for now
          logService.info('Error deleting the uploaded media ' + store.guid);
        }
      }

      if (!(await store.validate(media))) {
        return;
      }

      store.setHasAttachment(true);

      if (Platform.OS === 'ios') {
        // correctly handle videos from ph:// paths on ios
        if (media.type === 'video' && media.uri.startsWith('ph://')) {
          try {
            store.transcoding = true;
            const converted = await RNConvertPhAsset.convertVideoFromUrl({
              url: media.uri,
              convertTo: 'm4v',
              quality: 'high',
            });
            media.type = converted.mimeType;
            media.uri = converted.path;
            media.filename = converted.filename;
          } catch (error) {
            Alert.alert('Error reading the video', 'Please try again');
          } finally {
            store.transcoding = false;
          }
        }

        // fix camera roll gif issue
        if (media.type === 'image' && media.fileName) {
          const extension = media.fileName.split('.').pop();
          if (extension && extension.toLowerCase() === 'gif') {
            media.type = 'image/gif';
            const appleId = media.uri.substring(5, 41);
            media.uri = `assets-library://asset/asset.GIF?id=${appleId}&ext=GIF`;
          }
        }
      }

      store.uri = media.uri;
      store.type = media.type;
      store.fileName = media.fileName;

      try {
        const uploadPromise = attachmentService.attachMedia(
          media,
          extra,
          pct => {
            store.setProgress(pct);
          },
        );

        // we need to defer the set because a cenceled promise could set it to false
        setTimeout(() => store.setUploading(true), 0);

        store.uploadPromise = uploadPromise;

        const result = await uploadPromise;
        // ignore canceled
        if (
          (uploadPromise.isCanceled && uploadPromise.isCanceled()) ||
          !result
        ) {
          return;
        }
        store.guid = result.guid;
      } catch (err) {
        store.clear();
        Alert.alert('Upload failed', 'Please try again');
      } finally {
        store.setUploading(false);
      }

      return store.guid;
    },

    /**
     * Validate media
     * @param {Object} media
     */
    async validate(media) {
      const settings = await mindsService.getSettings();
      if (media.duration && media.duration > settings.max_video_length * 1000) {
        Alert.alert(
          i18n.t('sorry'),
          i18n.t('attachment.tooLong', {
            minutes: settings.max_video_length / 60,
          }),
        );
        return false;
      }
      return true;
    },

    /**
     * Cancel current upload promise and request
     */
    cancelCurrentUpload(clear = true) {
      store.uploadPromise &&
        store.uploadPromise.cancel(() => {
          if (clear) {
            store.clear();
          }
        });
    },

    /**
     * Delete the uploaded attachment
     */
    async delete() {
      if (!store.uploading && store.hasAttachment && store.guid) {
        try {
          attachmentService.deleteMedia(store.guid);
          store.clear();
          return true;
        } catch (err) {
          return false;
        }
      } else {
        store.cancelCurrentUpload();
      }
      return true;
    },

    setProgress(value) {
      store.progress = value;
    },

    setUploading(value) {
      store.uploading = value;
    },

    setHasAttachment(value) {
      store.hasAttachment = value;
    },

    setLicense(value) {
      store.license = value;
    },

    clear() {
      store.license = '';
      store.guid = '';
      store.type = '';
      store.uri = '';
      store.hasAttachment = false;
      store.checkingVideoLength = false;
      store.uploading = false;
      store.progress = 0;
    },
  }));
  return store;
}
