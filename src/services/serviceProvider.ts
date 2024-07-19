import { InjectionContainer } from './InjectionContainer';

import type { Storages } from '~/common/services/storage/storages.service';
import type { LogService } from '~/common/services/log.service';
import type { NavigationService } from '~/navigation/NavigationService';
import type { ConnectivityService } from '~/common/services/connectivity.service';
import type { ThemedStyles } from '~/styles/ThemedStyles';
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

/**
 * Export the service provider
 */
export default {
  resolve: sp.resolve.bind(sp),
  resolveLazy: sp.resolveLazy.bind(sp),
  register: sp.register.bind(sp),

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
/**
 * Types
 */
export type Services = {
  storages: Storages;
  log: LogService;
  settings: SettingsService;
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
