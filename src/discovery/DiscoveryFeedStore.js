import {
  observable,
  action,
  computed,
  extendObservable
} from 'mobx';

import discoveryService from './DiscoveryService';
import ActivityModel from '../newsfeed/ActivityModel';
import BlogModel from '../blogs/BlogModel';
import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';
import UserModel from '../channel/UserModel';
import GroupModel from '../groups/GroupModel';
import NewsfeedFilterStore from '../common/stores/NewsfeedFilterStore';

/**
 * Discovery Feed Store
 */
class DiscoveryFeedStore {

  /**
   * Lists stores
   */
  list;
  filters;

  @observable loading = false;

  constructor(filters) {
    this.filters = filters;
    this.buildListStores();
  }

  setFeed(entities, offset) {
    this.list.clearList();
    this.list.clearViewed();
    this.list.setList({entities, offset});
  }

  /**
   * Build lists stores
   */
  buildListStores() {
    this.list = new OffsetFeedListStore('shallow', true);

    this.list.getMetadataService()
      .setSource('feed/discovery')
      .setMedium('feed');
  }

  @action
  setLoading(value) {
    this.loading = value;
  }

  /**
   * Load feed
   */
  @action
  async loadList(refresh = false, preloadImage = false, limit = 12) {
    const type = this.filters.type;

    // no more data or loading? return
    if (!refresh && (this.list.cantLoadMore() || this.loading)) {
      return;
    }

    this.list.setErrorLoading(false);

    this.setLoading(true);

    try {
      const feed = await discoveryService.getTopFeed(
        this.list.offset,
        this.filters.type,
        this.filters.filter,
        this.filters.period,
        this.filters.nsfw.concat([]),
        this.filters.searchtext,
        limit
      );

      this.createModels(type, feed, preloadImage);
      this.assignRowKeys(feed);
      this.list.setList(feed, refresh);
    } catch (err) {
      // ignore aborts
      if (err.code === 'Abort') {
        return;
      }
      if (!(typeof err === 'TypeError' && err.message === 'Network request failed')) {
        logService.exception('[DiscoveryFeedStore]', err);
      }
      this.list.setErrorLoading(true);
    } finally {
      this.setLoading(false);
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

  createModels(type, feed, preloadImage) {
    switch (type) {
      case 'images':
      case 'videos':
        feed.entities = ActivityModel.createMany(feed.entities);
        if (preloadImage) {
          feed.entities.forEach(entity => {
            entity.preloadThumb();
          });
        }
        break;
    }
  }

  @action
  reset() {
    this.list.clearList();
    this.loading = false;
  }
}

export default DiscoveryFeedStore;
