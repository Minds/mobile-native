import FeedStore from '../../../common/stores/FeedStore';

const createBlockedChannelsStore = () => {
  const store = {
    feedStore: new FeedStore(true),
    async loadList(refresh = false) {
      if (refresh) {
        this.feedStore.clear();
      }

      this.feedStore
        .setEndpoint('api/v1/block')
        .setAsActivities(false)
        .setLimit(12)
        .noSync()
        .setFromFeed(false)
        .fetchRemoteOrLocal(refresh);

      return;
    },
  };
  return store;
};

export type BlockedChannelsStore = ReturnType<
  typeof createBlockedChannelsStore
>;
export default createBlockedChannelsStore;
