import { observable, action } from 'mobx'

import { getFeedChannel, toggleComments } from '../newsfeed/NewsfeedService';

// TODO: refactor to use Newsfeed store logic (DRY)
class ChannelFeedStore {
  @observable entities    = [];
  @observable refreshing  = false
  @observable filter      = 'feed';
  @observable loaded      = false;
  @observable showrewards = false;

  offset = '';
  guid   = null;

  setGuid(guid) {
    this.guid = guid;
  }

  loadFeed() {
    return getFeedChannel(this.guid, this.offset)
    .then(feed => {
        this.setFeed(feed);
      })
      .catch(err => {
        console.error('error');
      });
  }

  @action
  setFeed(feed) {
    //ignore on rewards view
    if (this.filter == 'rewards') {
      return;
    }
    this.loaded = true;
    if (feed.entities) {
      this.entities = [... this.entities, ...feed.entities];
    }
    this.offset = feed.offset || '';
  }

  @action
  clearFeed() {
    this.entities    = [];
    this.offset      = '';
    this.filter      = 'feed';
    this.loaded      = false;
    this.showrewards = false;
  }

  @action
  refresh() {
    //ignore refresh on rewards view
    if (this.filter == 'rewards') {
      return;
    }
    this.refreshing = true;
    this.entities   = [];
    this.offset     = ''
    this.loadFeed()
      .finally(action(() => {
        this.refreshing = false;
      }));
  }

  @action
  setFilter(filter) {
    if (filter == this.filter) return;

    this.filter = filter;

    switch (filter) {
      case 'rewards':
        this.showrewards = true;
        this.entities    = [];
        this.offset      = '';
        break;
      default:
        this.showrewards = false;
        this.entities    = [];
        this.offset      = '';
        this.loadFeed();
        break;
    }
  }

  /*Activity Methods */
  @action
  toggleCommentsAction(guid) {
    let index = this.entities.findIndex(x => x.guid == guid);
    if(index >= 0) {
      let entity =  this.entities[index];
      let value = !entity.comments_disabled;
      return toggleComments(guid, value)
        .then(action(response => {
          this.entities[index] = response.entity;
        }))
        .catch(action(err => {
          entity.comments_disabled = !value;
          this.entities[index] = entity;
          console.log('error');
        }));
    }
  }
}

export default new ChannelFeedStore();