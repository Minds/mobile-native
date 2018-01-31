import { observable, action, computed } from 'mobx'

import { getFeedChannel, toggleComments , toggleExplicit } from '../newsfeed/NewsfeedService';

import channelService from './ChannelService';

import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';

/**
 * Channel Feed store
 */
export default class ChannelFeedStore {

  @observable filter = 'feed';
  @observable showrewards = false;

  stores = {
    feed: {
      list: new OffsetFeedListStore(),
      loading: false,
    },
    images: {
      list: new OffsetFeedListStore(),
      loading: false,
      isTiled: true,
    },
    videos: {
      list: new OffsetFeedListStore(),
      loading: false,
      isTiled: true,
    },
    blogs: {
      list: new OffsetFeedListStore(),
      loading: false,
      isTiled: false,
    },
  };

  /**
   * Channel guid
   */
  guid = null;

  constructor(guid) {
    this.guid = guid;
  }

  get list() {
    return this.stores[this.filter].list;
  }

  set list(value) { 
    this.stores[this.filter] = value;
  }

  get loading() {
    return this.stores[this.filter].loading;
  }

  set loading(value) {
    this.stores[this.filter].loading = value;
  }

  @computed
  get isTiled() {
    return this.stores[this.filter].isTiled;
  }

  /**
   * Set channel guid
   * @param {string} guid
   */
  setGuid(guid) {
    this.guid = guid;
  }

  async load() {
    switch (this.filter) {
      case 'feed':
        await this.loadFeed();
        break;
      case 'images':
        await this.loadImagesFeed();
        break;
      case 'images':
        await this.loadBlogsFeed();
        break;
      case 'videos':
        await this.loadVideosFeed();
        break;
      case 'blogs':
        await this.loadBlogsFeed();
        break;
    }
  }

  /**
   * Load channel feed
   */
  async loadFeed() {
    if (this.list.cantLoadMore() || this.loading) {
      return Promise.resolve();
    }
    this.loading = true;

    const feed = await getFeedChannel(this.guid, this.list.offset)
    
    if (this.filter != 'rewards') {
      this.assignRowKeys(feed);
      this.list.setList(feed);
    }
    
    this.loading = false;
  }

  /**
   * Generate a unique Id for use with list views
   * @param {object} feed
   */
  assignRowKeys(feed) {
    feed.entities.forEach((entity, index) => {
      entity.rowKey = `${entity.guid}:${index}:${this.list.entities.length}`;
    });
  }

  /**
   * Load channel images feed
   */
  async loadImagesFeed() {
    if (this.list.cantLoadMore() || this.loading) {
      return Promise.resolve();
    }

    this.loading = true;
    const feed = await channelService.getImageFeed(this.guid, this.list.offset);
    this.assignRowKeys(feed);
    this.list.setList(feed);
     
    this.loading = false;
  }

  /**
   * Load channel videos feed
   */
  async loadVideosFeed() {
    if (this.list.cantLoadMore() || this.loading) {
      return Promise.resolve();
    }

    this.loading = true;

    const feed = await channelService.getVideoFeed(this.guid, this.list.offset);
    this.assignRowKeys(feed);
    this.list.setList(feed);
       
    this.loading = false;
  }

  /**
   * Load channel videos feed
   */
  async loadBlogsFeed() {
    if (this.list.cantLoadMore() || this.loading) {
      return Promise.resolve();
    }

    this.loading = true;

    const feed = await channelService.getBlogFeed(this.guid, this.list.offset);
    this.assignRowKeys(feed);
    this.list.setList(feed);
       
    this.loading = false;
  }

  @action
  clearFeed() {
    this.list.clearList();
    this.isTiled = false;
    this.filter      = 'feed';
    this.showrewards = false;
  }

  @action
  async refresh() {
    //ignore refresh on rewards view
    if (this.filter == 'rewards') {
      return;
    }
    //this.list.refresh();
    this.list.clearList();
    await this.load();
    this.list.refreshDone();
  }

  @action
  setFilter(filter) {
    this.filter = filter;

    this.refresh();
  }

}
