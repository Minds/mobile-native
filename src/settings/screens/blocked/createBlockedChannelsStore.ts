import type UserModel from '~/channel/UserModel';
import FeedStore from '~/common/stores/FeedStore';

const createBlockedChannelsStore = () => {
  const store = {
    feedStore: new FeedStore<UserModel>(true),
    async loadList(refresh = false) {
      if (refresh) {
        this.feedStore.clear();
      }
      this.feedStore
        .setEndpoint('api/v1/block')
        .setAsActivities(false)
        .setLimit(12)
        .noSync()
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
