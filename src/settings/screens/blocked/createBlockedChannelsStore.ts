import MetadataService from '~/common/services/metadata.service';
import FeedStore from '../../../common/stores/FeedStore';

const createBlockedChannelsStore = () => {
  const store = {
    feedStore: new FeedStore()
      .setEndpoint('api/v1/block')
      .setAsActivities(false)
      .setLimit(12)
      .setMetadata(new MetadataService()),
    async loadList(refresh = false) {
      if (refresh) {
        this.feedStore.clear();
      }

      this.feedStore.noSync().fetchRemoteOrLocal(refresh);

      return;
    },
  };
  return store;
};

export type BlockedChannelsStore = ReturnType<
  typeof createBlockedChannelsStore
>;
export default createBlockedChannelsStore;
