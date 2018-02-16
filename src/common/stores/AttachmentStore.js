import { observable, action, extendObservable } from 'mobx'

import attachmentService from '../services/attachment.service';

/**
 * Attachment Store
 */
export default class AttachmentStore {
  @observable hasAttachment = false;
  @observable uploading = false;
  @observable progress = 0;

  guid = '';
  uri  = '';
  type = '';

  /**
   * Attach media
   * @param {object} media
   */
  @action
  async attachMedia(media) {

    this.setHasAttachment(true);
    this.setUploading(true);
    this.type = media.type;
    this.uri  = media.uri;

    try {
      const result = await attachmentService.attachMedia(media, (pct) => {
        this.setProgress(pct);
      });

      this.setUploading(false);

      this.guid = result.guid;

      return this.guid;
    } catch(err) {
      return false;
    }
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
  clear() {
    this.guid = '';
    this.type = '';
    this.uri = '';
    this.hasAttachment = false;
    this.uploading = false;
    this.progress = 0;
  }

}