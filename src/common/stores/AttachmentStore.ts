import { observable, action, runInAction } from 'mobx';
import Cancelable from 'promise-cancelable';
import { Alert, Platform } from 'react-native';
import RNConvertPhAsset from 'react-native-convert-ph-asset';
import { Orientation } from 'react-native-vision-camera';

import { showNotification } from '../../../AppMessages';
import { UserError } from '../UserError';
import { ApiResponse } from '../services/ApiResponse';
import sp from '~/services/serviceProvider';

export type Media = {
  key?: number;
  uri: string;
  type: string;
  path?: string;
  assetId?: string | null;
  filename?: string;
  width: number;
  height: number;
  orientation?: Orientation;
};

/**
 * Attachment Store
 */
export default class AttachmentStore {
  @observable hasAttachment = false;
  @observable uploading = false;
  @observable progress = 0;
  @observable uri = '';
  @observable type = '';
  @observable license = 'all-rights-reserved';

  assetId?: string | null = '';
  guid = '';
  filename? = '';
  path? = '';
  transcoding = false;
  @observable width: number = 1;
  @observable height: number = 1;

  onClear?: (s: AttachmentStore) => void;

  uploadPromise?: Promise<ApiResponse> | Cancelable;

  constructor(
    onClear?: (s: AttachmentStore) => void,
    /**
     * Whether this attachment is not yet posted
     */
    private ephemeral = true,
  ) {
    this.onClear = onClear;
  }

  /**
   * Attach media
   * @param {object} media
   * @param {object} extra
   */
  @action
  async attachMedia(media: Media, extra: any = null) {
    if (this.transcoding) {
      return;
    }

    const attachmentService = sp.resolve('attachment');

    if (this.uploading) {
      // abort current upload
      this.cancelCurrentUpload();
    } else if (this.hasAttachment) {
      // delete uploaded media
      try {
        await attachmentService.deleteMedia(this.guid);
      } catch (error) {
        // we ignore delete error for now
        sp.log.info('Error deleting the uploaded media ' + this.guid);
      }
    }

    if (!this.validate(media)) {
      return;
    }

    this.setHasAttachment(true);

    if (Platform.OS === 'ios') {
      // correctly handle videos from ph:// paths on ios
      if (media.type === 'video' && media.uri.startsWith('ph://')) {
        try {
          this.transcoding = true;
          const converted = await RNConvertPhAsset.convertVideoFromUrl({
            url: media.uri,
            convertTo: 'm4v',
            quality: 'original',
          });
          media.type = converted.mimeType;
          media.uri = converted.path;
          media.filename = converted.filename;
        } catch (error) {
          Alert.alert('Error reading the video', 'Please try again');
        } finally {
          this.transcoding = false;
        }
      }
    }

    runInAction(() => {
      this.uri = media.uri;
      this.type = media.type;
      this.filename = media.filename;
      this.width = media.width;
      this.height = media.height;
      this.assetId = media.assetId;
      this.path = media.path;
    });

    try {
      const resizedMedia = await attachmentService.processMedia(media);
      const uploadPromise = attachmentService.attachMedia(
        resizedMedia,
        extra,
        pct => {
          this.setProgress(pct);
        },
      );

      // we need to defer the set because a canceled promise could set it to false
      setTimeout(() => this.setUploading(true), 0);

      this.uploadPromise = uploadPromise;

      const result = await uploadPromise;
      // ignore canceled
      if (uploadPromise.isCanceled?.() || !result) {
        return;
      }
      this.guid = result.guid;
    } catch (err) {
      this.clear();
      if (!(err instanceof UserError)) {
        showNotification(
          err instanceof Error ? err.message : sp.i18n.t('uploadFailed'),
        );
      }
      throw err;
    } finally {
      this.setUploading(false);
    }

    return this.guid;
  }

  validate(media) {
    const settings = sp.config.getSettings();
    if (media.duration && media.duration > settings.max_video_length * 1000) {
      Alert.alert(
        sp.i18n.t('sorry'),
        sp.i18n.t('attachment.tooLong', {
          minutes: settings.max_video_length / 60,
        }),
      );
      return false;
    }
    return true;
  }

  /**
   * Cancel current upload promise and request
   */
  cancelCurrentUpload(clear = true) {
    this.uploadPromise &&
      this.uploadPromise.cancel(() => {
        if (clear) {
          this.clear();
        }
      });
  }

  /**
   * Cancel the upload or delete the attachment if it is finished
   */
  cancelOrDelete = (deleteRemote = true) => {
    if (this.uploading) {
      this.cancelCurrentUpload();
    } else if (this.ephemeral) {
      this.delete(deleteRemote);
    }
  };

  /**
   * Delete the uploaded attachment
   */
  async delete(deleteRemote) {
    if (!this.uploading && this.hasAttachment && this.guid) {
      try {
        if (deleteRemote) {
          const attachmentService = sp.resolve('attachment');
          attachmentService.deleteMedia(this.guid);
        }
        this.clear();
        return true;
      } catch (err) {
        return false;
      }
    } else {
      this.cancelCurrentUpload();
    }
    return true;
  }

  @action
  setProgress(value) {
    this.progress = value;
  }

  @action
  setUploading(value) {
    this.uploading = value;
  }

  @action
  setHasAttachment(value) {
    this.hasAttachment = value;
  }

  @action
  setLicense(value) {
    this.license = value;
  }

  @action
  setMedia(type, guid, uri = '', width = 0, height = 0) {
    this.type = type;
    this.guid = guid;
    this.uri = uri;
    this.hasAttachment = Boolean(guid);
    this.width = width;
    this.height = height;
  }

  @action
  clear() {
    this.license = '';
    this.guid = '';
    this.type = '';
    this.uri = '';
    this.hasAttachment = false;
    this.uploading = false;
    this.progress = 0;
    this.onClear?.(this);
  }
}
