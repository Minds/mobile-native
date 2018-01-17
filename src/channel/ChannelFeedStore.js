import { observable, action } from 'mobx'

import { getFeedChannel, toggleComments , toggleExplicit } from '../newsfeed/NewsfeedService';

import channelService from './ChannelService';

import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';

/**
 * Channel Feed store
 */
class ChannelFeedStore {

  @observable filter      = 'feed';
  @observable showrewards = false;
  @observable list = new OffsetFeedListStore();
  @observable isTiled = false; 
  /**
   * List loading
   */
  loading = false;

  /**
   * Channel guid
   */
  guid    = null;

  /**
   * Set channel guid
   * @param {string} guid
   */
  setGuid(guid) {
    this.guid = guid;
  }

  /**
   * Load channel feed
   */
  loadFeed() {
    if (this.list.cantLoadMore() || this.loading) {
      return Promise.resolve();
    }

    return getFeedChannel(this.guid, this.list.offset)
    .then(feed => {
        if (this.filter != 'rewards') {
          this.list.setList(feed);
        }
      })
      .finally(() => {
        this.loading = false;
      })
      .catch(err => {
        console.error('error');
      });
  }

  /**
   * Load channel images feed
   */
  loadImagesFeed() {
    if (this.list.cantLoadMore() || this.loading) {
      return Promise.resolve();
    }
    return channelService.getImageFeed(this.guid, this.list.offset)
      .then(feed => {
          if (this.filter != 'rewards') {
            this.isTiled = true;
            this.list.setList(feed);
          }
        })
        .finally(() => {
          this.loading = false;
        })
        .catch(err => {
          console.error('error');
        });
  }

  /**
   * Load channel videos feed
   */
  loadVideosFeed() {
    if (this.list.cantLoadMore() || this.loading) {
      return Promise.resolve();
    }
    return channelService.getVideoFeed(this.guid, this.list.offset)
      .then(feed => {
          if (this.filter != 'rewards') {
            this.isTiled = true;
            this.list.setList(feed);
          }
        })
        .finally(() => {
          this.loading = false;
        })
        .catch(err => {
          console.error('error');
        });
  }

  @action
  clearFeed() {
    this.list.clearList();
    this.isTiled = false;
    this.filter      = 'feed';
    this.showrewards = false;
  }

  @action
  refresh() {
    //ignore refresh on rewards view
    if (this.filter == 'rewards') {
      return;
    }
    this.list.refresh();
    this.loadFeed()
      .finally(action(() => {
        this.list.refreshDone();
      }));
  }

  @action
  setFilter(filter) {
    if (filter == this.filter) return;
    this.isTiled = false;
    this.filter = filter;

    switch (filter) {
      case 'rewards':
      
        this.showrewards = true;
        this.list.clearList(false);
        break;
      case 'images':
        this.list.clearList(true);
        this.loadImagesFeed(true);
        break;
      case 'videos':
        this.list.clearList(true);
        this.loadVideosFeed(true);
        break;
      default:
        this.showrewards = false;
        this.refresh();
        break;
    }
  }
}

export default new ChannelFeedStore();