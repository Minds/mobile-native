import _ from 'lodash';
import { Platform } from 'react-native';
import blockListService from '~/common/services/block-list.service';
import FeedsService from '~/common/services/feeds.service';
import logService from '~/common/services/log.service';
import sessionService from '~/common/services/session.service';
import type ActivityModel from '~/newsfeed/ActivityModel';
import { hasVariation } from '../../../../ExperimentsProvider';

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
   * Feed service
   * @var {FeedsService}
   */
  feedsService?: FeedsService;

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
   * Reload boosts list
   */
  load = async (): Promise<any> => {
    this.init();
    if (!sessionService.userLoggedIn || sessionService.switchingAccount) {
      return;
    }
    try {
      const done = await this.feedsService!.setOffset(0).fetchLocal();

      if (!done) {
        await this.update();
      } else {
        this.boosts = this.cleanBoosts(await this.feedsService!.getEntities());
        this.update();
      }
    } catch (err) {
      logService.exception('[BoostedContentService]', err);
    }
  };

  /**
   * Initialize if necessary
   */
  init() {
    if (!this.feedsService) {
      this.feedsService = new FeedsService();
      this.feedsService
        .setLimit(24)
        .setOffset(0)
        .setPaginated(false)
        .setEndpoint(
          hasVariation('mob-4638-boost-v3')
            ? 'api/v3/boosts/feed'
            : 'api/v2/boost/feed',
        );

      if (hasVariation('mob-4638-boost-v3')) {
        this.feedsService.setDataProperty('boosts');
      }
    }
  }

  /**
   * Clear the service
   */
  clear() {
    this.feedsService?.clear();
    delete this.feedsService;
  }

  /**
   * Remove blocked channel's boosts and sets boosted to true
   * @param {Array<ActivityModel>} boosts
   */
  cleanBoosts(boosts: Array<ActivityModel>): Array<ActivityModel> {
    const cloned = _.cloneDeep(boosts);
    return cloned.filter((e: ActivityModel) => {
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

  /**
   * Update boosted content from server
   */
  async update() {
    try {
      this.updating = true;
      await this.feedsService!.fetch();
      this.boosts = this.cleanBoosts(await this.feedsService!.getEntities());
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
