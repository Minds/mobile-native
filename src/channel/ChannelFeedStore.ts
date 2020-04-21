//@ts-nocheck
import { observable, action } from 'mobx';

import FeedStore from '../common/stores/FeedStore';

/**
 * Channel Feed store
 */
export default class ChannelFeedStore {
  feedsEndpoint = 'feeds/container';
  scheduledEndpoint = 'feeds/scheduled';

  @observable filter = 'feed';
  @observable showrewards = false;
  @observable endpoint = 'feeds/container';

  channel;

  /**
   * @var {FeedStore}
   */
  feedStore;

  /**
   * Channel guid
   */
  guid = null;

  constructor(guid) {
    this.guid = guid;
    this.feedStore = new FeedStore(true);
  }

  get esFeedfilter() {
    switch (this.filter) {
      case 'feed':
        return 'activities';
      case 'images':
        return 'images';
      case 'videos':
        return 'videos';
      case 'blogs':
        return 'blogs';
    }
  }

  @action
  setChannel(channel) {
    this.channel = channel;
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

  /**
   * Load selected feed
   * @param {boolean} refresh
   */
  async loadFeed(refresh = false) {
    if (refresh) this.feedStore.clear();

    this.feedStore
      .setEndpoint(`api/v2/${this.endpoint}/${this.guid}/${this.esFeedfilter}`)
      .setAsActivities(this.esFeedfilter !== 'blogs')
      .setLimit(12)
      .fetchRemoteOrLocal();

    return;
  }

  /**
   * Get channel scheduled activities count
   */
  async getScheduledCount() {
    await this.feedStore.getScheduledCount(this.guid);
  }

  @action
  clearFeed() {
    this.filter = 'feed';
    this.showrewards = false;
    this.feedStore.clear();
  }

  @action
  async refresh() {
    // ignore refresh on rewards or requests view
    if (this.filter == 'rewards' || this.filter == 'request') {
      return;
    }

    this.feedStore.clear();
    this.feedStore
      .setEndpoint(`api/v2/${this.endpoint}/${this.guid}/${this.esFeedfilter}`)
      .setAsActivities(this.esFeedfilter !== 'blogs')
      .setLimit(12)
      .fetchRemoteOrLocal();

    return;
  }

  @action
  setFilter(filter) {
    this.filter = filter;

    if (filter == 'requests' || filter == 'rewards') return;

    this.feedStore
      .setEndpoint(`api/v2/${this.endpoint}/${this.guid}/${this.esFeedfilter}`)
      .setIsTiled(filter === 'images' || filter === 'videos')
      .setAsActivities(this.esFeedfilter !== 'blogs')
      .clear()
      .fetchRemoteOrLocal();
  }

  @action
  toggleScheduled() {
    this.endpoint =
      this.endpoint == this.feedsEndpoint
        ? this.scheduledEndpoint
        : this.feedsEndpoint;
    this.setFilter(this.filter);
  }
}
