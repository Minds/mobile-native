import { observable, action } from 'mobx'

import { getFeed } from './NewsfeedService';

import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';
/**
 * News feed store
 */
class NewsfeedStore {

  list = new OffsetFeedListStore();
  
  loadFeed() {

    if (this.list.cantLoadMore()) {
      return;
    }

    return getFeed(this.list.offset)
      .then(
        feed => {
          this.list.setList(feed);
          this.loaded   = true;
        }
      )
      .catch(err => {
        console.log('error', err);
      });
  }

  @action
  clearFeed() {
    this.list.clearList();
  }

  @action
  refresh() {
    this.list.clearList();
    this.loadFeed()
      .finally(action(() => {
        this.list.refreshDone();
      }));
  }

}

export default new NewsfeedStore();