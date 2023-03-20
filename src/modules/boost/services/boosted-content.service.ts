import { Platform } from 'react-native';
import apiService from '~/common/services/api.service';
import blockListService from '~/common/services/block-list.service';
import sessionService from '~/common/services/session.service';
import { storages } from '~/common/services/storage/storages.service';
import BoostedContentModel from '~/newsfeed/BoostedContentModel';

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
   * @var {Array<BoostedContentModel>} boosts
   */
  boosts: Array<BoostedContentModel> = [];

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
   * @param {Array<BoostedContentModel>} boosts
   */
  cleanBoosts(boosts: Array<BoostedContentModel>): Array<BoostedContentModel> {
    return boosts.filter((entity: BoostedContentModel) => {
      entity.boosted = true;
      // remove NSFW on iOS
      if (Platform.OS === 'ios' && entity.nsfw && entity.nsfw.length) {
        return false;
      }
      return entity.type === 'user'
        ? false
        : !blockListService.has(entity.ownerObj?.guid);
    });
  }

  loadCached() {
    const boosts = storages.session?.getArray<BoostedContentModel>(
      'BoostServiceCache',
    );
    if (boosts) {
      this.boosts = BoostedContentModel.createMany(boosts);
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

        this.boosts = BoostedContentModel.createMany(filteredBoosts);

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
  fetch(): BoostedContentModel | null {
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

  /**
   * gets boosts that contain media
   */
  getMediaBoost(): BoostedContentModel | null {
    const boost = this.fetch();

    if (boost) {
      // if the boost has media return it
      if (boost.hasVideo() || boost.hasImage()) {
        return boost;
      }

      // otherwise get another media boost
      return this.getMediaBoost();
    }

    return null;
  }
}

export default new BoostedContentService();
