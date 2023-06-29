import FeedsService from '~/common/services/feeds.service';
import logService from '~/common/services/log.service';
import sessionService from '~/common/services/session.service';
import BoostedActivityModel from '~/newsfeed/BoostedActivityModel';
import { cleanBoosts } from '../utils/clean-boosts';
import { BOOSTS_DELAY } from '~/config/Config';

/**
 * Boosted content service
 */
class BoostedContentService {
  constructor(private servedByGuid?: string, private source?: string) {}
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
   * @var {Array<BoostedActivityModel>} boosts
   */
  boosts: Array<BoostedActivityModel> = [];

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
        this.boosts = cleanBoosts(await this.feedsService!.getEntities());
        await this.update();
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
        .setEndpoint('api/v3/boosts/feed')
        .setDataProperty('boosts')
        .setParams({
          location: 1,
          served_by_guid: this.servedByGuid,
          source: this.source,
          show_boosts_after_x: BOOSTS_DELAY,
        });
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
   * Update boosted content from server
   */
  async update() {
    try {
      this.updating = true;
      await this.feedsService!.fetch();
      this.boosts = cleanBoosts(await this.feedsService!.getEntities());
    } finally {
      this.updating = false;
    }
  }

  /**
   * Fetch one boost
   */
  fetch(): BoostedActivityModel | null {
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
   * gets a boost that contains media
   */
  getMediaBoost(): BoostedActivityModel | null {
    const boost = this.fetch();

    if (!boost) {
      return null;
    }

    // if the boost has media return it
    if (boost.hasVideo() || boost.hasImage()) {
      return boost;
    }

    // otherwise get another media boost
    return this.getMediaBoost();
  }
}

export { BoostedContentService };

export default new BoostedContentService();
