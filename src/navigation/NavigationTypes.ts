import UserModel from '../channel/UserModel';
import { ChannelStoreType } from '../channel/v2/createChannelStore';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { WalletStoreType } from '../wallet/v2/createWalletStore';
import type FeedStore from '../common/stores/FeedStore';
import type { ComposeStoreType } from '../compose/useComposeStore';
import type ActivityModel from '../newsfeed/ActivityModel';
import type { SupportTiersType } from '../wire/WireTypes';
import type { PortraitBarItem } from '../portrait/createPortraitStore';
import type BlogModel from '../blogs/BlogModel';

export type DrawerParamList = {
  Tabs: {};
};

export type InternalStackParamList = {
  Wallet: {};
  PlusDiscoveryScreen: {};
  BoostConsole: {};
  GroupsList: {};
  Settings: {};
  Analytics: {};
  Onboarding: {};
  InitialOnboarding: {};
};

export type RootStackParamList = {
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
  BoostChannelScreen: {};
  BoostPostScreen: { entity: ActivityModel };
  PlusScreen: {
    onComplete: Function;
    pro?: boolean;
  };
  VerifyEmail: {};
  SelectHashtags: {};
  SetupChannel: {};
  VerifyUniqueness: {};
  SuggestedChannel: {};
  SuggestedGroups: {};
  PhoneValidation: {};
};

export type AuthStackParamList = {
  Login: {};
  Forgot: {
    code?: string;
  };
  Register: {};
};

export type ActivityFullScreenParamList = {
  PortraitViewerScreen: {
    items: Array<PortraitBarItem>;
    index: number;
  };
  ActivityFullScreen: {
    feed: FeedStore;
    current: number;
  };
  ViewImage: {
    entity: ActivityModel;
  };
};

export type AppStackParamList = {
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
    showBottomStore?: 'withdrawal'; // add | for more;
  };
  JoinMembershipScreen: {
    user?: UserModel;
    entity?: ActivityModel;
    onComplete?: Function;
    tiers?: Array<SupportTiersType>;
  };
  BoostChannelScreen: {};
  BoostPostScreen: { entity: ActivityModel };
  ActivityFullScreenNav: {};
  Newsfeed: {};
  Capture: {
    portrait?: boolean;
    noText?: boolean;
    isRemind?: boolean;
    entity?: any;
    text?: string;
    media?: any;
    mode?: 'photo' | 'video' | 'text';
  };
  Main: {};
  Account: {};
  Network: {};
  Security: {};
  Billing: {};
  Referrals: {};
  BoostConsole: {};
  Other: {};
  SettingsEmail: {};
  MessengerSettingsScreen: {};
  AutoplaySettingsScreen: {};
  SettingsPassword: {};
  SettingsNotifications: {};
  DataSaverScreen: {};
  BlockedChannels: {};
  TierManagementScreen: {};
  DeleteChannel: {};
  DeactivateChannel: {};
  PaymentMethods: {};
  RecurringPayments: {};
  ReportedContent: {};
  AppInfo: {};
  LanguageScreen: {};
  NSFWScreen: {};
  DevicesScreen: {};
  TagSelector: {};
  NsfwSelector: {};
  ScheduleSelector: {};
  PermawebSelector: {};
  AccessSelector: {
    store: ComposeStoreType;
  };
  MonetizeSelector: {
    store: ComposeStoreType;
  };
  PlusMonetize: {
    store: ComposeStoreType;
  };
  MembershipMonetize: {
    store: ComposeStoreType;
    useForSelection: boolean;
  };
  CustomMonetize: {
    store: ComposeStoreType;
  };
  LicenseSelector: {};
  EmailConfirmation: {};
  Update: {};
  Boost: {};
  Analytics: {};
  Notifications: {};
  Channel: {};
  EditChannelScreen: {};
  Bio: {
    store: ChannelStoreType;
  };
  About: {
    store: ChannelStoreType;
  };
  Activity: {
    entity?: ActivityModel;
    guid?: string;
    scrollToBottom?: boolean;
    focusedUrn?: string;
  };
  Conversation: {};
  DiscoveryFeed: {};
  DiscoverySearch: { query: string; plus?: boolean };
  Subscribers: {};
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
  ViewImage: {};
  BlockchainWallet: {};
  Contributions: {};
  Transactions: {};
  BlockchainWalletImport: {};
  BlockchainWalletDetails: {};
  Report: {};
  More: {};
  Withdraw: {};
  WalletOnboarding: {};
  NotSupported: {};
  OnboardingScreen: {};
  OnboardingScreenNew: {};
  ReceiverAddressScreen: {
    walletStore: WalletStoreType;
  };
  LearnMoreScreen: {};
  BtcAddressScreen: {
    walletStore: WalletStoreType;
  };
  BankInfoScreen: {
    walletStore: WalletStoreType;
  };
  TierScreen: {};
  PlusScreen: {
    onComplete: Function;
    pro?: boolean;
  };
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
