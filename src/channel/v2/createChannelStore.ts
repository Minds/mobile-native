import { Platform } from 'react-native';
import moment from 'moment';

import UserModel from '../UserModel';
import FeedStore from '~/common/stores/FeedStore';
import type { SupportTiersType } from '~/wire/WireTypes';
import { showNotification } from '~/../AppMessages';
import { IS_IOS } from '~/config/Config';
import sp from '~/services/serviceProvider';

type Entity = { guid: string; nsfw?: Array<string> } | UserModel;
type InitialLoadParams = {
  entity?: Entity;
  guid?: string;
  username?: string;
};

export type ChannelTabType =
  | 'feed'
  | 'shop'
  | 'about'
  | 'groups'
  | 'memberships';

type FilterType = 'all' | 'images' | 'videos' | 'blogs';

type channelMediaType = 'avatar' | 'banner';

type payloadType = {
  briefdescription?: string;
  phoneNumber?: string;
  name?: string;
  city?: string;
  dob?: string;
};

/**
 * Channel store generator
 */
const createChannelStore = () => {
  const feedsEndpoint = 'feeds/container';
  const scheduledEndpoint = 'feeds/scheduled';
  const supportTiersService = sp.resolve('supportTiers');
  const store = {
    tab: 'feed' as ChannelTabType,
    channel: undefined as UserModel | undefined,
    loaded: false,
    tiers: <Array<SupportTiersType>>[],
    filter: 'all' as FilterType,
    range: <{ from: number; to: number } | null>null,
    feedStore: new FeedStore(true),
    showScheduled: false,
    uploading: false,
    bannerProgress: 0,
    avatarProgress: 0,
    channelSearch: '',
    avatarPath: '',
    clearDateRange() {
      this.range = null;
      this.filterChannelFeed();
    },
    setDateRange(from: Date, to: Date) {
      this.range = {
        from: moment.utc(from).startOf('day').valueOf(),
        to: moment.utc(to).endOf('day').valueOf(),
      };
      this.filterChannelFeed();
    },
    setChannelSearch(channelSearch: string) {
      this.channelSearch = channelSearch;
    },
    clearSearch() {
      this.channelSearch = '';
      this.feedStore.setParams({});
      this.loadFeed(true);
    },
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
    setTab(value: ChannelTabType) {
      this.tab = value;
    },
    get endpoint() {
      return this.showScheduled ? scheduledEndpoint : feedsEndpoint;
    },
    toggleScheduled() {
      this.showScheduled = !this.showScheduled;
      this.loadFeed(true);
    },
    /**
     * Initial load
     * @param params
     */
    async initialLoad(params: InitialLoadParams) {
      if (params.entity) {
        if (this.isNsfw(params.entity)) {
          sp.navigation.goBack();
          showNotification(sp.i18n.t('nsfw.notSafeChannel'));
        }
        await this.loadFromEntity(params.entity);
        this.tiers =
          (await supportTiersService.getAllFromGuid(params.entity.guid)) || [];
      } else if (params.guid || params.username) {
        //@ts-ignore
        await this.loadFromGuidOrUsername(params.guid || params.username);
      }
      this.channel?.sendViewed('single');
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
        .setAsActivities(false)
        .clear()
        .fetchRemoteOrLocal();
    },
    async filterChannelFeed() {
      this.feedStore.clear();

      if (!this.channel) {
        return;
      }

      const params: any = {
        period: 'all',
        all: 1,
        query: this.channelSearch,
        sync: 1,
        force_public: 1,
      };

      if (this.range) {
        params.to_timestamp = this.range.from;
        params.from_timestamp = this.range.to;
      }

      this.feedStore
        .setEndpoint(
          `api/v2/${this.endpoint}/${this.channel.guid}/${this.esFeedfilter}`,
        )
        .setAsActivities(this.esFeedfilter !== 'blogs')
        .setLimit(12)
        .setParams(params)
        .fetchRemoteOrLocal();

      return;
    },
    /**
     * Set channel
     * @param channel
     */
    setChannel(channel: UserModel) {
      this.channel = channel;
      if (!this.loaded) {
        this.loaded = true;
        this.feedStore.getScheduledCount(this.channel.guid);
        if (!this.channel.isOwner()) {
          this.feedStore.setInjectBoost(true);
          const channelBoostedContent = sp.resolve('channelBoostedContent', {
            guid: channel?.guid,
            source: 'feed/channel',
          });
          this.feedStore.feedsService.setBoostedContent(channelBoostedContent);
        }
      }
    },
    /**
     * Check and navigate back for banned channels
     * @param channel
     */
    checkBanned(channel: UserModel): boolean {
      if (channel.banned === 'yes') {
        showNotification(sp.i18n.t('channel.banned'), 'warning');
        sp.navigation.goBack();
        return true;
      }
      return false;
    },
    /**
     * Load channel from existing entity
     * @param defaultChannel
     */
    async loadFromEntity(
      defaultChannel: { guid: string } | UserModel,
      useChannel: boolean = false,
    ) {
      const channelsService = sp.resolve('channels');
      const channel =
        useChannel && defaultChannel instanceof UserModel
          ? await channelsService.getFromEntity(
              defaultChannel.guid,
              defaultChannel,
            )
          : await channelsService.get(defaultChannel.guid, defaultChannel);
      if (channel) {
        if (this.checkBanned(channel)) {
          return false;
        }
        this.setChannel(channel);
        if (!channel.blocked) {
          this.loadFeed();
        }
        return channel;
      }
      return false;
    },
    /**
     * Load channel from guid or username
     * @param guidOrUsername
     */
    async loadFromGuidOrUsername(guidOrUsername: string) {
      const channelsService = sp.resolve('channels');
      const channel = await channelsService.get(guidOrUsername);
      if (!channel) {
        this.loaded = true;
        return;
      }
      if (this.isNsfw(channel)) {
        sp.navigation.goBack();
        showNotification(sp.i18n.t('nsfw.notSafeChannel'));
      }
      if (this.checkBanned(channel)) {
        return false;
      }
      this.setChannel(channel);
      this.loadFeed();
      this.tiers =
        (await supportTiersService.getAllFromGuid(channel.guid)) || [];
    },
    async updateFromRemote(guidOrUsername: string) {
      const channelsService = sp.resolve('channels');
      const channel = await channelsService.get(
        guidOrUsername,
        undefined,
        true,
      );
      if (channel) {
        this.setChannel(channel);
        await sp.session.loadUser(channel);
      }
    },
    setIsUploading(uploading: boolean) {
      this.uploading = uploading;
    },
    /**
     * Set percent progress for either avatar or banner
     * @param progress
     * @param type
     */
    setProgress(progress: number, type: channelMediaType) {
      if (type === 'avatar') {
        this.avatarProgress = progress;
      } else {
        this.bannerProgress = progress;
      }
    },
    /**
     * Upload Banner or Avatar
     * @param file
     * @param mediaType
     * @param camera
     */
    async upload(
      type: channelMediaType,
      camera = false,
      onImageSelected?: (customImagePromise) => void,
    ) {
      const isBanner = type === 'banner';

      try {
        const response = camera
          ? await sp.resolve('imagePicker').launchCamera({
              type: 'Images',
              crop: !(IS_IOS && isBanner),
              front: true,
              aspect: isBanner ? [15, 6] : [1, 1],
            })
          : await sp.resolve('imagePicker').launchImageLibrary({
              type: 'Images',
              crop: !(IS_IOS && isBanner),
              aspect: isBanner ? [15, 6] : [1, 1],
            });

        const media = response ? response[0] : null;
        if (!media) {
          return false;
        }
        if (onImageSelected) {
          onImageSelected(media);
        }
        this.setIsUploading(true);
        this.setProgress(0, type);
        this.avatarPath = media.uri;
        await sp.resolve('channel').upload(
          type,
          {
            uri: media.uri,
            type: media.mime,
            name: media.fileName || `${type}.jpg`,
          },
          e => {
            this.setProgress(e.loaded / e.total, type);
          },
        );

        if (this.channel) {
          await this.updateFromRemote('me');
        }
        this.setProgress(0, type);
        this.setIsUploading(false);
      } catch (error) {
        this.setProgress(0, type);
        this.setIsUploading(false);
        this.avatarPath = '';
        throw error;
      }
    },
    /**
     * Save channel info
     */
    async save(payload: payloadType) {
      this.uploading = true;
      try {
        const result = await sp.resolve('channel').save(payload);
        const success = result && result.status === 'success';

        if (success && this.channel) {
          const channel = this.channel;
          channel.name = payload.name ?? this.channel.name;
          channel.briefdescription =
            payload.briefdescription ?? this.channel.briefdescription;
          channel.city = payload.city ?? this.channel.city;
          channel.dob = payload.dob ?? this.channel.dob;
          this.loadFromEntity(channel, true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.uploading = false;
      }
    },
    async getGroupCount() {
      if (this.channel) {
        const channelsService = sp.resolve('channels');
        return await channelsService.getGroupCount(this.channel);
      }
      return 0;
    },
    isNsfw(channel: Entity) {
      return (
        Platform.OS === 'ios' &&
        channel.nsfw &&
        channel.nsfw.length > 0 &&
        channel.guid !== sp.session.getUser().guid
      );
    },
  };

  store.feedStore.getMetadataService()?.setSource('feed/channel');
  return store;
};

export default createChannelStore;

export type ChannelStoreType = ReturnType<typeof createChannelStore>;
