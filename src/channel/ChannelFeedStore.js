import { observable, action } from 'mobx'

import { getFeedChannel } from '../newsfeed/NewsfeedService';

// TODO: refactor to use Newsfeed store logic (DRY)
class ChannelFeedStore {
  @observable entities   = []
  @observable offset     = ''
  @observable refreshing = false
  @observable filter     = 'feed';

  loadFeed(guid) {
    getFeedChannel(guid, this.offset)
      .then(feed => {
        this.setFeed(feed);
      })
      .catch(err => {
        console.error('error');
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
    this.entities = [];
    this.offset = ''
    this.loadFeed()
      .finally(action(() => {
        this.refreshing = false;
      }));
  }

  @action
  setFilter(filter) {
    this.filter = filter;
  }

}

export default new ChannelFeedStore();