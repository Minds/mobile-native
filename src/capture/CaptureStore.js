import {
  observable,
  action
} from 'mobx'
import AttachmentStore from '../common/stores/AttachmentStore';
import apiService from '../common/services/api.service';
import { post } from './CaptureService';

/**
 * Capture store
 */
class CaptureStore {
  attachment = new AttachmentStore();

  @observable isPosting = false;

  @observable socialNetworks = {
    facebook: false,
    twitter: false,
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
   * Reset store's status
   */
  reset() {
    this.isPosting = false;
    this.attachment.clear();
    this.socialNetworks = {
      facebook: false,
      twitter: false,
    };
  }

  /**
   * Post
   * @param {object} newPost
   */
  async post(newPost) {
    this.setPosting(true);
    const result = await post(newPost);
    this.setPosting(false);
    return result;
  }

  /**
   * Load third party social network status
   */
  @action async loadThirdPartySocialNetworkStatus() {
    const response = await apiService.get(`api/v1/thirdpartynetworks/status`);

    if (response && response.thirdpartynetworks) {
      const networks = response.thirdpartynetworks;

      this.socialNetworks.twitter = networks.twitter && networks.twitter.connected;
      this.socialNetworks.facebook = networks.facebook && networks.facebook.connected;
    }
    return response;
  }
}

export default CaptureStore;
