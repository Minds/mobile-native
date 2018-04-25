import { observable, action, extendObservable } from 'mobx'
import { Platform, Alert } from 'react-native';
import rnFS from 'react-native-fs';
import MediaMeta from 'react-native-media-meta';

import attachmentService from '../services/attachment.service';
import {MINDS_MAX_VIDEO_LENGTH} from '../../config/Config';

/**
 * Attachment Store
 */
export default class AttachmentStore {
  @observable hasAttachment = false;
  @observable uploading = false;
  @observable checkingVideoLength = false;
  @observable progress = 0;
  deleteUploading = false;

  queue = {};

  guid = '';
  hasQueue = false;
  @observable uri  = '';
  @observable type = '';
  @observable license = '';
  tempIosVideo = '';

  /**
   * Attach media
   * @param {object} media
   */
  @action
  async attachMedia(media) {

    // no new media acepted if we are checking for video length
    if (this.checkingVideoLength) return;

    // validate media
    const valid = await this.validate(media);
    if (!valid) return;

    if (this.uploading) {
      this.setQueue(media);
      return;
    }

    if (this.hasAttachment) {
      attachmentService.deleteMedia(this.guid);
    }

    this.uri  = media.uri;
    this.type = media.type;
    this.setHasAttachment(true);
    this.setUploading(true);

    try {
      const result = await attachmentService.attachMedia(media, (pct) => {
        this.setProgress(pct);
      });
      this.setUploading(false);
      this.guid = result.guid;

      if (this.hasQueue) {
        attachmentService.deleteMedia(this.guid);
        this.setHasAttachment(true);
        this.setUploading(true);
        const result = await attachmentService.attachMedia(this.queue, (pct) => {
          this.setProgress(pct);
        });
        this.guid = result.guid;
        this.queue = {};
        this.hasQueue = false;
      }

    } catch (err) {
      this.clear();
      throw err;
    } finally {
      this.setUploading(false);
    }

    // delete temp ios video if necessary
    if (this.tempIosVideo) {
      rnFS.unlink(this.tempIosVideo);
      this.tempIosVideo = '';
    }

    if (this.deleteUploading) {
      attachmentService.deleteMedia(this.guid);
      this.deleteUploading = false;
      this.clear();
      return false;
    }

    return this.guid;
  }

  /**
   * Validate media
   * @param {object} media
   */
  @action
  async validate(media) {
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
      if (meta.duration && meta.duration > (MINDS_MAX_VIDEO_LENGTH * 60000) ) {
        Alert.alert(
          'Sorry',
          'Video duration must be less than '+MINDS_MAX_VIDEO_LENGTH+' minutes');
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

  @action
  setQueue(media) {
    this.hasQueue = true;
    this.queue = media;
    this.uri = media.uri ? media.uri: this.uri;
    this.type = media.type ? media.type: this.type;
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
      this.deleteUploading = true;
      this.clear();
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