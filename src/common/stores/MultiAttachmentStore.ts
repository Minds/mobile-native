import { showNotification } from 'AppMessages';
import { action, computed, observable } from 'mobx';
import { IS_IOS } from '~/config/Config';
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
   * Returns an attachment store at index or null
   * @param index {number}
   */
  get(index: number): AttachmentStore | null {
    return this.attachments[index] || null;
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
      if (media.type.startsWith('image')) {
        showNotification(i18n.t('capture.max4Images'));
      }
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

    // check if already exist
    if (this.mediaExists(media)) {
      return false;
    }

    const store = this.addAttachment();
    store.attachMedia(media, extra);
    return store;
  }

  /**
   * Checks if a media is already attached
   * @param media {Media}
   */
  mediaExists(media: Media): boolean {
    if (IS_IOS) {
      return this.attachments.some(
        a => a.localIdentifier === media.localIdentifier,
      );
    } else {
      return this.attachments.some(a => a.path === media.path);
    }
  }

  /**
   * Removes the media (cancel or deleting from server)
   * and removes the store from the attachments array
   * @param store {AttachmentStore}
   */
  @action
  removeMedia = async (store: AttachmentStore) => {
    await store.cancelOrDelete();
    this.removeAttachment(store);
  };

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
  clear(deleteMedia: boolean = true) {
    if (deleteMedia) {
      this.attachments.forEach(attachment => {
        attachment.cancelOrDelete();
      });
    }
    this.attachments = [];
    this.license = DEFAULT_LICENSE;
  }
}
