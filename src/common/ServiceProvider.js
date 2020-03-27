import AndroidPermissionsService from './services/android-permissions.service';
import ApiService from './services/api.service';
import AttachmentService from './services/attachment.service';
import BadgeService from './services/badge.service';
import BenchService from './services/bench.service';
import BlockListService from './services/block-list.service';
import BoostedContentService from './services/boosted-content.service';
import ChannelsService from './services/channels.service';
import ConnectivityService from './services/connectivity.service';
import CryptoService from './services/crypto.service';
import DeeplinksRouterService from './services/deeplinks-router.service';
import DownloadService from './services/download.service';
import EmailConfirmationService from './services/email-confirmation.service';
import EntitiesService from './services/entities.service';
import EntityService from './services/entity.service';
import FeaturesService from './services/features.service';
import FeedsService from './services/feeds.service';
import GatheringService from './services/gathering.service';
import GitlabService from './services/gitlab.service';
import HashtagService from './services/hashtag.service';
import I18nService from './services/i18n.service';
import ImagePickerService from './services/image-picker.service';
import KeychainService from './services/keychain.service';
import ListOptionsService from './services/list-options.service';
import LogService from './services/log.service';
import MetadataService from './services/metadata.service';
import MindsService from './services/minds.service';
import OpenUrlService from './services/open-url.service';
import PaymentService from './services/payment.service';
import PushService from './services/push.service';
import ReceiveShareService from './services/receive-share.service';
import RichEmbedService from './services/rich-embed.service';
import SessionService from './services/session.service';
import SessionStorageService from './services/session.storage.service';
import SocketService from './services/socket.service';
import SqliteStorageProviderService from './services/sqlite-storage-provider.service';
import SqliteService from './services/sqlite.service';
import StorageService from './services/storage.service';
import StripeService from './services/stripe.service';
import TranslationService from './services/translation.service';
import TwoFactorAuthenticationService from './services/two-factor-authentication.service';
import UpdateService from './services/update.service';
import ValidatorService from './services/validator.service';
import VideoPlayerService from './services/video-player.service';
import VotesService from './services/votes.service';

class ServiceProvider {
  static instances = {};

  static get(service) {
    switch (service) {
      case 'AndroidPermissionsService':
        return new AndroidPermissionsService();
      case 'ApiService':
        return new ApiService();
      case 'AttachmentService':
        return new AttachmentService();
      case 'BadgeService':
        return new BadgeService();
      case 'BenchService':
        return new BenchService();
      case 'BlockListService':
        return new BlockListService();
      case 'BoostedContentService':
        return new BoostedContentService();
      case 'ChannelsService':
        return new ChannelsService();
      case 'ConnectivityService':
        return new ConnectivityService();
      case 'CryptoService':
        return new CryptoService();
      case 'DeeplinksRouterService':
        return new DeeplinksRouterService();
      case 'DownloadService':
        return new DownloadService();
      case 'EmailConfirmationService':
        return new EmailConfirmationService();
      case 'EntitiesService':
        return new EntitiesService();
      case 'EntityService':
        return new EntityService();
      case 'FeaturesService':
        return new FeaturesService();
      case 'FeedsService':
        return new FeedsService();
      case 'GatheringService':
        return new GatheringService();
      case 'GitlabService':
        return new GitlabService();
      case 'HashtagService':
        return new HashtagService();
      case 'I18nService':
        return new I18nService();
      case 'ImagePickerService':
        return new ImagePickerService();
      case 'KeychainService':
        return new KeychainService();
      case 'ListOptionsService':
        return new ListOptionsService();
      case 'LogService':
        return new LogService();
      case 'MetadataService':
        return new MetadataService();
      case 'MindsService':
        return new MindsService();
      case 'OpenUrlService':
        return new OpenUrlService();
      case 'PaymentService':
        return new PaymentService();
      case 'PushService':
        return new PushService();
      case 'ReceiveShareService':
        return new ReceiveShareService();
      case 'RichEmbedService':
        return new RichEmbedService();
      case 'SessionService':
        return new SessionService();
      case 'SessionStorageService':
        return new SessionStorageService();
      case 'SocketService':
        return new SocketService();
      case 'SqliteStorageProviderService':
        return new SqliteStorageProviderService();
      case 'SqliteService':
        return new SqliteService();
      case 'StorageService':
        return new StorageService();
      case 'StripeService':
        return new StripeService();
      case 'TranslationService':
        return new TranslationService();
      case 'TwoFactorAuthenticationService':
        return new TwoFactorAuthenticationService();
      case 'UpdateService':
        return new UpdateService();
      case 'ValidatorService':
        return new ValidatorService();
      case 'VideoPlayerService':
        return new VideoPlayerService();
      case 'VotesService':
        return new VotesService();
    }
  }
}

export default new ServiceProvider();
