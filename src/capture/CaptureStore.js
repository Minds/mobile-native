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
}

export default new CaptureStore();