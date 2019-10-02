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
      await this.feedsService
        .setLimit(12)
        .setOffset(0)
        .setEndpoint('api/v2/boost/feed')
        .fetchRemoteOrLocal();

      this.boosts = await this.feedsService.getEntities();
    } catch (err) {
      logService.exception('[BoostedContentService]', err);
    }
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
