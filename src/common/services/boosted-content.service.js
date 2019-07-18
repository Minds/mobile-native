import apiService from "./api.service";
import FeedStore from "../stores/FeedStore";

class BoostedContentService {
  offset: number = -1;

  feedStore = new FeedStore;

  constructor() {
    // TODO: LOAD when session begin
    // this.feedStore
    //   .setLimit(50)
    //   .setOffset(0)
    //   .setEndpoint('api/v2/boost/feed')
    //   .fetch();
  }

  fetch() {
    //TODO: IMPLEMENT
  }


}

export default new BoostedContentService();
