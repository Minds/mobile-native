import UserModel from '../channel/UserModel';

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

export type AppStackParamList = {
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
  EditChannel: {};
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
