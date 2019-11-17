// @flow
import FeedsService from "./feeds.service";
import logService from "./log.service";

// types
import type ActivityModel from "../../newsfeed/ActivityModel";

/**
 * Boosted content service
 */
class BoostedContentService {

  offset: number = -1;

  feedsService: FeedsService = new FeedsService;

  boosts: Array<ActivityModel> = [];

  /**
   * Reload boosts list
   */
  load = async(): Promise<any> => {
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
        this.boosts = await this.feedsService.getEntities();
        // refresh boost without the wait
        this.update();
      }

    } catch (err) {
      logService.exception('[BoostedContentService]', err);
    }
  }

  /**
   * Update boosted content from server
   */
  async update() {
    await this.feedsService.fetch();
    this.boosts = await this.feedsService.getEntities();
  }

  /**
   * Fetch one boost
   */
  fetch(): ?ActivityModel {
    this.offset++;

    if (this.offset >= this.boosts.length) {
      this.offset = 0;
    }

    return this.boosts[this.offset];
  }
}

export default new BoostedContentService();
