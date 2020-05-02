import UserModel from '../channel/UserModel';
import { ChannelStoreType } from '../channel/v2/createChannelStore';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type MainSwiperParamList = {
  Capture: {};
  Tabs: {};
  Messenger: {};
};

export type RootStackParamList = {
  Fab: {
    disableThresholdCheck?: boolean;
    owner: UserModel;
    onComplete?: Function;
    default: {
      min: number;
      type: string;
    };
  };
  Newsfeed: {};
  Capture: {};
  App: {};
  Gathering: {};
  Auth: {};
};

export type AuthStackParamList = {
  Login: {};
  Forgot: {
    code?: string;
  };
  Register: {};
};

export type AppStackParamList = {
  StackCapture: {};
  Main: {};
  TagSelector: {};
  NsfwSelector: {};
  ScheduleSelector: {};
  MonetizeSelector: {};
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
