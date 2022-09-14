import { showNotification } from 'AppMessages';
import { action, computed, observable } from 'mobx';
import i18n from '../services/i18n.service';
import AttachmentStore, { Media } from './AttachmentStore';

const DEFAULT_LICENSE = 'all-rights-reserved';

/**
 * Multi-attachment Store
 */
export default class MultiAttachmentStore {
  @observable attachments: Array<AttachmentStore> = [];
  @observable license = DEFAULT_LICENSE;

  /**
   * @var number maximum number of attachments allowed
   */
  max: number;

  @computed
  get hasAttachment() {
    return this.attachments.length > 0;
  }

  get uploading() {
    return this.attachments.some(a => a.uploading);
  }

  get length() {
    return this.attachments.length;
  }

  /**
   * Constructor
   * @param max {number} max number of attachments
   */
  constructor(max: number = 4) {
    this.max = max;
  }

  /**
   * Get the array of guids
   */
  getAttachmentGuids() {
    return this.attachments.map(a => a.guid);
  }

  /**
   * Adds a new attachment store to the array
   */
  addAttachment() {
    const store = new AttachmentStore();
    this.attachments.push(store);
    return store;
  }

  /**
   * Attach an image/video
   * @param media {Media}
   * @param extra extra data for the request
   */
  @action
  attachMedia(media: Media, extra: any) {
    if (this.attachments.length === this.max) {
      return false;
    }

    // only multi-image is allowed for now
    if (
      this.length > 0 &&
      (media.type.startsWith('video') ||
        this.attachments.some(m => m.type.startsWith('video')))
    ) {
      showNotification(i18n.t('capture.onlyMultiImage'));
      return false;
    }

    const store = this.addAttachment();
    store.attachMedia(media, extra);
    return store;
  }

  /**
   * Removes the media (cancel or deleting from server)
   * and removes the store from the attachments array
   * @param store {AttachmentStore}
   */
  @action
  async removeMedia(store: AttachmentStore) {
    await store.cancelOrDelete();
    this.removeAttachment(store);
  }

  /**
   * Removes the store from the attachments arrays
   * @param store {AttachmentStore}
   */
  @action removeAttachment(store: AttachmentStore) {
    const index = this.attachments.indexOf(store);
    if (index >= 0) {
      this.attachments.splice(index, 1);
    }
  }

  /**
   * Set the license
   * @param value {string}
   */
  @action
  setLicense(value: string) {
    this.license = value;
  }

  /**
   * Clears all the attachments (deleting from server or canceling the requests)
   */
  @action
  clear() {
    this.attachments.forEach(attachment => {
      attachment.cancelOrDelete();
    });
    this.attachments = [];
    this.license = DEFAULT_LICENSE;
  }
}
