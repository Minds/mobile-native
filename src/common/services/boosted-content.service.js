// @flow
import FeedsService from "./feeds.service";
import sessionService from "./session.service";

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
   * Constructor
   */
  constructor() {
    // always reload on login or app restart
    sessionService.onLogin(this.load);
  }

  /**
   * Reload boosts list
   */
  load = async(): Promise<any> => {
    await this.feedsService
      .setLimit(12)
      .setOffset(0)
      .setPaginated(false)
      .setEndpoint('api/v2/boost/feed')
      .fetchRemoteOrLocal();

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
