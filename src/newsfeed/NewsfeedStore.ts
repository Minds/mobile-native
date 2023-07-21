import { action, observable } from 'mobx';
import type BaseModel from '~/common/BaseModel';
import MetadataService from '~/common/services/metadata.service';
import { storages } from '~/common/services/storage/storages.service';
import UserModel from '../channel/UserModel';
import { FeedList } from '../common/components/FeedList';
import FeedStore from '../common/stores/FeedStore';
import ActivityModel from './ActivityModel';
import NewsfeedService from './NewsfeedService';
import { hasVariation } from 'ExperimentsProvider';
import sessionService from '../common/services/session.service';

const FEED_TYPE_KEY = 'newsfeed:feedType';

export type NewsfeedType = 'top' | 'latest' | 'foryou' | 'groups';

/**
 * News feed store
 */
class NewsfeedStore<T extends BaseModel> {
  /**
   * Feed store
   */
  latestFeedStore = new FeedStore()
    .setEndpoint('api/v2/feeds/subscribed/activities')
    .setCountEndpoint('api/v3/newsfeed/subscribed/latest/count')
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
    .setInjectBoost(true)
    .setLimit(12)
    .setPaginated(false) // this endpoint doesn't support pagination!
    .setMetadata(new MetadataService().setSource('top-feed').setMedium('feed'));

  /**
   * Highlight store
   */
  highlightsStore = new FeedStore()
    .setEndpoint('api/v3/newsfeed/feed/unseen-top')
    .setInjectBoost(false)
    .setPaginated(false)
    .setLimit(3)
    .setMetadata(
      new MetadataService().setSource('feed/highlights').setMedium('feed'),
    );

  /**
   * For you store
   */
  forYouStore = new FeedStore()
    .setEndpoint('api/v3/newsfeed/feed/clustered-recommendations')
    .setParams({ unseen: true })
    .setInjectBoost(false)
    .setLimit(15);

  /**
   * Feed store
   */
  groupsFeedStore = new FeedStore()
    .setEndpoint('api/v2/feeds/subscribed/activities')
    .setCountEndpoint('api/v3/newsfeed/subscribed/latest/count')
    .setInjectBoost(true)
    .setLimit(12)
    .setMetadata(
      new MetadataService().setSource('feed/subscribed').setMedium('feed'),
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

  get feedStore() {
    switch (this.feedType) {
      case 'foryou':
        return this.forYouStore;
      case 'top':
        return this.topFeedStore;
      case 'groups':
        return this.groupsFeedStore;
      case 'latest':
      default:
        return this.latestFeedStore;
    }
  }

  /**
   * Change FeedType and refresh the feed
   */
  @action
  changeFeedType = (feedType: NewsfeedType, refresh = false) => {
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
  onSubscriptionChange = ({
    user,
    shouldUpdateFeed,
  }: {
    user: UserModel;
    shouldUpdateFeed: boolean;
  }) => {
    if (!shouldUpdateFeed) {
      return;
    }

    if (!user.subscribed) {
      this.topFeedStore.removeFromOwner(user.guid);
      this.latestFeedStore.removeFromOwner(user.guid);
    } else {
      this.feedStore.refresh();
    }
  };

  public loadFeed = async (refresh?: boolean) => {
    if (!this.feedType) {
      try {
        let storedFeedType = storages.user?.getString(
          FEED_TYPE_KEY,
        ) as NewsfeedType;

        // in case we have stored the foryou tab and it's not in the experiment, we default to latest
        if (
          !hasVariation('mob-4938-newsfeed-for-you') &&
          storedFeedType === 'foryou'
        ) {
          storages.user?.setString(FEED_TYPE_KEY, 'latest');
          storedFeedType = 'latest';
        }

        this.feedType = storedFeedType || 'latest';
      } catch (e) {
        console.error(e);
      }
    }

    let waitPromise: Promise<any> | undefined;

    // we should clear the top feed as it doesn't support pagination and if it already has data it will generate duplicated posts
    if (this.feedType === 'top') {
      refresh = true;
    } else if (this.feedType === 'groups') {
      this.groupsFeedStore.setParams({
        group_posts_for_user_guid: sessionService.getUser()?.guid,
      });
    } else {
      // fetch highlights for the latests feed
      waitPromise = this.highlightsStore.fetch();
    }

    this.feedStore.fetchRemoteOrLocal(refresh, waitPromise);
  };

  /**
   * Scroll to top
   */
  scrollToTop() {
    if (this.listRef) {
      this.listRef.scrollToOffset({ offset: 0 });
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
    this.feedStore.prepend(model);
  }

  @action
  reset() {
    this.highlightsStore.reset();
    this.latestFeedStore.reset();
    this.topFeedStore.reset();
    this.forYouStore.reset();
    this.groupsFeedStore.reset();
    this.feedType = undefined;
  }
}

export default NewsfeedStore;
