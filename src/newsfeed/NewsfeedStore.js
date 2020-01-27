import {observable, action} from 'mobx';

import NewsfeedService from './NewsfeedService';
import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';
import ActivityModel from './ActivityModel';
import logService from '../common/services/log.service';
import boostedContentService from '../common/services/boosted-content.service';

import FeedStore from '../common/stores/FeedStore';
import {isNetworkFail} from '../common/helpers/abortableFetch';
import UserModel from '../channel/UserModel';

/**
 * News feed store
 */
class NewsfeedStore {
  feedStore = new FeedStore(true);

  /**
   * List reference
   */
  listRef;

  service = new NewsfeedService();

  @observable filter = 'subscribed';
  @observable loading = false;

  @observable.ref boosts = [];

  /**
   * List loading
   */
  loadingBoost = true;

  /**
   * Constructors
   */
  constructor() {
    this.buildStores();

    // we don't need to unsubscribe to the event because this stores is destroyed when the app is closed
    UserModel.events.on('toggleSubscription', this.onSubscriptionChange);
  }

  /**
   * On subscription change
   */
  onSubscriptionChange = (user: UserModel) => {
    if (!user.subscribed) {
      this.feedStore.removeFromOwner(user.guid);
    } else {
      this.feedStore.refresh();
    }
  };

  /**
   * Scroll to top
   */
  scrollToTop() {
    if (this.filter !== 'subscribed') return;
    this.listRef.scrollToTop(false);
  }

  /**
   * Set FeedList reference
   */
  setListRef = r => (this.listRef = r);

  buildStores() {
    this.list = new OffsetFeedListStore('shallow', true);

    this.feedStore
      .getMetadataService()
      .setSource('feed/subscribed')
      .setMedium('feed');

    this.list
      .getMetadataService()
      .setSource('feed/boosts')
      .setMedium('featured-content');

    this.feedStore
      .setEndpoint('api/v2/feeds/subscribed/activities')
      .setInjectBoost(true)
      .setLimit(12);
  }

  /**
   * Load boost feed
   */
  @action
  async loadFeed(refresh = false) {
    let feed;

    if (this.list.cantLoadMore() || this.loading) {
      return Promise.resolve();
    }

    this.list.setErrorLoading(false);

    this.loading = true;

    try {
      feed = await this.service.getBoosts(this.list.offset, 12);

      feed.entities = ActivityModel.createMany(feed.entities);
      this.assignRowKeys(feed);
      this.list.setList(feed, refresh);
      this.loaded = true;
    } catch (err) {
      // ignore aborts
      if (err.code === 'Abort') return;

      this.list.setErrorLoading(true);

      if (!isNetworkFail(err)) {
        logService.exception('[NewsfeedStore] loadFeed', err);
      }
    } finally {
      this.loading = false;
    }
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
   * Set filter
   * @param {string} filter
   */
  @action
  setFilter(filter) {
    this.filter = filter;
    this.list.clearList();
    this.loadFeed(true, false);
  }

  /**
   * Load boosts
   */
  loadBoosts(rating) {
    // get first 15 boosts
    this.loadingBoost = true;
    this.service.getBoosts('', 15, rating).then(boosts => {
      this.loadingBoost = false;
      this.boosts = boosts.entities;
    });
  }

  prepend(entity) {
    const model = ActivityModel.checkOrCreate(entity);

    model.listRef = this.listRef.listRef;

    this.feedStore.prepend(model);
  }

  @action
  clearFeed() {
    this.list.clearList();
  }

  @action
  clearBoosts() {
    this.boosts = [];
  }

  @action
  async refresh() {
    // when refresh we report viewed again
    await this.list.refresh();
    await this.loadFeed(true);
    this.list.refreshDone();
  }

  @action
  reset() {
    this.feedStore.reset();
    this.buildStores();
    this.filter = 'subscribed';
    this.boosts = [];
    this.loading = false;
    this.loadingBoost = false;
  }
}

export default NewsfeedStore;
