import {
  observable,
  action
} from 'mobx'
import AttachmentStore from '../common/stores/AttachmentStore';
import apiService from '../common/services/api.service';

class CaptureStore {
  attachment = new AttachmentStore();

  @observable isPosting;

  @observable socialNetworksLoaded = false;
  @observable socialNetworks = {
    facebook: false,
    twitter: false,
  };

  @action
  setPosting(val) {
    this.isPosting = val;
  }

  reset() {
    this.isPosting = false;
    this.attachment.clear();
  }

  @action async loadThirdPartySocialNetworkStatus() {
    const response = await apiService.get(`api/v1/thirdpartynetworks/status`);
    
    if (response && response.thirdpartynetworks) {
      const networks = response.thirdpartynetworks;

      this.socialNetworks.twitter = networks.twitter && networks.twitter.connected;
      this.socialNetworks.facebook = networks.facebook && networks.facebook.connected;
    }
  }
}

export default new CaptureStore();
