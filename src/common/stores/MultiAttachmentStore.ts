import { showNotification } from 'AppMessages';
import { action, computed, observable } from 'mobx';
import AttachmentStore, { Media } from './AttachmentStore';
import sp from '~/services/serviceProvider';

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
   * @param ephemeral - whether this attachment is not yet posted
   * @returns store
   */
  addAttachment(ephemeral?: boolean) {
    const store = new AttachmentStore(undefined, ephemeral);
    this.attachments.push(store);
    return store;
  }

  /**
   * Attach an image/video
   * @param media {Media}
   * @param extra extra data for the request
   * @param ignoreRepeated {boolean} ignore repeated images
   */
  @action
  async attachMedia(
    media: Media,
    extra?: any,
    ignoreRepeated: boolean = false,
  ): Promise<AttachmentStore | false> {
    if (this.attachments.length === this.max) {
      if (media.type.startsWith('image')) {
        showNotification(sp.i18n.t('capture.max4Images'));
      }
      return false;
    }

    // only multi-image is allowed for now
    if (
      this.length > 0 &&
      (media.type.startsWith('video') ||
        this.attachments.some(attachment =>
          attachment.type.startsWith('video'),
        ))
    ) {
      showNotification(sp.i18n.t('capture.onlyMultiImage'));
      return false;
    }

    // check if already exist
    if (!ignoreRepeated && this.mediaExists(media)) {
      return false;
    }

    const store = this.addAttachment();
    try {
      await store.attachMedia(media, extra);
    } catch (error) {
      this.removeAttachment(store);
      throw error;
    }
    return store;
  }

  /**
   * Checks if a media is already attached
   * @param media {Media}
   */
  mediaExists(media: Media): boolean {
    if (media.assetId) {
      return this.attachments.some(
        attachment => attachment.assetId === media.assetId,
      );
    }
    if (media.path) {
      return this.attachments.some(
        attachment => attachment.path === media.path,
      );
    }

    return this.attachments.some(attachment => attachment.uri === media.uri);
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
