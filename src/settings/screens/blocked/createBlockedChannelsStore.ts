import type UserModel from '~/channel/UserModel';
import FeedStore from '~/common/stores/FeedStore';

const createBlockedChannelsStore = () => {
  const store = {
    loading: false,
    feedStore: new FeedStore<UserModel>(true),
    async loadList(refresh = false) {
      if (refresh) {
        this.feedStore.clear();
      }
      this.loading = true;
      await this.feedStore
        .setEndpoint('api/v1/block')
        .setAsActivities(false)
        .setLimit(12)
        .noSync()
        .fetchRemoteOrLocal(refresh);
      this.loading = false;
      return;
    },
  };
  return store;
};

export type BlockedChannelsStore = ReturnType<
  typeof createBlockedChannelsStore
>;
export default createBlockedChannelsStore;
