import { action } from 'mobx';
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
  feedStore: FeedStore = new FeedStore()
    .setEndpoint('api/v2/feeds/subscribed/activities')
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
      this.feedStore.removeFromOwner(user.guid);
    } else {
      this.feedStore.refresh();
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
  setListRef = (r: FeedList<T> | null) => {
    if (r) {
      this.listRef = r;
    }
  };

  prepend(entity: ActivityModel) {
    const model = ActivityModel.checkOrCreate(entity);

    this.feedStore.prepend(model);
  }

  @action
  reset() {
    this.feedStore.reset();
  }
}

export default NewsfeedStore;
