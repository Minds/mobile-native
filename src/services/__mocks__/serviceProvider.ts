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
import { ThemedStyles } from '~/styles/ThemedStyles';

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
      return mockedStorages;
    case 'styles':
      sp.register('styles', () => styles, Lifetime.Singleton);
      return styles;
    case 'log':
      const LogService = require('~/common/services/log.service').LogService;
      const mockLog = new LogService() as jest.Mocked<LogService>;
      sp.register('log', () => mockLog, Lifetime.Singleton);
      return mockLog;
    case 'navigation':
      const NavigationService =
        require('~/navigation/NavigationService').NavigationService;
      const mockNav = new NavigationService() as jest.Mocked<NavigationService>;
      sp.register('navigation', () => mockNav, Lifetime.Singleton);
      return mockNav;
    case 'i18n':
      const I18nService = require('~/common/services/i18n.service').I18nService;
      const i18n = new I18nService() as jest.Mocked<I18nService>;
      sp.register('i18n', () => i18n, Lifetime.Singleton);
      i18n.setLocale('en', false);
      return i18n;
    case 'analytics':
      const AnalyticsService =
        require('~/common/services/analytics.service').AnalyticsService;
      const analytics = new AnalyticsService() as jest.Mocked<AnalyticsService>;
      sp.register('analytics', () => analytics, Lifetime.Singleton);
      return analytics;
    case 'settings':
      const SettingsService =
        require('~/settings/SettingsService').SettingsService;
      const settings = new SettingsService() as jest.Mocked<SettingsService>;
      sp.register('settings', () => settings, Lifetime.Singleton);
      return settings;
    case 'config':
      const MindsConfigService =
        require('~/common/services/minds-config.service').MindsConfigService;
      const config =
        new MindsConfigService() as jest.Mocked<MindsConfigService>;
      sp.register('config', () => config, Lifetime.Singleton);
      return config;
    case 'permissions':
      const PermissionsService =
        require('~/common/services/permissions.service').PermissionsService;
      const permissions =
        new PermissionsService() as jest.Mocked<PermissionsService>;
      sp.register('permissions', () => permissions, Lifetime.Singleton);
      return permissions;
    case 'metadata':
      const MetadataService =
        require('~/common/services/metadata.service').MetadataService;
      const metadata = new MetadataService() as jest.Mocked<MetadataService>;
      metadata.setMedium.mockReturnThis();
      metadata.setSource.mockReturnThis();
      metadata.setCampaign.mockReturnThis();
      sp.register('metadata', () => metadata, Lifetime.Singleton);
      return metadata;
    case 'hashtag':
      const HashtagService =
        require('~/common/services/hashtag.service').HashtagService;
      const hashtag = new HashtagService() as jest.Mocked<HashtagService>;
      sp.register('hashtag', () => hashtag, Lifetime.Singleton);
      return hashtag;
    case 'feed':
      const FeedsService =
        require('~/common/services/feeds.service').FeedsService;
      const feeds = new FeedsService() as jest.Mocked<FeedsService>;
      sp.register('feed', () => feeds, Lifetime.Scoped);
      return feeds;
    case 'entities':
      const EntitiesService =
        require('~/common/services/entities.service').EntitiesService;
      const entities = new EntitiesService() as jest.Mocked<EntitiesService>;
      sp.register('entities', () => entities, Lifetime.Singleton);
      return entities;
    case 'newsfeed':
      const NewsfeedService =
        require('~/newsfeed/NewsfeedService').NewsfeedService;
      const newsfeed = new NewsfeedService() as jest.Mocked<NewsfeedService>;
      sp.register('newsfeed', () => newsfeed, Lifetime.Singleton);
      return newsfeed;
    case 'supportTiers':
      const SupportTiersService =
        require('~/common/services/support-tiers.service').SupportTiersService;
      const supportTiers =
        new SupportTiersService() as jest.Mocked<SupportTiersService>;
      sp.register('supportTiers', () => supportTiers, Lifetime.Singleton);
      return supportTiers;
    case 'attachment':
      const AttachmentService =
        require('~/common/services/attachment.service').AttachmentService;
      const attachment =
        new AttachmentService() as jest.Mocked<AttachmentService>;
      sp.register('attachment', () => attachment, Lifetime.Singleton);
      return;
    case 'richEmbed':
      const RichEmbedService =
        require('~/common/services/rich-embed.service').RichEmbedService;
      const richEmbed = new RichEmbedService() as jest.Mocked<RichEmbedService>;
      sp.register('richEmbed', () => richEmbed, Lifetime.Singleton);
      return richEmbed;
    case 'settingsApi':
      const SettingsApiService =
        require('~/settings/SettingsApiService').SettingsApiService;
      const settingsApi =
        new SettingsApiService() as jest.Mocked<SettingsApiService>;
      sp.register('settingsApi', () => settingsApi, Lifetime.Singleton);
      return settingsApi;
    case 'inFeedNotices':
      const InFeedNoticesService =
        require('~/common/services/in-feed.notices.service').InFeedNoticesService;
      const inFeedNotices =
        new InFeedNoticesService() as jest.Mocked<InFeedNoticesService>;
      sp.register('inFeedNotices', () => inFeedNotices, Lifetime.Singleton);
      return inFeedNotices;
    case 'translation':
      const TranslationService =
        require('~/common/services/translation.service').TranslationService;
      const translation =
        new TranslationService() as jest.Mocked<TranslationService>;
      sp.register('translation', () => translation, Lifetime.Singleton);
      return;
    case 'openURL':
      const OpenURLService =
        require('~/common/services/open-url.service').OpenURLService;
      const openURL = new OpenURLService() as jest.Mocked<OpenURLService>;
      sp.register('openURL', () => openURL, Lifetime.Singleton);
      return openURL;
  }
  throw new Error(`Service not found: ${service}`);
};

sp.mockService('styles');

export default sp;
