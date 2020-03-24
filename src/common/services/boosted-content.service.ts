import FeedsService from "./feeds.service";
import logService from "./log.service";
import blockListService from "./block-list.service";

// types
import type ActivityModel from "../../newsfeed/ActivityModel";

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
  feedsService: FeedsService = new FeedsService();

  /**
   * Boosts
   * @var {Array<ActivityModel>} boosts
   */
  boosts: Array<ActivityModel> = [];

  /**
   * Reload boosts list
   */
  load = async (): Promise<any> => {
    try {
      const done = await this.feedsService
        .setLimit(12)
        .setOffset(0)
        .setPaginated(false)
        .setEndpoint('api/v2/boost/feed')
        .fetchLocal();

      if (!done) {
        await this.update();
      } else {
        this.boosts = this.cleanBoosts(await this.feedsService.getEntities());

        this.update();
      }
    } catch (err) {
      logService.exception('[BoostedContentService]', err);
    }
  };

  /**
   * Remove blocked channel's boosts and sets boosted to true
   * @param {Array<ActivityModel} boosts
   */
  cleanBoosts(boosts: Array<ActivityModel>): Array<ActivityModel> {
    return boosts.filter((e: ActivityModel) => {
      e.boosted = true;
      return !blockListService.has(e.ownerObj.guid);
    });
  }

  /**
   * Update boosted content from server
   */
  async update() {
    await this.feedsService.fetch();
    this.boosts = this.cleanBoosts(await this.feedsService.getEntities());
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
