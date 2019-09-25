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
import featuresService from '../common/services/features.service';
import FeedStore from '../common/stores/FeedStore';
import { isNetworkFail } from '../common/helpers/abortableFetch';

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

  get esFeedfilter () {
    switch (this.filter) {
      case 'feed': return 'activities';
      case 'images': return 'images';
      case 'videos': return 'videos';
      case 'blogs': return 'blogs';
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

    this.feedStore.setEndpoint(`api/v2/${this.endpoint}/${this.guid}/${this.esFeedfilter}`)
      .setLimit(12)
      .fetchRemoteOrLocal();

    return;
  }

  /**
   * Get channel scheduled activities count
   */
  async getScheduledCount() {
    const count = await channelService.getScheduledCount(this.guid);
    return count;
  }

  /**
   * Get channel scheduled activities count
   */
  async getScheduledCount() {
    const count = await channelService.getScheduledCount(this.guid);
    return count;
  }

  @action
  clearFeed() {
    this.filter      = 'feed';
    this.showrewards = false;
    this.feedStore.clear();
  }

  @action
  async refresh() {
    //ignore refresh on rewards view
    if (this.filter == 'rewards') {
      return;
    }

    this.feedStore.clear();
    this.feedStore.setEndpoint(`api/v2/${this.endpoint}/${this.guid}/${this.esFeedfilter}`)
      .setLimit(12)
      .fetchRemoteOrLocal();

    return;

  }

  @action
  setFilter(filter) {
    this.filter = filter;

    this.feedStore.setEndpoint(`api/v2/${this.endpoint}/${this.guid}/${this.esFeedfilter}`)
      .setIsTiled(filter === 'images' || filter === 'videos')
      .clear()
      .fetchRemoteOrLocal();
  }

  @action
  toggleScheduled() {
    this.endpoint = this.endpoint == this.feedsEndpoint ? this.scheduledEndpoint : this.feedsEndpoint;
    this.setFilter(this.filter);
  }
}
