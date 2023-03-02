import { Platform } from 'react-native';
import apiService from '~/common/services/api.service';
import blockListService from '~/common/services/block-list.service';
import sessionService from '~/common/services/session.service';
import { storages } from '~/common/services/storage/storages.service';
import ActivityModel from '~/newsfeed/ActivityModel';

/**
 * Boosted content service
 */
class BoostedContentService {
  /**
   * Offset
   * @var {number}
   */
  offset: number = -1;

  /**
   * Boosts
   * @var {Array<ActivityModel>} boosts
   */
  boosts: Array<ActivityModel> = [];

  /**
   * whether the feed is updating
   */
  updating = false;

  /**
   * Initialize if necessary
   */
  init() {
    if (!sessionService.userLoggedIn || sessionService.switchingAccount) {
      return;
    }
    this.loadCached();
    return this.update();
  }

  /**
   * Clear the service
   */
  clear() {
    this.boosts = [];
  }

  /**
   * Remove blocked channel's boosts and sets boosted to true
   * @param {Array<ActivityModel>} boosts
   */
  cleanBoosts(boosts: Array<ActivityModel>): Array<ActivityModel> {
    return boosts.filter((e: ActivityModel) => {
      e.boosted = true;
      // remove NSFW on iOS
      if (Platform.OS === 'ios' && e.nsfw && e.nsfw.length) {
        return false;
      }
      return e.type === 'user'
        ? false
        : !blockListService.has(e.ownerObj?.guid);
    });
  }

  loadCached() {
    const boosts = storages.session?.getArray<ActivityModel>(
      'BoostServiceCache',
    );
    if (boosts) {
      this.boosts = ActivityModel.createMany(boosts);
    }
  }

  /**
   * Update boosted content from server
   */
  async update() {
    try {
      this.updating = true;
      const response = await apiService.get<any>('api/v3/boosts/feed', {
        location: 1,
      });
      if (response?.boosts) {
        const filteredBoosts = this.cleanBoosts(
          response.boosts.map(b => b.entity),
        );

        this.boosts = ActivityModel.createMany(filteredBoosts);

        // cache boosts
        storages.session?.setArray('BoostServiceCache', filteredBoosts);
      }
    } finally {
      this.updating = false;
    }
  }

  /**
   * Fetch one boost
   */
  fetch(): ActivityModel | null {
    this.offset++;

    if (this.offset >= this.boosts.length) {
      this.offset = 0;
      if (!this.updating) {
        this.update().then(() => {
          this.offset = 0;
        });
      }
    }

    return this.boosts[this.offset];
  }
}

export default new BoostedContentService();
