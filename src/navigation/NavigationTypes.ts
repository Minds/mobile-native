import UserModel from '../channel/UserModel';
import { ChannelStoreType } from '../channel/v2/createChannelStore';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WalletStoreType } from '../wallet/v2/createWalletStore';
import type FeedStore from '../common/stores/FeedStore';
import { ComposeStoreType } from '../compose/useComposeStore';
import type ActivityModel from '../newsfeed/ActivityModel';
import { SupportTiersType } from '../wire/WireTypes';

export type DrawerParamList = {
  Tabs: {};
};

export type InternalStackParamList = {
  Wallet: {};
  PlusDiscoveryScreen: {};
  BoostConsole: {};
  GroupsList: {};
  Settings: {};
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
  PlusScreen: {
    onComplete: Function;
    pro?: boolean;
  };
};

export type AuthStackParamList = {
  Login: {};
  Forgot: {
    code?: string;
  };
  Register: {};
};

export type ActivityFullScreenParamList = {
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
  };
  JoinMembershipScreen: {
    user?: UserModel;
    entity?: ActivityModel;
    onComplete?: Function;
    tiers?: Array<SupportTiersType>;
  };
  ActivityFullScreenNav: {};
  Newsfeed: {};
  Capture: {};
  Main: {};
  Account: {};
  Network: {};
  Security: {};
  Billing: {};
  Other: {};
  SettingsEmail: {};
  MessengerSettingsScreen: {};
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
  TFAScreen: {};
  DevicesScreen: {};
  TagSelector: {};
  NsfwSelector: {};
  ScheduleSelector: {};
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
  };
  Conversation: {};
  DiscoveryFeed: {};
  DiscoverySearch: { query: string; plus?: boolean };
  Subscribers: {};
  GroupView: {};
  BlogList: {};
  BlogView: {};
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
