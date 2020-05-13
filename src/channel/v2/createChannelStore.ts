import type UserModel from '../UserModel';
import channelsService from '../../common/services/channels.service';
import FeedStore from '../../common/stores/FeedStore';
import ChannelService from '../ChannelService';
import imagePickerService from '../../common/services/image-picker.service';
import type {
  CustomImage,
  customImagePromise,
} from '../../common/services/image-picker.service';
import sessionService from '../../common/services/session.service';

type InitialLoadParams = {
  entity?: { guid: string } | UserModel;
  guid?: string;
  username?: string;
};

export type ChannelTabType = 'feed' | 'shop' | 'about';

type FilterType = 'all' | 'images' | 'videos' | 'blogs';

type channelMediaType = 'avatar' | 'banner';

type payloadType = {
  briefdescription?: string;
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

  const store = {
    tab: 'feed' as ChannelTabType,
    channel: null as UserModel | null,
    loaded: false,
    filter: 'all' as FilterType,
    feedStore: new FeedStore(true),
    showScheduled: false,
    uploading: false,
    bannerProgress: 0,
    avatarProgress: 0,
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
    async updateFromRemote(guidOrUsername: string) {
      const channel = await channelsService.get(
        guidOrUsername,
        undefined,
        true,
      );
      this.setChannel(channel);
      await sessionService.loadUser(channel);
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
     */
    async upload(type: channelMediaType) {
      if (!this.channel) {
        return;
      }

      try {
        imagePickerService
          .show('', 'photo', type === 'avatar')
          .then(async (response: customImagePromise) => {
            let file: CustomImage;
            if (response !== false && !Array.isArray(response)) {
              file = response;
            } else {
              return false;
            }
            this.setIsUploading(true);
            this.setProgress(0, type);
            await ChannelService.upload(
              null,
              type,
              {
                uri: file.uri,
                type: file.type,
                name: file.filename || `${type}.jpg`,
              },
              (e) => {
                this.setProgress(e.loaded / e.total, type);
              },
            );

            if (this.channel) {
              await this.updateFromRemote('me');
            }
            this.setProgress(0, type);
            this.setIsUploading(false);
          })
          .catch((err) => {
            throw err;
          });
      } catch (error) {
        this.setProgress(0, type);
        this.setIsUploading(false);
        throw error;
      }
    },
    /**
     * Save channel info
     */
    async save(payload: payloadType) {
      const result = await ChannelService.save(payload);
      const success = result && result.status === 'success';

      if (success && this.channel) {
        const channel = this.channel;
        channel.name = payload.name ?? this.channel.name;
        channel.briefdescription =
          payload.briefdescription ?? this.channel.briefdescription;
        channel.city = payload.city ?? this.channel.city;
        channel.dob = payload.dob ?? this.channel.dob;
        this.loadFromEntity(channel);
      }
    },
  };
  return store;
};

export default createChannelStore;

export type ChannelStoreType = ReturnType<typeof createChannelStore>;
