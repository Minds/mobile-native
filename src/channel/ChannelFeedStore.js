import { observable, action } from 'mobx'

import { getFeedChannel } from '../newsfeed/NewsfeedService';

// TODO: refactor to use Newsfeed store logic (DRY)
class ChannelFeedStore {
  @observable entities   = [];
  @observable refreshing = false
  @observable filter     = 'feed';
  @observable loaded     = false;

  offset = '';

  loadFeed(guid) {
    return getFeedChannel(guid, this.offset)
    .then(feed => {
        this.setFeed(feed);
      })
      .catch(err => {
        console.error('error');
      });
  }

  @action
  setFeed(feed) {
    this.loaded = true;
    if (feed.entities) {
      this.entities = [... this.entities, ...feed.entities];
    }
    this.offset = feed.offset || '';
  }

  @action
  clearFeed() {
    this.entities = [];
    this.offset   = '';
    this.loaded   = false;
  }

  @action
  refresh(guid) {
    this.loaded   = false;
    this.refreshing = true;
    this.entities = [];
    this.offset = ''
    this.loadFeed(guid)
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