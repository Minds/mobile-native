import type { ApiService } from '~/common/services/api.service';
import type { LogService } from '~/common/services/log.service';
import type { SessionService } from '~/common/services/session.service';
import type { Storages } from '~/common/services/storage/storages.service';
import type { NavigationService } from '~/navigation/NavigationService';
import type { Services } from '../serviceProvider';
import type { I18nService } from '~/common/services/i18n.service';
import type { AnalyticsService } from '~/common/services/analytics.service';
import type { SettingsService } from '~/settings/SettingsService';
import type { MindsConfigService } from '~/common/services/minds-config.service';
import type { PermissionsService } from '~/common/services/permissions.service';
import type { MetadataService } from '~/common/services/metadata.service';
import type { HashtagService } from '~/common/services/hashtag.service';
import type { FeedsService } from '~/common/services/feeds.service';
import type { EntitiesService } from '~/common/services/entities.service';
import type { NewsfeedService } from '~/newsfeed/NewsfeedService';
import type { SupportTiersService } from '~/common/services/support-tiers.service';
import type { AttachmentService } from '~/common/services/attachment.service';
import type { RichEmbedService } from '~/common/services/rich-embed.service';
import type { SettingsApiService } from '~/settings/SettingsApiService';
import type { InFeedNoticesService } from '~/common/services/in-feed.notices.service';
import type { TranslationService } from '~/common/services/translation.service';
import type { OpenURLService } from '~/common/services/open-url.service';
import type { AuthService } from '~/auth/AuthService';
import type { ChannelService } from '~/channel/ChannelService';
import type { ConnectivityService } from '~/common/services/connectivity.service';
import type { UpdateService } from '~/common/services/update.service';
import type { VideoPlayerService } from '~/common/services/video-player.service';
import type { WireService } from '~/wire/WireService';
import type { BlogsService } from '~/blogs/BlogsService';

import { ThemedStyles } from '~/styles/ThemedStyles';
import { ImagePickerService } from '../../common/services/image-picker.service';

const { Lifetime } = require('../injectionContainer');

const sp = jest.requireActual('~/services/serviceProvider').default;

jest.mock('~/common/services/api.service');
jest.mock('~/common/services/session.service');
jest.mock('~/common/services/storage/storages.service');
jest.mock('~/common/services/log.service');
jest.mock('~/common/services/analytics.service');
jest.mock('~/navigation/NavigationService');
jest.mock('~/common/services/minds-config.service');
jest.mock('~/settings/SettingsService');
jest.mock('~/common/services/permissions.service');
jest.mock('~/common/services/metadata.service');
jest.mock('~/common/services/hashtag.service');
jest.mock('~/common/services/feeds.service');
jest.mock('~/common/services/entities.service');
jest.mock('~/newsfeed/NewsfeedService');
jest.mock('~/common/services/support-tiers.service');
jest.mock('~/common/services/attachment.service');
jest.mock('~/common/services/rich-embed.service');
jest.mock('~/settings/SettingsApiService');
jest.mock('~/common/services/in-feed.notices.service');
jest.mock('~/common/services/translation.service');
jest.mock('~/common/services/open-url.service');
jest.mock('~/auth/AuthService');
jest.mock('~/channel/ChannelService');
jest.mock('~/common/services/connectivity.service');
jest.mock('~/common/services/update.service');
jest.mock('~/common/services/video-player.service');
jest.mock('~/wire/WireService');
jest.mock('~/blogs/BlogsService');

const styles = new ThemedStyles(1);

sp.mockService = <K extends keyof Services>(
  service: K,
): jest.Mocked<Services[K]> => {
  switch (service) {
    case 'api':
      const ApiService = require('~/common/services/api.service').ApiService;
      const mockedApi = new ApiService() as jest.Mocked<ApiService>;
      sp.register(
        'api',
        () => {
          return mockedApi;
        },
        Lifetime.Singleton,
      );
      // @ts-ignore
      return mockedApi;

    case 'session':
      const SessionService =
        require('~/common/services/session.service').SessionService;
      const mockedSession = new SessionService() as jest.Mocked<SessionService>;
      sp.register(
        'session',
        () => {
          return mockedSession;
        },
        Lifetime.Singleton,
      );
      // @ts-ignore
      return mockedSession;
    case 'storages':
      const StoragesService =
        require('~/common/services/storage/storages.service').Storages;
      const mockedStorages = new StoragesService() as jest.Mocked<Storages>;

      sp.register(
        'storages',
        () => {
          return mockedStorages;
        },
        Lifetime.Singleton,
      );
      // @ts-ignore
      return mockedStorages;
    case 'styles':
      sp.register('styles', () => styles, Lifetime.Singleton);
      // @ts-ignore
      return styles;
    case 'log':
      const LogService = require('~/common/services/log.service').LogService;
      const mockLog = new LogService() as jest.Mocked<LogService>;
      sp.register('log', () => mockLog, Lifetime.Singleton);
      // @ts-ignore
      return mockLog;
    case 'navigation':
      const NavigationService =
        require('~/navigation/NavigationService').NavigationService;
      const mockNav = new NavigationService() as jest.Mocked<NavigationService>;
      sp.register('navigation', () => mockNav, Lifetime.Singleton);
      // @ts-ignore
      return mockNav;
    case 'i18n':
      const I18nService = require('~/common/services/i18n.service').I18nService;
      const i18n = new I18nService() as jest.Mocked<I18nService>;
      sp.register('i18n', () => i18n, Lifetime.Singleton);
      i18n.setLocale('en', false);
      // @ts-ignore
      return i18n;
    case 'analytics':
      const AnalyticsService =
        require('~/common/services/analytics.service').AnalyticsService;
      const analytics = new AnalyticsService() as jest.Mocked<AnalyticsService>;
      sp.register('analytics', () => analytics, Lifetime.Singleton);
      // @ts-ignore
      return analytics;
    case 'settings':
      const SettingsService =
        require('~/settings/SettingsService').SettingsService;
      const settings = new SettingsService() as jest.Mocked<SettingsService>;
      sp.register('settings', () => settings, Lifetime.Singleton);
      // @ts-ignore
      return settings;
    case 'config':
      const MindsConfigService =
        require('~/common/services/minds-config.service').MindsConfigService;
      const config =
        new MindsConfigService() as jest.Mocked<MindsConfigService>;
      sp.register('config', () => config, Lifetime.Singleton);
      // @ts-ignore
      return config;
    case 'permissions':
      const PermissionsService =
        require('~/common/services/permissions.service').PermissionsService;
      const permissions =
        new PermissionsService() as jest.Mocked<PermissionsService>;
      sp.register('permissions', () => permissions, Lifetime.Singleton);
      // @ts-ignore
      return permissions;
    case 'metadata':
      const MetadataService =
        require('~/common/services/metadata.service').MetadataService;
      const metadata = new MetadataService() as jest.Mocked<MetadataService>;
      metadata.setMedium.mockReturnThis();
      metadata.setSource.mockReturnThis();
      metadata.setCampaign.mockReturnThis();
      sp.register('metadata', () => metadata, Lifetime.Singleton);
      // @ts-ignore
      return metadata;
    case 'hashtag':
      const HashtagService =
        require('~/common/services/hashtag.service').HashtagService;
      const hashtag = new HashtagService() as jest.Mocked<HashtagService>;
      sp.register('hashtag', () => hashtag, Lifetime.Singleton);
      // @ts-ignore
      return hashtag;
    case 'feed':
      const FeedsService =
        require('~/common/services/feeds.service').FeedsService;
      const feeds = new FeedsService() as jest.Mocked<FeedsService>;
      sp.register('feed', () => feeds, Lifetime.Scoped);
      // @ts-ignore
      return feeds;
    case 'entities':
      const EntitiesService =
        require('~/common/services/entities.service').EntitiesService;
      const entities = new EntitiesService() as jest.Mocked<EntitiesService>;
      sp.register('entities', () => entities, Lifetime.Singleton);
      // @ts-ignore
      return entities;
    case 'newsfeed':
      const NewsfeedService =
        require('~/newsfeed/NewsfeedService').NewsfeedService;
      const newsfeed = new NewsfeedService() as jest.Mocked<NewsfeedService>;
      sp.register('newsfeed', () => newsfeed, Lifetime.Singleton);
      // @ts-ignore
      return newsfeed;
    case 'supportTiers':
      const SupportTiersService =
        require('~/common/services/support-tiers.service').SupportTiersService;
      const supportTiers =
        new SupportTiersService() as jest.Mocked<SupportTiersService>;
      sp.register('supportTiers', () => supportTiers, Lifetime.Singleton);
      // @ts-ignore
      return supportTiers;
    case 'attachment':
      const AttachmentService =
        require('~/common/services/attachment.service').AttachmentService;
      const attachment =
        new AttachmentService() as jest.Mocked<AttachmentService>;
      sp.register('attachment', () => attachment, Lifetime.Singleton);
      // @ts-ignore
      return;
    case 'richEmbed':
      const RichEmbedService =
        require('~/common/services/rich-embed.service').RichEmbedService;
      const richEmbed = new RichEmbedService() as jest.Mocked<RichEmbedService>;
      sp.register('richEmbed', () => richEmbed, Lifetime.Singleton);
      // @ts-ignore
      return richEmbed;
    case 'settingsApi':
      const SettingsApiService =
        require('~/settings/SettingsApiService').SettingsApiService;
      const settingsApi =
        new SettingsApiService() as jest.Mocked<SettingsApiService>;
      sp.register('settingsApi', () => settingsApi, Lifetime.Singleton);
      // @ts-ignore
      return settingsApi;
    case 'inFeedNotices':
      const InFeedNoticesService =
        require('~/common/services/in-feed.notices.service').InFeedNoticesService;
      const inFeedNotices =
        new InFeedNoticesService() as jest.Mocked<InFeedNoticesService>;
      sp.register('inFeedNotices', () => inFeedNotices, Lifetime.Singleton);
      // @ts-ignore
      return inFeedNotices;
    case 'translation':
      const TranslationService =
        require('~/common/services/translation.service').TranslationService;
      const translation =
        new TranslationService() as jest.Mocked<TranslationService>;
      sp.register('translation', () => translation, Lifetime.Singleton);
      // @ts-ignore
      return;
    case 'openURL':
      const OpenURLService =
        require('~/common/services/open-url.service').OpenURLService;
      const openURL = new OpenURLService() as jest.Mocked<OpenURLService>;
      sp.register('openURL', () => openURL, Lifetime.Singleton);
      // @ts-ignore
      return openURL;
    case 'auth':
      const AuthService = require('~/auth/AuthService').AuthService;
      const auth = new AuthService() as jest.Mocked<AuthService>;
      sp.register('auth', () => auth, Lifetime.Singleton);
      // @ts-ignore
      return auth;
    case 'channel':
      const ChannelService = require('~/channel/ChannelService').ChannelService;
      const channel = new ChannelService() as jest.Mocked<ChannelService>;
      sp.register('channel', () => channel, Lifetime.Singleton);
      // @ts-ignore
      return channel;
    case 'connectivity':
      const ConnectivityService =
        require('~/common/services/connectivity.service').ConnectivityService;
      const connectivity =
        new ConnectivityService() as jest.Mocked<ConnectivityService>;
      sp.register('connectivity', () => connectivity, Lifetime.Singleton);
      // @ts-ignore
      return connectivity;
    case 'update':
      const UpdateService =
        require('~/common/services/update.service').UpdateService;
      const update = new UpdateService() as jest.Mocked<UpdateService>;
      sp.register('update', () => update, Lifetime.Singleton);
      // @ts-ignore
      return update;
    case 'videoPlayer':
      const VideoPlayerService =
        require('~/common/services/video-player.service').VideoPlayerService;
      const videoPlayer =
        new VideoPlayerService() as jest.Mocked<VideoPlayerService>;
      sp.register('videoPlayer', () => videoPlayer, Lifetime.Singleton);
      // @ts-ignore
      return videoPlayer;
    case 'wire':
      const WireService = require('~/wire/WireService').WireService;
      const wire = new WireService() as jest.Mocked<WireService>;
      sp.register('wire', () => wire, Lifetime.Singleton);
      // @ts-ignore
      return wire;
    case 'blogs':
      const BlogsService = require('~/blogs/BlogsService').BlogsService;
      const blogs = new BlogsService() as jest.Mocked<BlogsService>;
      sp.register('blogs', () => blogs, Lifetime.Singleton);
      // @ts-ignore
      return blogs;
    case 'imagePicker':
      const ImagePickerService =
        require('~/common/services/image-picker.service').ImagePickerService;
      const imagePicker =
        new ImagePickerService() as jest.Mocked<ImagePickerService>;
      sp.register('imagePicker', () => imagePicker, Lifetime.Singleton);
      // @ts-ignore
      return imagePicker;
  }
  throw new Error(`Service not found: ${service}`);
};

sp.mockService('styles');

export default sp;
