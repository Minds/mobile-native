import UserModel from '../channel/UserModel';
import { ChannelStoreType } from '../channel/v2/createChannelStore';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WalletStoreType } from '../wallet/v2/createWalletStore';
import type FeedStore from '../common/stores/FeedStore';
import { ComposeStoreType } from '../compose/useComposeStore';
import type ActivityModel from '../newsfeed/ActivityModel';
import { SupportTiersType } from '../wire/WireTypes';

export type MainSwiperParamList = {
  Capture: {};
  Tabs: {};
  Messenger: {};
};

export type RootStackParamList = {
  App: {};
  Auth: {};
  Gathering: {};
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
  ActivityFullScreenNav: {};
  Newsfeed: {};
  Capture: {};
  StackCapture: {};
  Main: {};
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
  Activity: {};
  Conversation: {};
  DiscoveryFeed: {};
  DiscoverySearch: { query: string };
  Subscribers: {};
  GroupsList: {};
  GroupView: {};
  Wallet: {};
  BlogList: {};
  BoostConsole: {};
  BlogView: {};
  WireFab: {};
  WalletHistory: {};
  ViewImage: {};
  BlockchainWallet: {};
  Contributions: {};
  Transactions: {};
  BlockchainWalletModal: {};
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
    support_tier: SupportTiersType;
    entity: ActivityModel;
    onComplete: Function;
  };
  PlusDiscoveryScreen: {};
  JoinMembershipScreen: {
    onComplete: Function;
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
