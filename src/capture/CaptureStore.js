import {
  observable,
  action
} from 'mobx'
import AttachmentStore from '../common/stores/AttachmentStore';

class CaptureStore {
  attachment = new AttachmentStore();

  @observable isPosting;

  @action
  setPosting(val) {
    this.isPosting = val;
  }

  reset() {
    this.isPosting = false;
    this.attachment.clear();
  }
}

export default new CaptureStore();