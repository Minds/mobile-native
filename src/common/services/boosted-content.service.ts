import _ from 'lodash';
import FeedsService from './feeds.service';
import logService from './log.service';
import blockListService from './block-list.service';

// types
import type ActivityModel from '../../newsfeed/ActivityModel';
import sessionService from './session.service';
import { Platform } from 'react-native';

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
   * Interval
   */
  interval?: number = undefined;

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
        .setEndpoint('api/v2/boost/feed');
    }
  }

  /**
   * Clear the service
   */
  clear() {
    this.feedsService?.clear();
    delete this.feedsService;
    if (this.interval) {
      clearInterval(this.interval);
    }
    delete this.interval;
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
      return !blockListService.has(e.ownerObj.guid);
    });
  }

  /**
   * Update boosted content from server
   */
  async update() {
    await this.feedsService!.fetch();
    this.boosts = this.cleanBoosts(await this.feedsService!.getEntities());
  }

  /**
   * Fetch one boost
   */
  fetch(): ActivityModel | null {
    this.offset++;

    if (this.offset >= this.boosts.length) {
      this.offset = 0;
    }

    return this.boosts[this.offset];
  }
}

export default new BoostedContentService();
