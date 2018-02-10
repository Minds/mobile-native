import { observable, action, computed } from 'mobx'

import { getFeedChannel, toggleComments , toggleExplicit, setViewed } from '../newsfeed/NewsfeedService';

import channelService from './ChannelService';

import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';
import ActivityModel from '../newsfeed/ActivityModel';
import BlogModel from '../blogs/BlogModel';
/**
 * Channel Feed store
 */
export default class ChannelFeedStore {

  @observable filter = 'feed';
  @observable showrewards = false;

  viewed = [];
  stores = {
    feed: {
      list: new OffsetFeedListStore('shallow'),
      loading: false,
    },
    images: {
      list: new OffsetFeedListStore('shallow'),
      loading: false,
      isTiled: true,
    },
    videos: {
      list: new OffsetFeedListStore('shallow'),
      loading: false,
      isTiled: true,
    },
    blogs: {
      list: new OffsetFeedListStore('shallow'),
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

  /**
   * Generate a unique Id for use with list views
   * @param {object} feed
   */
  assignRowKeys(feed) {
    if (!feed.entities) return;
    feed.entities.forEach((entity, index) => {
      entity.rowKey = `${entity.guid}:${index}:${this.list.entities.length}`;
    });
  }

  @action
  async addViewed(entity) {
    if(this.viewed.indexOf(entity.guid) < 0) {
      let response;
      try {
        response = await setViewed(entity);
        if (response) {
          this.viewed.push(entity.guid);
        }
      } catch (e) {
        throw new Error('There was an issue storing the view');
      }
    }
  }

  async loadFeed() {
    if (this.list.cantLoadMore() || this.loading) {
      return Promise.resolve();
    }
    switch (this.filter) {
      case 'feed':
        await this._loadFeed();
        break;
      case 'images':
        await this._loadImagesFeed();
        break;
      case 'videos':
        await this._loadVideosFeed();
        break;
      case 'blogs':
        await this._loadBlogsFeed();
        break;
    }
  }

  /**
   * Load channel feed
   */
  async _loadFeed() {
    this.loading = true;
    const filter = this.filter;

    const feed = await getFeedChannel(this.guid, this.list.offset)

    if (this.filter == 'feed') {
      this.assignRowKeys(feed);
      feed.entities = ActivityModel.createMany(feed.entities);
      this.list.setList(feed);
    }

    this.stores[filter].loading = false;
  }


  /**
   * Load channel images feed
   */
  async _loadImagesFeed() {
    this.loading = true;
    const filter = this.filter;

    const feed = await channelService.getImageFeed(this.guid, this.list.offset);

    if (this.filter == 'images') {
      feed.entities = ActivityModel.createMany(feed.entities);
      this.assignRowKeys(feed);
      this.list.setList(feed);
    }

    this.stores[filter].loading = false;
  }

  /**
   * Load channel videos feed
   */
  async _loadVideosFeed() {
    this.loading = true;
    const filter = this.filter;

    const feed = await channelService.getVideoFeed(this.guid, this.list.offset);

    if (this.filter == 'videos') {
      feed.entities = ActivityModel.createMany(feed.entities);
      this.assignRowKeys(feed);
      this.list.setList(feed);
    }

    this.stores[filter].loading = false;
  }

  /**
   * Load channel videos feed
   */
  async _loadBlogsFeed() {
    this.loading = true;
    const filter = this.filter;

    const feed = await channelService.getBlogFeed(this.guid, this.list.offset);

    if (this.filter == 'blogs') {
      feed.entities = BlogModel.createMany(feed.entities);
      this.assignRowKeys(feed);
      this.list.setList(feed);
    }

    this.stores[filter].loading = false;
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
    await this.loadFeed();
    this.viewed = [];
    this.list.refreshDone();
  }

  @action
  setFilter(filter) {
    this.filter = filter;

    this.refresh();
  }

}
