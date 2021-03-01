import { action } from 'mobx';

import NewsfeedService from './NewsfeedService';
import ActivityModel from './ActivityModel';
import FeedStore from '../common/stores/FeedStore';
import UserModel from '../channel/UserModel';
import { FeedListType } from '../common/components/feedlist/FeedList';
import React from 'react';

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
  listRef = React.createRef<FeedListType<T>>();

  service = new NewsfeedService();

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
    if (this.listRef) {
      //@ts-ignore
      this.listRef.current.scrollToTop(false);
    }
  }

  /**
   * Set FeedList reference
   */
  setListRef = (r: FeedListType<T> | null) => {
    if (r) {
      //@ts-ignore
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

    //@ts-ignore
    model.listRef = this.listRef?.current.listRef;
  }

  @action
  reset() {
    this.feedStore.reset();
    this.buildStores();
  }
}

export default NewsfeedStore;
