import { action, when } from 'mobx';

import NewsfeedService from './NewsfeedService';
import ActivityModel from './ActivityModel';
import FeedStore from '../common/stores/FeedStore';
import UserModel from '../channel/UserModel';
import type FeedList from '../common/components/FeedList';
import { LayoutAnimation } from 'react-native';

/**
 * News feed store
 */
class NewsfeedStore<T> {
  /**
   * Feed store
   */
  feedStore: FeedStore = new FeedStore(true);
  /**
   * List reference
   */
  listRef?: FeedList<T>;

  service = new NewsfeedService();

  /**
   * Constructors
   */
  constructor() {
    this.buildStores();

    // we don't need to unsubscribe to the event because this stores is destroyed when the app is closed
    UserModel.events.on('toggleSubscription', this.onSubscriptionChange);

    // animate the layout change on the first load and then dispose the runner
    when(
      () => this.feedStore.loaded,
      () => LayoutAnimation.configureNext(LayoutAnimation.Presets.spring),
    );
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

  buildStores() {
    this.feedStore
      .getMetadataService()! // we ignore because the metadata is defined
      .setSource('feed/subscribed')
      .setMedium('feed');

    this.feedStore
      .setEndpoint('api/v2/feeds/subscribed/activities')
      .setInjectBoost(true)
      .setLimit(12);
  }

  prepend(entity: ActivityModel) {
    const model = ActivityModel.checkOrCreate(entity);

    this.feedStore.prepend(model);

    model.listRef = this.listRef?.listRef;
  }

  @action
  reset() {
    this.feedStore.reset();
    this.buildStores();
  }
}

export default NewsfeedStore;
