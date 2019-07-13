import { observable, action, extendObservable } from 'mobx'
import { Platform, Alert } from 'react-native';
import rnFS from 'react-native-fs';
import MediaMeta from 'react-native-media-meta';
import fileType from 'react-native-file-type';

import attachmentService from '../services/attachment.service';
import {MINDS_MAX_VIDEO_LENGTH} from '../../config/Config';
import mindsService from '../services/minds.service';
import logService from '../services/log.service';
import i18n from '../services/i18n.service';

/**
 * Attachment Store
 */
export default class AttachmentStore {
  @observable hasAttachment = false;
  @observable uploading = false;
  @observable checkingVideoLength = false;
  @observable progress = 0;

  guid = '';

  @observable uri  = '';
  @observable type = '';
  @observable license = '';
  tempIosVideo = '';

  /**
   * Attach media
   * @param {object} media
   * @param {object} extra
   */
  @action
  async attachMedia(media, extra = null) {

    // no new media acepted if we are checking for video length
    if (this.checkingVideoLength) return;

    // validate media
    const valid = await this.validate(media);
    if (!valid) return;

    if (this.uploading) {
      // abort current upload
      this.cancelCurrentUpload();
    } else if (this.hasAttachment) {
      // delete uploaded media
      try {
        await attachmentService.deleteMedia(this.guid);
      } catch (error) {
        // we ignore delete error for now
        logService.info('Error deleting the uploaded media '+this.guid);
      }
    }

    this.uri  = media.uri;
    this.type = media.type;
    this.setHasAttachment(true);

    try {
      const uploadPromise = attachmentService.attachMedia(media, extra, (pct) => {
        this.setProgress(pct);
      });

      // we need to defer the set because a cenceled promise could set it to false
      setTimeout(() => this.setUploading(true), 0);

      this.uploadPromise = uploadPromise;

      const result = await uploadPromise;
      // ignore canceled
      if ((uploadPromise.isCanceled && uploadPromise.isCanceled()) || !result) return;
      this.guid = result.guid;
    } catch (err) {
      this.clear();
      Alert.alert('Upload failed', 'Please try again');
    } finally {
      this.setUploading(false);
    }

    // delete temp ios video if necessary
    if (this.tempIosVideo) {
      rnFS.unlink(this.tempIosVideo);
      this.tempIosVideo = '';
    }

    return this.guid;
  }

  /**
   * Cancel current upload promise and request
   */
  cancelCurrentUpload(clear=true)
  {
    this.uploadPromise && this.uploadPromise.cancel(() => {
      if (clear) this.clear();
    });
  }

  /**
   * Validate media
   * @param {object} media
   */
  @action
  async validate(media) {

    if(!media.type){
      const type = await fileType(media.path);
      media.type = type.mime;
    }

    if(media.fileName && media.fileName.includes(' ')) media.fileName = media.fileName.replace(/\s/g, "_");

    const settings = await mindsService.getSettings();

    let videoPath = null;
    switch (media.type) {
      case 'video/mp4':
        videoPath = media.path || media.uri.replace(/^.*:\/\//, '');
        break;
      case 'ALAssetTypeVideo':
        // if video is selected from cameraroll we need to copy
        await this.copyVideoIos(media);
        videoPath = this.tempIosVideo;
        media.type = 'video/mp4';
        media.path = videoPath;
        media.uri  = 'file:\/\/'+videoPath;
        break;
    }

    if (videoPath) {
      this.checkingVideoLength = true;
      const meta = await MediaMeta.get(videoPath);

      this.checkingVideoLength = false;

      // check video length
      if (meta.duration && meta.duration > (settings.max_video_length * 1000) ) {
        Alert.alert(
          i18n.t('sorry'),
          i18n.t('attachment.tooLong', {minutes: (settings.max_video_length / 60)})
        );
        return false;
      }
    }

    return true;
  }

  /**
   * copy a video from ios library assets to temporal app folder
   * @param {object} media
   */
  copyVideoIos(media) {
    this.tempIosVideo = rnFS.TemporaryDirectoryPath+'MINDS-'+Date.now()+'.MP4'
    return rnFS.copyAssetsVideoIOS(media.uri, this.tempIosVideo);
  }

  /**
   * Delete the uploaded attachment
   */
  async delete() {
    if (!this.uploading && this.hasAttachment && this.guid) {
      try {
        attachmentService.deleteMedia(this.guid);
        this.clear();
        return true
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
    this.progress = value
  }

  @action
  setUploading(value) {
    this.uploading = value
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
  clear() {
    this.license = '';
    this.guid = '';
    this.type = '';
    this.uri = '';
    this.hasAttachment = false;
    this.checkingVideoLength = false;
    this.uploading = false;
    this.progress = 0;

    if (this.tempIosVideo) {
      rnFS.unlink(this.tempIosVideo);
      this.tempIosVideo = '';
    }
  }

}