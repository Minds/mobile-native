import { Platform } from 'react-native';
import blockListService from '~/common/services/block-list.service';
import FeedsService from '~/common/services/feeds.service';
import logService from '~/common/services/log.service';
import sessionService from '~/common/services/session.service';
import BoostedActivityModel from '~/newsfeed/BoostedActivityModel';

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
        this.boosts = this.cleanBoosts(await this.feedsService!.getEntities());
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
        // TODO:
        .setParams({
          location: 1,
          served_by_guid: this.servedByGuid,
          source: this.source,
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
   * Remove blocked channel's boosts and sets boosted to true
   * @param {Array<BoostedActivityModel>} boosts
   */
  cleanBoosts(
    boosts: Array<BoostedActivityModel>,
  ): Array<BoostedActivityModel> {
    return boosts.filter((entity: BoostedActivityModel) => {
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

export { BoostedContentService };

export default new BoostedContentService();
