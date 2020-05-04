//@ts-nocheck
import { observable, action, computed } from 'mobx';
import AttachmentStore from '../common/stores/AttachmentStore';
import RichEmbedStore from '../common/stores/RichEmbedStore';
import apiService from '../common/services/api.service';
import { post, remind } from './CaptureService';
import hashtagService from '../common/services/hashtag.service';
import { Alert } from 'react-native';

/**
 * Capture store
 */
class CaptureStore {
  attachment = new AttachmentStore();
  embed = new RichEmbedStore();

  @observable isPosting = false;
  @observable text = '';
  // tags not inline
  @observable.ref suggestedTags = [];

  @observable socialNetworks = {
    facebook: false,
    twitter: false,
  };

  @action
  async loadSuggestedTags() {
    const suggested = await hashtagService.getSuggested();
    this.suggestedTags = suggested;
    this.suggestedTags.forEach((t) => (t.selected = false));
  }

  @computed
  get selectedSuggested() {
    const selectedSuggested = [...this.suggestedTags];
    // deselect all
    selectedSuggested.forEach((t) => (t.selected = false));
    // select
    this.allTags.forEach((tag) => {
      const suggested = selectedSuggested.find((s) => s.value == tag);
      if (suggested) this.setSelected(suggested, true);
    });
    return selectedSuggested;
  }

  @action
  setSelected(tag, value) {
    tag.selected = value;
  }

  @computed
  get allTags() {
    const hash = /(^|\s)\#(\w*[a-zA-Z_]+\w*)/gim;
    const result = this.text.split(hash);
    const hashtags = [];

    for (let i = 2; i < result.length; i = i + 3) {
      hashtags.push(result[i].trim());
    }

    // remove repeated and return
    return [...new Set(hashtags)];
  }

  /**
   * Delete tag
   * @param {string} tag
   */
  @action
  deleteTag = (tag) => {
    this.text = this.text.replace(
      new RegExp('(^|\\s)#' + tag.value + '(?!\\w)', 'gim'),
      ` ${tag.value}`,
    );
  };

  /**
   * Add tag
   * @param {string} tag
   */
  @action
  addTag = (tag) => {
    this.text += ` #${tag.value}`;
  };

  /**
   * Set posting
   * @param {boolean} value
   */
  @action
  setPosting(value) {
    this.isPosting = value;
  }

  /**
   * Set text
   * @param {string} text
   */
  @action
  setText(text) {
    this.text = text;
  }

  /**
   * Reset store's status
   */
  reset() {
    this.isPosting = false;
    this.attachment.clear();
    this.text = '';
    this.hash = [];
    this.socialNetworks = {
      facebook: false,
      twitter: false,
    };
  }

  /**
   * Post
   * @param {object} newPost
   */
  @action async post(newPost) {
    try {
      this.setPosting(true);
      const result = await post(newPost);
      return result;
    } catch (err) {
      throw err;
    } finally {
      this.setPosting(false);
    }
  }

  /**
   * Remind
   */
  async remind(guid, newPost) {
    try {
      this.setPosting(true);
      const result = await remind(guid, newPost);
      return result;
    } catch (err) {
      throw err;
    } finally {
      this.setPosting(false);
    }
  }

  /**
   * Load third party social network status
   */
  @action async loadThirdPartySocialNetworkStatus() {
    const response = await apiService.get(`api/v1/thirdpartynetworks/status`);

    if (response && response.thirdpartynetworks) {
      const networks = response.thirdpartynetworks;

      this.socialNetworks.twitter =
        networks.twitter && networks.twitter.connected;
      this.socialNetworks.facebook =
        networks.facebook && networks.facebook.connected;
    }
    return response;
  }
}

export default CaptureStore;
