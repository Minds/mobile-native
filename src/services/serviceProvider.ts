import { InjectionContainer, Lifetime } from './injectionContainer';
import { Storages } from '~/common/services/storage/storages.service';
import { LogService } from '~/common/services/log.service';
import { NavigationService } from '~/navigation/NavigationService';
import { ConnectivityService } from '~/common/services/connectivity.service';
import { ThemedStyles } from '~/styles/ThemedStyles';

import type { DevModeService } from '~/config/DevModeService';
import type { ApiService } from '~/common/services/api.service';
import type { SessionStorageService } from '~/common/services/storage/session.storage.service';
import type { SessionService } from '~/common/services/session.service';
import type { SocketService } from '~/common/services/socket.service';
import type { I18nService } from '~/common/services/i18n.service';
import type { MindsConfigService } from '~/common/services/minds-config.service';
import type { UpdateService } from '~/common/services/update.service';
import type { BoostedContentService } from '~/modules/boost/services/boosted-content.service';
import type { StoreRatingService } from '~/modules/store-rating';

import type { AuthService } from '~/auth/AuthService';
import type { WireService } from '~/wire/WireService';
import type { AttachmentService } from '~/common/services/attachment.service';
import type { BlockListService } from '~/common/services/block-list.service';
import type { SettingsService } from '~/settings/SettingsService';
import type { ChannelsService } from '~/common/services/channels.service';
import type { AnalyticsService } from '~/common/services/analytics.service';
import type { SearchBarService } from '~/topbar/searchbar/SearchBar.service';
import type { InFeedNoticesService } from '~/common/services/in-feed.notices.service';
import type { PushService } from '~/common/services/push.service';
import type { VideoPlayerService } from '~/common/services/video-player.service';
import type { OpenURLService } from '~/common/services/open-url.service';
import type { ReferrerService } from '~/common/services/referrer.service';
import type { DeepLinksRouterService } from '~/common/services/deeplinks-router.service';
import type { NewsfeedService } from '~/newsfeed/NewsfeedService';
import type { BlogsService } from '~/blogs/BlogsService';
import type { PermissionsService } from '~/common/services/permissions.service';
import type { CommentStorageService } from '~/comments/CommentStorageService';
import type { WalletService } from '~/wallet/WalletService';
import type { DownloadService } from '~/common/services/download.service';
import type { FeedsService } from '~/common/services/feeds.service';
import type { EntitiesStorage } from '~/common/services/storage/entities.storage';
import type { EntitiesService } from '~/common/services/entities.service';
import type { MetadataService } from '~/common/services/metadata.service';
import type { PaymentService } from '~/common/services/payment.service';
import type { RichEmbedService } from '~/common/services/rich-embed.service';
import type { SettingsApiService } from '~/settings/SettingsApiService';
import type { HashtagService } from '~/common/services/hashtag.service';
import type { SupportTiersService } from '~/common/services/support-tiers.service';
import type { TranslationService } from '~/common/services/translation.service';
import type { SubscriptionProService } from '~/common/services/subscription.pro.service';
import type { TwoFactorAuthenticationService } from '~/common/services/two-factor-authentication.service';
import type { ShareService } from '~/share/ShareService';
import type { PortraitContentService } from '~/portrait/portrait-content.service';
import type { ReportService } from '~/report/ReportService';
import type { ChannelService } from '~/channel/ChannelService';
import type { GroupsService } from '~/groups/GroupsService';

// service provider
const sp = new InjectionContainer<Services>();
// navigation
sp.register(
  'navigation',
  () => {
    return new NavigationService();
  },
  Lifetime.Singleton,
);

// storages
sp.register('storages', () => new Storages(), Lifetime.Singleton);

// themed styles
sp.register(
  'styles',
  () => {
    const theme = sp.resolve('storages').app.getNumber('theme');
    return new ThemedStyles(theme as 0 | 1);
  },
  Lifetime.Singleton,
);

// i18n
sp.register(
  'i18n',
  () => {
    const Service = require('~/common/services/i18n.service')
      .I18nService as typeof I18nService;
    return new Service(sp.resolve('storages'));
  },
  Lifetime.Singleton,
);

// log
sp.register(
  'log',
  () => {
    return new LogService();
  },
  Lifetime.Singleton,
);

// settings
sp.register(
  'settings',
  () => {
    const Service = require('~/settings/SettingsService')
      .SettingsService as typeof SettingsService;

    return new Service(sp.resolve('storages'), sp.resolve('connectivity'));
  },
  Lifetime.Singleton,
);

// session storage
sp.register(
  'sessionStorage',
  () => {
    const Service = require('~/common/services/storage/session.storage.service')
      .SessionStorageService as typeof SessionStorageService;
    return new Service(sp.resolve('storages'), sp.resolve('log'));
  },
  Lifetime.Singleton,
);

// session service
sp.register(
  'session',
  () => {
    const Service = require('~/common/services/session.service')
      .SessionService as typeof SessionService;
    return new Service(
      sp.resolve('sessionStorage'),
      sp.resolveLazy('analytics'),
      sp.resolve('storages'),
      sp.resolve('log'),
      sp.resolve('settings'),
      sp.resolveLazy('auth'),
    );
  },
  Lifetime.Singleton,
);

// connectivity service
sp.register(
  'connectivity',
  () => {
    return new ConnectivityService();
  },
  Lifetime.Singleton,
);

// dev mode service
sp.register(
  'devMode',
  () => {
    const Service = require('~/config/DevModeService')
      .DevModeService as typeof DevModeService;
    return new Service(sp.resolve('storages'));
  },
  Lifetime.Singleton,
);

// socket service
sp.register(
  'socket',
  () => {
    const Service = require('~/common/services/socket.service')
      .SocketService as typeof SocketService;
    return new Service(sp.resolve('session'), sp.resolve('log'));
  },
  Lifetime.Singleton,
);

// api service
sp.register(
  'api',
  () => {
    const Service = require('~/common/services/api.service')
      .ApiService as typeof ApiService;
    return new Service(
      sp.resolve('devMode'),
      sp.resolve('session'),
      sp.resolve('log'),
      sp.resolveLazy('auth'), // only used for re-login, we avoid circular dependencies and save resources by loading it lazily
      sp.resolve('navigation'),
      sp.resolve('i18n'),
      sp.resolve('referrer'),
    );
  },
  Lifetime.Singleton,
);

// api service for non active session
sp.register(
  'apiNoActiveSession',
  (index: number) => {
    const Service = require('~/common/services/api.service')
      .ApiService as typeof ApiService;
    return new Service(
      sp.resolve('devMode'),
      sp.resolve('session'),
      sp.resolve('log'),
      sp.resolveLazy('auth'), // only used for re-login, we avoid circular dependencies and save resources by loading it lazily
      sp.resolve('navigation'),
      sp.resolve('i18n'),
      sp.resolve('referrer'),
      index,
    );
  },

  Lifetime.Scoped,
);

// minds config
sp.register(
  'config',
  () => {
    const Service = require('~/common/services/minds-config.service')
      .MindsConfigService as typeof MindsConfigService;
    return new Service(sp.resolve('api'), sp.resolve('storages'));
  },
  Lifetime.Singleton,
);

// permissions
sp.register(
  'permissions',
  () => {
    const Service = require('~/common/services/permissions.service')
      .PermissionsService as typeof PermissionsService;
    return new Service(sp.resolve('i18n'), sp.resolve('config'));
  },
  Lifetime.Singleton,
);

// translation
sp.register(
  'translation',
  () => {
    const Service = require('~/common/services/translation.service')
      .TranslationService as typeof TranslationService;
    return new Service(
      sp.resolve('storages'),
      sp.resolve('api'),
      sp.resolve('log'),
    );
  },
  Lifetime.Singleton,
);

// auth
sp.register(
  'auth',
  () => {
    const Service = require('~/auth/AuthService')
      .AuthService as typeof AuthService;

    return new Service(
      sp.resolve('api'),
      sp.resolve('log'),
      sp.resolve('session'),
      sp.resolve('navigation'),
    );
  },
  Lifetime.Singleton,
);

// download service
sp.register(
  'download',
  () => {
    const Service = require('~/common/services/download.service')
      .DownloadService as typeof DownloadService;
    return new Service(sp.resolve('i18n'));
  },
  Lifetime.Singleton,
);
// update
sp.register(
  'update',
  () => {
    const Service = require('~/common/services/update.service')
      .UpdateService as typeof UpdateService;
    return new Service(
      sp.resolve('storages'),
      sp.resolve('navigation'),
      sp.resolve('log'),
      sp.resolve('i18n'),
    );
  },
  Lifetime.Singleton,
);

//
// wire service
sp.register(
  'wire',
  () => {
    const Service = require('~/wire/WireService')
      .WireService as typeof WireService;
    return new Service(sp.resolve('api'));
  },
  Lifetime.Singleton,
);

// attachment service
sp.register(
  'attachment',
  () => {
    const Service = require('~/common/services/attachment.service')
      .AttachmentService as typeof AttachmentService;
    return new Service(
      sp.resolve('api'),
      sp.resolve('log'),
      sp.resolve('permissions'),
      sp.resolve('i18n'),
    );
  },
  Lifetime.Singleton,
);

// store ranking
sp.register(
  'storeRating',
  () => {
    const Service = require('~/modules/store-rating')
      .StoreRatingService as typeof StoreRatingService;
    return new Service(sp.resolve('storages'), sp.resolve('openURL'));
  },
  Lifetime.Singleton,
);

// block list service
sp.register(
  'blockList',
  () => {
    const Service = require('~/common/services/block-list.service')
      .BlockListService as typeof BlockListService;
    return new Service(
      sp.resolve('api'),
      sp.resolve('storages'),
      sp.resolve('log'),
      sp.resolve('session'),
    );
  },
  Lifetime.Singleton,
);

// channels service
sp.register(
  'channels',
  () => {
    const Service = require('~/common/services/channels.service')
      .ChannelsService as typeof ChannelsService;
    return new Service(sp.resolve('api'), sp.resolve('entitiesStorage'));
  },
  Lifetime.Singleton,
);

// analytics service
sp.register(
  'analytics',
  () => {
    const Service = require('~/common/services/analytics.service')
      .AnalyticsService as typeof AnalyticsService;
    return new Service(
      sp.resolve('session'),
      sp.resolve('storages'),
      sp.resolve('config'),
    );
  },
  Lifetime.Singleton,
);

// search bar service
sp.register('searchBar', () => {
  const Service = require('~/topbar/searchbar/SearchBar.service.tsx')
    .SearchService as typeof SearchBarService;
  return new Service(sp.resolve('api'), sp.resolve('storages'));
});

// comments storage
sp.register(
  'commentsStorage',
  () => {
    const Service = require('~/comments/CommentStorageService')
      .CommentStorageService as typeof CommentStorageService;
    return new Service(sp.resolve('storages'), sp.resolve('log'));
  },
  Lifetime.Singleton,
);

// in feed notices service
sp.register(
  'inFeedNotices',
  () => {
    const Service = require('~/common/services/in-feed.notices.service')
      .InFeedNoticesService as typeof InFeedNoticesService;
    return new Service(
      sp.resolve('session'),
      sp.resolve('log'),
      sp.resolve('storages'),
      sp.resolve('api'),
      sp.resolve('analytics'),
    );
  },
  Lifetime.Singleton,
);

// push service
sp.register(
  'push',
  () => {
    const Service = require('~/common/services/push.service')
      .PushService as typeof PushService;
    return new Service(
      sp.resolve('api'),
      sp.resolve('analytics'),
      sp.resolve('log'),
    );
  },
  Lifetime.Singleton,
);

// video player service
sp.register(
  'videoPlayer',
  () => {
    const Service = require('~/common/services/video-player.service')
      .VideoPlayerService as typeof VideoPlayerService;
    return new Service(sp.resolve('storages'));
  },
  Lifetime.Singleton,
);

// open url
sp.register(
  'openURL',
  () => {
    const Service = require('~/common/services/open-url.service')
      .OpenURLService as typeof OpenURLService;
    return new Service(
      sp.resolve('storages'),
      sp.resolve('navigation'),
      sp.resolve('deepLinks'),
    );
  },
  Lifetime.Singleton,
);

// referrer
sp.register(
  'referrer',
  () => {
    const Service = require('~/common/services/referrer.service')
      .ReferrerService as typeof ReferrerService;
    return new Service(sp.resolve('storages'));
  },
  Lifetime.Scoped,
);

// deep links router
sp.register(
  'deepLinks',
  () => {
    const Service = require('~/common/services/deeplinks-router.service')
      .DeepLinksRouterService as typeof DeepLinksRouterService;
    return new Service(
      sp.resolve('navigation'),
      sp.resolve('analytics'),
      sp.resolve('api'),
      sp.resolve('referrer'),
    );
  },
  Lifetime.Singleton,
);

// newsfeed service
sp.register(
  'newsfeed',
  () => {
    const Service = require('~/newsfeed/NewsfeedService')
      .NewsfeedService as typeof NewsfeedService;
    return new Service(
      sp.resolve('api'),
      sp.resolve('analytics'),
      sp.resolve('log'),
      sp.resolve('connectivity'),
      sp.resolve('storeRating'),
    );
  },
  Lifetime.Singleton,
);

// blogs
sp.register(
  'blogs',
  () => {
    const Service = require('~/blogs/BlogsService')
      .BlogsService as typeof BlogsService;
    return new Service(sp.resolve('api'));
  },
  Lifetime.Scoped,
);

// entities service
sp.register(
  'entities',
  () => {
    const Service = require('~/common/services/entities.service')
      .EntitiesService as typeof EntitiesService;
    return new Service(sp.resolve('api'), sp.resolve('entitiesStorage'));
  },
  Lifetime.Singleton,
);

// wallet
sp.register(
  'wallet',
  () => {
    const Service = require('~/wallet/WalletService')
      .WalletService as typeof WalletService;
    return new Service(sp.resolve('api'));
  },
  Lifetime.Singleton,
);

// entities storage EntitiesStorage
sp.register(
  'entitiesStorage',
  () => {
    const Service = require('~/common/services/storage/entities.storage')
      .EntitiesStorage as typeof EntitiesStorage;
    return new Service(
      sp.resolve('session'),
      sp.resolve('storages'),
      sp.resolve('log'),
    );
  },
  Lifetime.Singleton,
);

// feed service
sp.register(
  'feed',
  () => {
    const Service = require('~/common/services/feeds.service')
      .FeedsService as typeof FeedsService;
    return new Service(
      sp.resolve('api'),
      sp.resolve('log'),
      sp.resolve('session'),
      sp.resolve('entities'),
      sp.resolve('storages'),
      sp.resolveLazy('boostedContent'),
    );
  },
  Lifetime.Scoped,
);

// metadata service
sp.register(
  'metadata',
  () => {
    const Service = require('~/common/services/metadata.service')
      .MetadataService as typeof MetadataService;
    return new Service(sp.resolve('session'), sp.resolve('navigation'));
  },
  Lifetime.Scoped,
);

// payment service
sp.register(
  'payment',
  () => {
    const Service = require('~/common/services/payment.service')
      .PaymentService as typeof PaymentService;
    return new Service(sp.resolve('api'));
  },
  Lifetime.Scoped,
);

// rich embed service
sp.register(
  'richEmbed',
  () => {
    const Service = require('~/common/services/rich-embed.service')
      .RichEmbedService as typeof RichEmbedService;
    return new Service(sp.resolve('api'));
  },
  Lifetime.Scoped,
);

// hashtag
sp.register(
  'hashtag',
  () => {
    const Service = require('~/common/services/hashtag.service')
      .HashtagService as typeof HashtagService;
    return new Service(sp.resolve('api'));
  },
  Lifetime.Scoped,
);

// support tiers
sp.register(
  'supportTiers',
  () => {
    const Service = require('~/common/services/support-tiers.service')
      .SupportTiersService as typeof SupportTiersService;
    return new Service(sp.resolve('api'));
  },
  Lifetime.Scoped,
);

// subscription pro
sp.register(
  'subscriptionPro',
  () => {
    const Service = require('~/common/services/subscription.pro.service')
      .SubscriptionProService as typeof SubscriptionProService;
    return new Service(sp.resolve('api'));
  },
  Lifetime.Scoped,
);

// two factor auth
sp.register(
  'twoFactorAuth',
  () => {
    const Service =
      require('~/common/services/two-factor-authentication.service')
        .TwoFactorAuthenticationService as typeof TwoFactorAuthenticationService;
    return new Service(sp.resolve('api'));
  },
  Lifetime.Scoped,
);

// boosted content
sp.register(
  'boostedContent',
  () => {
    const Service = require('~/modules/boost/services/boosted-content.service')
      .BoostedContentService as typeof BoostedContentService;
    return new Service(sp.resolveLazy('session'), sp.resolveLazy('log'));
  },
  Lifetime.Singleton,
);
// portrait boosted content
sp.register(
  'portraitBoostedContent',
  () => {
    const Service = require('~/modules/boost/services/boosted-content.service')
      .BoostedContentService as typeof BoostedContentService;
    return new Service(sp.resolveLazy('session'), sp.resolveLazy('log'));
  },
  Lifetime.Singleton,
);

// channel boosted content
sp.register(
  'channelBoostedContent',
  ({ source, guid }) => {
    const Service = require('~/modules/boost/services/boosted-content.service')
      .BoostedContentService as typeof BoostedContentService;
    return new Service(
      sp.resolveLazy('session'),
      sp.resolveLazy('log'),
      guid,
      source,
    );
  },
  Lifetime.Scoped,
);

// share service
sp.register(
  'share',
  () => {
    const Service = require('~/share/ShareService')
      .ShareService as typeof ShareService;
    return new Service();
  },
  Lifetime.Singleton,
);

// portrait content
sp.register(
  'portraitContent',
  () => {
    const Service = require('~/portrait/portrait-content.service')
      .PortraitContentService as typeof PortraitContentService;
    return new Service(sp.resolve('log'), sp.resolve('storages'));
  },
  Lifetime.Singleton,
);

// report service
sp.register(
  'report',
  () => {
    const Service = require('~/report/ReportService')
      .ReportService as typeof ReportService;
    return new Service(sp.resolve('api'));
  },
  Lifetime.Singleton,
);

// channel service
sp.register(
  'channel',
  () => {
    const Service = require('~/channel/ChannelService')
      .ChannelService as typeof ChannelService;
    return new Service(
      sp.resolve('api'),
      sp.resolve('blockList'),
      sp.resolve('log'),
      sp.resolve('i18n'),
    );
  },
  Lifetime.Singleton,
);

// groups service
sp.register(
  'groups',
  () => {
    const Service = require('~/groups/GroupsService')
      .GroupsService as typeof GroupsService;
    return new Service(sp.resolve('api'));
  },
  Lifetime.Singleton,
);

/**
 * Export the service provider
 */
export default {
  resolve: sp.resolve.bind(sp),
  resolveLazy: sp.resolveLazy.bind(sp),

  // most used services
  get log() {
    return sp.resolve('log');
  },
  get api() {
    return sp.resolve('api');
  },
  get storages() {
    return sp.resolve('storages');
  },
  get session() {
    return sp.resolve('session');
  },
  get socket() {
    return sp.resolve('socket');
  },
  get navigation() {
    return sp.resolve('navigation');
  },
  get i18n() {
    return sp.resolve('i18n');
  },
  get styles() {
    return sp.resolve('styles');
  },
  get config() {
    return sp.resolve('config');
  },
  get permissions() {
    return sp.resolve('permissions');
  },
};

export type Services = {
  storages: Storages;
  log: LogService;
  settings: any;
  sessionStorage: SessionStorageService;
  session: SessionService;
  devMode: DevModeService;
  socket: SocketService;
  api: ApiService;
  apiNoActiveSession: ApiService;
  auth: AuthService;
  wire: WireService;
  attachment: AttachmentService;
  blockList: BlockListService;
  channels: ChannelsService;
  analytics: AnalyticsService;
  searchBar: SearchBarService;
  inFeedNotices: InFeedNoticesService;
  push: PushService;
  videoPlayer: VideoPlayerService;
  navigation: NavigationService;
  openURL: OpenURLService;
  referrer: ReferrerService;
  deepLinks: DeepLinksRouterService;
  newsfeed: NewsfeedService;
  i18n: I18nService;
  styles: ThemedStyles;
  blogs: BlogsService;
  permissions: PermissionsService;
  config: MindsConfigService;
  commentsStorage: CommentStorageService;
  wallet: WalletService;
  connectivity: ConnectivityService;
  download: DownloadService;
  entitiesStorage: EntitiesStorage;
  entities: EntitiesService;
  feed: FeedsService;
  metadata: MetadataService;
  payment: PaymentService;
  richEmbed: RichEmbedService;
  settingsApi: SettingsApiService;
  hashtag: HashtagService;
  supportTiers: SupportTiersService;
  translation: TranslationService;
  subscriptionPro: SubscriptionProService;
  twoFactorAuth: TwoFactorAuthenticationService;
  update: UpdateService;
  boostedContent: BoostedContentService;
  portraitBoostedContent: BoostedContentService;
  channelBoostedContent: BoostedContentService;
  portraitContent: PortraitContentService;
  share: ShareService;
  storeRating: StoreRatingService;
  report: ReportService;
  channel: ChannelService;
  groups: GroupsService;
};

export type ServiceName = keyof Services;
