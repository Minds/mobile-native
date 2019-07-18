import {
  observable,
  action,
  computed,
  extendObservable
} from 'mobx';

import ActivityModel from '../newsfeed/ActivityModel';
import BlogModel from '../blogs/BlogModel';
import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';
import UserModel from '../channel/UserModel';
import GroupModel from '../groups/GroupModel';
import { isNetworkFail } from '../common/helpers/abortableFetch';
import FeedStore from '../common/stores/FeedStore';

/**
 * Discovery Feed Store
 */
class DiscoveryFeedStore {

  /**
   * Lists stores
   */
  list;
  filters;

  constructor(filters) {
    this.filters = filters;
    this.buildListStores();
  }

  setFeed(feed) {
    this.list.clear();
    this.list.viewed.clearViewed();

    this.list
      .setFeed(feed)
      .setOffset(0)
      .hydratePage();
  }

  /**
   * Build lists stores
   */
  buildListStores() {
    this.list = new FeedStore(true);

    this.list.getMetadataService()
      .setSource('feed/discovery')
      .setMedium('feed');
  }

  reset() {
    this.list.clear();
  }
}

export default DiscoveryFeedStore;
