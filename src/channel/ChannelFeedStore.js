import { observable, action } from 'mobx'

import { getFeedChannel } from '../newsfeed/NewsfeedService';

// TODO: refactor to use Newsfeed store logic (DRY)
class ChannelFeedStore {
  @observable entities = []
  @observable offset = ''
  @observable refreshing = false
  @observable filter = 'feed';

  loadFeed(guid) {
    getFeedChannel(guid, this.offset)
      .then(
      feed => {
        this.setFeed(feed);
      }
      )
      .catch(err => {
        console.log('error');
      });
  }

  @action
  setFeed(feed) {
    this.entities = [... this.entities, ...feed.entities];
    this.offset = feed.offset,
      this.loaded = true,
      this.refreshing = false
  }

  @action
  clearFeed() {
    this.entities = [];
  }

  @action
  refresh(guid) {
    console.log('refreshing newsfeed');
    this.refreshing = true;
    this.entities = [];
    this.offset = ''
    this.loadFeed(guid)

    setTimeout(() => {
      console.log('refreshing newsfeed false');
      this.refreshing = false;
    }, 1000);
  }

  @action
  setFilter(filter) {
    this.filter = filter;
  }

}

export default new ChannelFeedStore();