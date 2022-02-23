import { action, observable } from 'mobx';

import NewsfeedService from './NewsfeedService';
import ActivityModel from './ActivityModel';
import FeedStore from '../common/stores/FeedStore';
import UserModel from '../channel/UserModel';
import type FeedList from '../common/components/FeedList';
import MetadataService from '~/common/services/metadata.service';

/**
 * News feed store
 */
class NewsfeedStore<T> {
  /**
   * Feed store
   */
  latestFeedStore = new FeedStore()
    .setEndpoint('api/v2/feeds/subscribed/activities')
    .setInjectBoost(true)
    .setLimit(12)
    .setMetadataService(
      new MetadataService().setSource('feed/subscribed').setMedium('feed'),
    );
  /**
   * Feed store
   */
  topFeedStore = new FeedStore()
    .setEndpoint('api/v3/newsfeed/feed/unseen-top')
    .setInjectBoost(false)
    .setLimit(3)
    .setMetadataService(
      new MetadataService().setSource('feed/subscribed').setMedium('top-feed'),
    );
  /**
   * List reference
   */
  listRef?: FeedList<T>;
  /**
   * Refreshing state of the newsfeed.
   * used to mix topFeed and latest feed refreshing state
   */
  @observable refreshing = false;

  service = new NewsfeedService();

  /**
   * Constructors
   */
  constructor() {
    // we don't need to unsubscribe to the event because this stores is destroyed when the app is closed
    UserModel.events.on('toggleSubscription', this.onSubscriptionChange);
    ActivityModel.events.on('newPost', this.onNewPost);
  }

  /**
   * On new post created
   */
  onNewPost = (entity: ActivityModel) => {
    this.prepend(entity);
  };

  /**
   * On subscription change
   */
  onSubscriptionChange = (user: UserModel) => {
    if (!user.subscribed) {
      this.topFeedStore.removeFromOwner(user.guid);
      this.latestFeedStore.removeFromOwner(user.guid);
    } else {
      this.topFeedStore.refresh();
      this.latestFeedStore.refresh();
    }
  };

  public loadFeed = async () => {
    await this.topFeedStore.refresh();
    await this.latestFeedStore.fetchLocalThenRemote(true);
  };

  @action
  public refreshFeed = async () => {
    this.refreshing = true;

    await Promise.all([
      this.topFeedStore.refresh(),
      this.latestFeedStore.refresh(),
    ]);

    this.refreshing = false;
  };

  /**
   * Scroll to top
   */
  scrollToTop() {
    if (this.listRef) {
      this.listRef.scrollToTop(false);
    }
  }

  /**
   * Set FeedList reference
   */
  setListRef = (r: FeedList<T> | null) => {
    if (r) {
      this.listRef = r;
    }
  };

  prepend(entity: ActivityModel) {
    const model = ActivityModel.checkOrCreate(entity);

    this.latestFeedStore.prepend(model);
  }

  @action
  reset() {
    this.latestFeedStore.reset();
    this.topFeedStore.reset();
  }
}

export default NewsfeedStore;
