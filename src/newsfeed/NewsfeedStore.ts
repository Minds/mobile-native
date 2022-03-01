import { action, observable } from 'mobx';
import MetadataService from '~/common/services/metadata.service';
import { storages } from '~/common/services/storage/storages.service';
import UserModel from '../channel/UserModel';
import { FeedList } from '../common/components/FeedList';
import FeedStore from '../common/stores/FeedStore';
import ActivityModel from './ActivityModel';
import NewsfeedService from './NewsfeedService';

const FEED_TYPE_KEY = 'newsfeed:feedType';

export type NewsfeedType = 'top' | 'latest';

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
    .setMetadata(
      new MetadataService().setSource('feed/subscribed').setMedium('feed'),
    );
  /**
   * Feed store
   */
  topFeedStore = new FeedStore()
    .setEndpoint('api/v3/newsfeed/feed/unseen-top')
    .setInjectBoost(false)
    .setLimit(12)
    .setMetadata(
      new MetadataService().setSource('feed/subscribed').setMedium('top-feed'),
    );
  /**
   * List reference
   */
  listRef?: FeedList<T>;

  service = new NewsfeedService();

  @observable
  feedType?: NewsfeedType;

  /**
   * Constructors
   */
  constructor() {
    // we don't need to unsubscribe to the event because this stores is destroyed when the app is closed
    UserModel.events.on('toggleSubscription', this.onSubscriptionChange);
    ActivityModel.events.on('newPost', this.onNewPost);
  }

  @action
  changeFeedTypeChange = (feedType: NewsfeedType, refresh = false) => {
    this.feedType = feedType;
    try {
      storages.user?.setString(FEED_TYPE_KEY, feedType);
    } catch (e) {
      console.error(e);
    }
    this.loadFeed(refresh);
  };

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
      switch (this.feedType) {
        case 'top':
          return this.topFeedStore.refresh();
        case 'latest':
          return this.latestFeedStore.refresh();
      }
    }
  };

  public loadFeed = async (refresh?: boolean) => {
    if (!this.feedType) {
      try {
        const storedFeedType = storages.user?.getString(
          FEED_TYPE_KEY,
        ) as NewsfeedType;

        this.feedType = storedFeedType || 'latest';
      } catch (e) {
        console.error(e);
      }
    }

    switch (this.feedType) {
      case 'top':
        return this.topFeedStore.fetchLocalThenRemote(refresh);
      case 'latest':
        return this.latestFeedStore.fetchLocalThenRemote(refresh);
    }
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
  setListRef = r => {
    if (r) {
      this.listRef = r;
    }
  };

  private prepend(entity: ActivityModel) {
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
