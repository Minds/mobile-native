import type UserModel from '../UserModel';
import channelsService from '../../common/services/channels.service';
import FeedStore from '../../common/stores/FeedStore';

type InitialLoadParams = {
  entity?: { guid: string } | UserModel;
  guid?: string;
  username?: string;
};

type FilterType = 'all' | 'images' | 'videos' | 'blogs';

/**
 * Channel store generator
 */
const createChannelStore = () => {
  const feedsEndpoint = 'feeds/container';
  const scheduledEndpoint = 'feeds/scheduled';

  const store = {
    tab: 'feed' as 'feed' | 'shop' | 'about',
    channel: null as UserModel | null,
    loaded: false,
    filter: 'all' as FilterType,
    feedStore: new FeedStore(true),
    showScheduled: false,
    get esFeedfilter() {
      switch (this.filter) {
        case 'all':
          return 'activities';
        case 'images':
          return 'images';
        case 'videos':
          return 'videos';
        case 'blogs':
          return 'blogs';
      }
    },
    setTab(value: 'feed' | 'shop' | 'about') {
      this.tab = value;
    },
    get endpoint() {
      return this.showScheduled ? scheduledEndpoint : feedsEndpoint;
    },
    toggleScheduled() {
      this.showScheduled = !this.showScheduled;
    },
    /**
     * Initial load
     * @param params
     */
    initialLoad(params: InitialLoadParams) {
      if (params.guid || params.username) {
        //@ts-ignore
        this.loadFromGuidOrUsername(params.guid || params.username);
      } else if (params.entity) {
        this.loadFromEntity(params.entity);
      }
    },
    /**
     * Load selected feed
     * @param {boolean} refresh
     */
    async loadFeed(refresh = false) {
      if (refresh) {
        this.feedStore.clear();
      }
      if (!this.channel) {
        return;
      }

      this.feedStore
        .setEndpoint(
          `api/v2/${this.endpoint}/${this.channel.guid}/${this.esFeedfilter}`,
        )
        .setAsActivities(this.esFeedfilter !== 'blogs')
        .setLimit(12)
        .fetchRemoteOrLocal();

      return;
    },
    /**
     * Set filter and reload feed
     * @param filter
     */
    setFilter(filter: FilterType) {
      this.filter = filter;

      if (!this.channel) {
        return;
      }

      this.feedStore
        .setEndpoint(
          `api/v2/${this.endpoint}/${this.channel.guid}/${this.esFeedfilter}`,
        )
        .setIsTiled(filter === 'images' || filter === 'videos')
        .setAsActivities(this.esFeedfilter !== 'blogs')
        .clear()
        .fetchRemoteOrLocal();
    },
    /**
     * Set channel
     * @param channel
     */
    setChannel(channel: UserModel) {
      this.channel = channel;
      this.loaded = true;
    },
    /**
     * Load channel from existing entity
     * @param defaultChannel
     */
    async loadFromEntity(defaultChannel: { guid: string } | UserModel) {
      const channel = await channelsService.get(
        defaultChannel.guid,
        defaultChannel,
      );

      if (channel) {
        this.setChannel(channel);
        this.loadFeed();
        return channel;
      }
      return false;
    },
    /**
     * Load channel from guid or username
     * @param guidOrUsername
     */
    async loadFromGuidOrUsername(guidOrUsername: string) {
      const channel = await channelsService.get(guidOrUsername);
      this.setChannel(channel);
      this.loadFeed();
    },
  };
  return store;
};

export default createChannelStore;

export type ChannelStoreType = ReturnType<typeof createChannelStore>;
