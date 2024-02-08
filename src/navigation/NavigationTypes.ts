import UserModel from '../channel/UserModel';
import { ChannelStoreType } from '../channel/v2/createChannelStore';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { WalletStoreType } from '../wallet/v2/createWalletStore';
import type { ComposeStoreType } from '../compose/useComposeStore';
import type ActivityModel from '../newsfeed/ActivityModel';
import type { SupportTiersType } from '../wire/WireTypes';
import type PortraitBarItem from '../portrait/models/PortraitBarItem';
import type BlogModel from '../blogs/BlogModel';
import { TwoFactorStore } from '../auth/twoFactorAuth/createTwoFactorStore';
import { TwoFactorType } from '../common/services/api.service';
import type GroupModel from '~/groups/GroupModel';
import { SupermindRequestParam } from '../compose/SupermindComposeScreen';
import SupermindRequestModel from '../supermind/SupermindRequestModel';
import { BottomSheetScreenParams } from '../common/components/bottom-sheet/BottomSheetScreen';
import type { WebViewNavigation } from 'react-native-webview';
import type { SupermindTwitterConnectRouteParams } from '../supermind/SupermindTwitterConnectScreen';
import type { SupermindConfirmationRouteParams } from '../compose/SupermindConfirmation';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ComposeScreenParams } from '../compose/ComposeScreen';
import type { InteractionsScreenParams } from '../common/components/interactions/InteractionsScreen';
import type { BoostType } from '~/modules/boost/boost-composer/boost.store';

type AnyType = any;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AnyType {}
  }
}

export type DrawerParamList = {
  Tabs: {};
};

type WebViewParams = {
  url: string;
  headers?: { [key: string]: string };
  redirectUrl?: string;
  onRedirect?: (event: WebViewNavigation) => void;
};

export type MoreStackParamList = {
  Activity: AppStackParamList['Activity'];
  Interactions: AppStackParamList['Interactions'];
  GroupsManage: {};
  UpgradeOptionsScreen: {};
  GroupView: {};
  RssScreen: {};
  SupermindTwitterConnect: SupermindTwitterConnectRouteParams;
  WebView: WebViewParams;
  AffiliateProgram: undefined;
  SupermindConsole?: {
    tab: 'inbound' | 'outbound';
  };
  Drawer: {};
  SupermindSettingsScreen: {};
  Channel: AppStackParamList['Channel'];
  Wallet: {
    currency?: string;
    section?: string;
  };
  PlusDiscoveryScreen: {};
  BoostConsole: {
    location?: string;
  };
  GroupsList: {};
  Settings: {};
  Analytics: {};
  InitialOnboarding: {};
  Account: {};
  Pro: {};
  Network: {};
  Security: {};
  Billing: {};
  Other: {};
  Resources: {};
  SettingsEmail: {};
  MessengerSettingsScreen: {};
  RekeyScreen: {};
  AutoplaySettingsScreen: {};
  VideoSoundSettingsScreen: {};
  BoostSettingsScreen: {};
  SettingsPassword: {};
  SettingsNotifications: {};
  PushNotificationsSettings: {};
  EmailNotificationsSettings: {};
  DataSaverScreen: {};
  BlockedChannels: {};
  TierManagementScreen: {};
  TwitterSync: {};
  DeleteChannel: {};
  DeactivateChannel: {};
  PaymentMethods: {};
  RecurringPayments: {};
  ReportedContent: {};
  AppInfo: {};
  LanguageScreen: {};
  NSFWScreen: {};
  DevicesScreen: {};
  TwoFactorAuthSettingsScreen: {};
  RecoveryCodesScreen: {
    store: TwoFactorStore;
  };
  VerifyAuthAppScreen: {
    store: TwoFactorStore;
  };
  DisableTFA: {
    store: TwoFactorStore;
    password: string;
  };
  ChooseBrowser: {};
  DevTools: {};
  BoostScreenV2: { entity: ActivityModel; boostType: BoostType };
};

type TwoFactorConfirmationParams = {
  /**
   * If passed a code, attempts to continue the original request with the new code.
   * If not passed a code calls the same endpoint again (as a means of resending the confirmation code)
   */
  onConfirm: (code?: string) => Promise<any>;
  title?: string;
  onCancel: () => void;
  mfaType: TwoFactorType;
  oldCode: string;
  email?: string;
  showRecovery?: boolean;
  isNewUser?: boolean;
};

export type RootStackParamList = {
  CustomPages: { page: string; title: string };
  ChangeEmail: {};
  TierManagementScreen: {};
  TierScreen: {};
  GroupsList: {};
  GroupsDiscovery: {};
  GroupView: {};
  Compose: ComposeScreenParams;
  SupermindConfirmation: SupermindConfirmationRouteParams;
  SupermindCompose: {
    data: SupermindRequestParam;
    closeComposerOnClear?: boolean;
    onSave: (payload: SupermindRequestParam) => void;
    onClear: () => void;
  };
  TosScreen: {};
  Capture: {
    portrait?: boolean;
    noText?: boolean;
    isRemind?: boolean;
    entity?: any;
    text?: string;
    media?: any;
    start?: boolean;
    mode?: 'photo' | 'video' | 'text';
  };
  MultiUserScreen: {};
  ChooseBrowserModal: {
    onSelected?: () => void;
  };
  TwoFactorConfirmation: TwoFactorConfirmationParams;
  Splash: {};
  App: {};
  Auth: {};
  Gathering: {};
  BlockchainWalletModal: {};
  JoinMembershipScreen: {
    user?: UserModel;
    entity?: ActivityModel;
    onComplete: Function;
    tiers?: Array<SupportTiersType>;
  };
  BoostScreen: { entity: ActivityModel; boostType: BoostType };
  UpgradeScreen: {
    onComplete: (any) => void;
    pro?: boolean;
  };
  VerifyEmail: {};
  SelectHashtags: {};
  SetupChannel: {};
  VerifyUniqueness: {};
  SuggestedChannel: {};
  SuggestedGroups: {};
  PhoneValidation: {
    onConfirm: Function;
    onCancel: Function;
    description?: string;
  };
  WalletWithdrawal: {};
  EarnModal: {};
  SearchScreen: {};
  PasswordConfirmation: {
    onConfirm: (password: string) => void;
    title: string;
  };
  ResetPassword: {
    username: string;
    code: string;
  };
  BottomSheet: BottomSheetScreenParams;
  ImageGallery: {};
  RecoveryCodeUsedScreen: {};
  MultiUserLogin: {};
  MultiUserRegister: {};
  RelogScreen: {
    sessionIndex?: number;
    onLogin?: Function;
    onCancel?: Function;
  };
  DevTools: {};
  ChannelSelectScreen: {
    username: string;
    onSelect: (channel: UserModel) => void;
  };
  BoostScreenV2: { entity: ActivityModel; boostType: BoostType };
  StoryBook: {};
  CodePushSync: {};
  BoostUpgrade: undefined;
  WebContent: { path: string };
};

export type AuthStackParamList = {
  Welcome: {};
  Login: {
    username?: string;
    code?: string;
  };
  Register: {};
  TwoFactorConfirmation: TwoFactorConfirmationParams;
};

export type AppStackParamList = {
  Interactions: InteractionsScreenParams;
  BottomSheet: BottomSheetScreenParams;
  Report: {};
  GifCardClaim: {
    code: string;
  };
  SingleBoostConsole: {
    guid: string;
  };
  BoostConsole: {
    location?: string;
  };
  Supermind: {
    guid: string;
    supermindRequest?: SupermindRequestModel;
  };
  WebView: WebViewParams;
  DiscoverySearch: { query: string; plus?: boolean; q?: string; f?: string };
  PortraitViewerScreen: {
    items: Array<PortraitBarItem>;
    /**
     * the guid of the selected activity to be focused
     */
    guid?: string;
  };
  Fab: {
    disableThresholdCheck?: boolean;
    owner: UserModel;
    onComplete?: Function;
    default: {
      min: number;
      type: string;
    };
    walletStore?: WalletStoreType;
    options?: Function;
  };
  JoinMembershipScreen: {
    user?: UserModel;
    entity?: ActivityModel;
    onComplete?: Function;
    tiers?: Array<SupportTiersType>;
  };
  BoostScreen: { entity: ActivityModel; boostType: BoostType };
  ActivityFullScreenNav: {};
  Newsfeed: {};
  Tabs: {};
  TagSelector: {};
  NsfwSelector: {};
  ScheduleSelector: {};
  AccessSelector: {
    store: ComposeStoreType;
  };
  LicenseSelector: {};
  Update: {};
  Boost: {};
  Analytics: {};
  Notifications: {};
  SupermindTwitterConnect: SupermindTwitterConnectRouteParams;
  Channel: {
    guid?: string;
    entity?: UserModel;
  };
  ChannelEdit: {};
  Bio: {
    store: ChannelStoreType;
  };
  About: {
    store: ChannelStoreType;
  };
  Activity: {
    entity?: ActivityModel;
    group?: GroupModel;
    guid?: string;
    scrollToBottom?: boolean;
    focusedCommentUrn?: string;
    noBottomInset?: boolean;
  };
  Conversation: {};
  DiscoveryFeed: {};

  GroupView: {};
  BlogList: {};
  BlogView: {
    blog?: BlogModel;
    slug?: string;
    guid?: string;
    scrollToBottom?: boolean;
  };
  WireFab: {};
  WalletHistory: {};
  BlockchainWallet: {};
  Contributions: {};
  Transactions: {};
  BlockchainWalletImport: {};
  BlockchainWalletDetails: {};
  More: {};
  Withdraw: {};
  WalletOnboarding: {};
  NotSupported: {};
  OnboardingScreen: {};
  OnboardingScreenNew: {};
  ReceiverAddressScreen: {
    walletStore: WalletStoreType;
  };
  BtcAddressScreen: {
    walletStore: WalletStoreType;
  };
  BankInfoScreen: {
    walletStore: WalletStoreType;
  };
  TierScreen: {};
  UpgradeScreen: {
    onComplete: Function;
    pro?: boolean;
  };
  MultiUserScreen: {};
  TopNewsfeed: {};
  InAppVerification: {
    onClose?: () => void;
    onSuccess?: () => void;
  };
  BoostScreenV2: { entity: ActivityModel; boostType: BoostType };
  BoostSettingsScreen: {};
  Onboarding: {};
  Compose: undefined;
};

// types for channel edit screens
export type BioScreenRouteProp = RouteProp<AppStackParamList, 'Bio'>;
export type BioScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Bio'
>;
export type AboutScreenRouteProp = RouteProp<AppStackParamList, 'About'>;
export type AboutScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'About'
>;

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type WalletStackParamList = {
  Wallet: {};
  CreditTransactions: { guid: string; expireAt?: number };
};
