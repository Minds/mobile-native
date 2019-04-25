import {
  observable,
  action,
  computed,
  extendObservable
} from 'mobx'

import {
  getFeedChannel,
  toggleComments,
  toggleExplicit,
  setViewed
} from '../newsfeed/NewsfeedService';

import api from '../common/services/api.service';
import channelService from './ChannelService';
import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';
import ActivityModel from '../newsfeed/ActivityModel';
import BlogModel from '../blogs/BlogModel';
import logService from '../common/services/log.service';

/**
 * Channel Feed store
 */
export default class ChannelFeedStore {

  @observable filter = 'feed';
  @observable showrewards = false;

  channel;

  viewed = [];

  /**
   * Channel guid
   */
  guid = null;

  constructor(guid) {
    this.guid = guid;
    this.buildStores();
  }

  buildStores() {
    this.stores = {
      feed: {
        list: new OffsetFeedListStore('shallow'),
      },
      images: {
        list: new OffsetFeedListStore('shallow'),
        isTiled: true,
      },
      videos: {
        list: new OffsetFeedListStore('shallow'),
        isTiled: true,
      },
      blogs: {
        list: new OffsetFeedListStore('shallow'),
        isTiled: false,
      },
    };
    extendObservable(this.stores.feed,{
      loading: false
    });
    extendObservable(this.stores.images,{
      loading: false
    });
    extendObservable(this.stores.videos,{
      loading: false
    });
    extendObservable(this.stores.blogs,{
      loading: false
    });
  }

  @action
  setChannel(channel) {
    this.channel = channel;
  }

  get store() {
    return this.stores[this.filter]
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

  /**
   * Load selected feed
   * @param {boolean} refresh
   */
  async loadFeed(refresh = false) {
    if (this.list.cantLoadMore() || this.loading) {
      return Promise.resolve();
    }
    switch (this.filter) {
      case 'feed':
        await this._loadFeed(refresh);
        break;
      case 'images':
        await this._loadImagesFeed(refresh);
        break;
      case 'videos':
        await this._loadVideosFeed(refresh);
        break;
      case 'blogs':
        await this._loadBlogsFeed(refresh);
        break;
    }
  }

  /**
   * Load channel feed
   */
  async _loadFeed(refresh = false) {
    // reference the store because it may change after the await
    const store = this.store;

    if (!this.channel || store.list.cantLoadMore()) {
      return;
    }

    store.loading = true;
    store.list.setErrorLoading(false);

    try {

      let opts = {
        offset: store.list.offset,
        limit: 12,
      };

      if (
        this.channel.pinned_posts
        && this.channel.pinned_posts.length
        && !store.list.offset
      ) {
        opts.pinned = this.channel.pinned_posts.join(',');
      }

      const feed = await channelService.getFeed(this.channel.guid, opts);

      if (feed.entities.length > 0) {
        feed.entities = ActivityModel.createMany(feed.entities);
        this.assignRowKeys(feed);
      }
      this.list.setList(feed, refresh);

    } catch (err) {
      // ignore aborts
      if (err.code === 'Abort') return;
      store.list.setErrorLoading(true);
      if (!(typeof err === 'TypeError' && err.message === 'Network request failed')) {
        logService.exception('[ChannelFeedStore] _loadFeed', err);
      }
    } finally {
      store.loading = false;
    }
  }

  /**
   * Load channel images feed
   */
  async _loadImagesFeed(refresh = false) {
    // reference the store because it may change after the await
    const store = this.store;

    store.loading = true;
    store.list.setErrorLoading(false);

    try {
      const feed = await channelService.getImageFeed(this.guid, this.list.offset);
      feed.entities = ActivityModel.createMany(feed.entities);
      this.assignRowKeys(feed, store);
      store.list.setList(feed, refresh);
    } catch (err) {
      // ignore aborts
      if (err.code === 'Abort') return;
      store.list.setErrorLoading(true);
      if (!(typeof err === 'TypeError' && err.message === 'Network request failed')) {
        logService.exception('[ChannelFeedStore] _loadImagesFeed', err);
      }
    } finally {
      store.loading = false;
    }
  }

  /**
   * Load channel videos feed
   */
  async _loadVideosFeed(refresh = false) {
    // reference the store because it may change after the await
    const store = this.store;

    store.loading = true;
    store.list.setErrorLoading(false);

    try {
      const feed = await channelService.getVideoFeed(this.guid, this.list.offset);
      feed.entities = ActivityModel.createMany(feed.entities);
      this.assignRowKeys(feed, store);
      store.list.setList(feed, refresh);
    } catch (error) {
      // ignore aborts
      if (err.code === 'Abort') return;
      if (!(typeof err === 'TypeError' && err.message === 'Network request failed')) {
        logService.exception('[ChannelFeedStore] _loadVideosFeed', err);
      }
      store.list.setErrorLoading(true);
    } finally {
      store.loading = false;
    }
  }

  /**
   * Load channel videos feed
   */
  async _loadBlogsFeed(refresh) {
    // reference the store because it may change after the await
    const store = this.store;

    store.loading = true;
    store.list.setErrorLoading(false);

    try {
      const feed = await channelService.getBlogFeed(this.guid, this.list.offset);
      if (store.list.offset) {
        feed.entities.shift();
      }
      feed.entities = BlogModel.createMany(feed.entities);
      this.assignRowKeys(feed, store);
      store.list.setList(feed, refresh);
    } catch (err) {
      store.list.setErrorLoading(true);
      if (!(typeof err === 'TypeError' && err.message === 'Network request failed')) {
        logService.exception('[ChannelFeedStore] _loadBlogsFeed', err);
      }
    } finally {
      store.loading = false;
    }
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
    // reference because it could change after the await
    const list  = this.list;
    //this.list.refresh();
    list.clearList();
    await this.loadFeed(true);
    this.viewed = [];
    list.refreshDone();
  }

  @action
  setFilter(filter) {
    this.filter = filter;
    this.refresh();
  }
}
