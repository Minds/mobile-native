import { observable, action } from 'mobx'

import { getFeed } from './NewsfeedService';

/**
 * News feed store
 */
class NewsfeedStore {
  @observable entities   = [];
  @observable offset     = '';
  @observable refreshing = false;

  /**
   * Load feed
   */
  loadFeed() {
    return getFeed(this.offset)
      .then(
        feed => {
          this.setFeed(feed);
        }
      )
      .catch(err => {
        console.log('error', err);
      });
  }

  @action
  setFeed(feed) {
    if (feed.entities) {
      this.entities = [... this.entities, ...feed.entities];
    }
    this.offset = feed.offset;
  }

  @action
  clearFeed() {
    this.entities = [];
    this.offset   = '';
  }

  @action
  refresh() {
    this.refreshing = true;
    this.entities   = [];
    this.offset     = ''
    this.loadFeed()
      .finally(action(() => {
        this.refreshing = false;
      }));
  }
}

export default new NewsfeedStore();