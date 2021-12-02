import UserModel from '../channel/UserModel';
import { ChannelStoreType } from '../channel/v2/createChannelStore';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { WalletStoreType } from '../wallet/v2/createWalletStore';
import type { ComposeStoreType } from '../compose/useComposeStore';
import type ActivityModel from '../newsfeed/ActivityModel';
import type { SupportTiersType } from '../wire/WireTypes';
import type { PortraitBarItem } from '../portrait/createPortraitStore';
import type BlogModel from '../blogs/BlogModel';
import { TwoFactorStore } from '../auth/twoFactorAuth/createTwoFactorStore';
import { TwoFactorType } from '../common/services/api.service';
import type GroupModel from '~/groups/GroupModel';

type AnyType = any;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AnyType {}
  }
}

export type DrawerParamList = {
  Tabs: {};
};

export type InternalStackParamList = {
  Wallet: {
    currency?: string;
    section?: string;
  };
  PlusDiscoveryScreen: {};
  BoostConsole: {};
  GroupsList: {};
  Settings: {};
  Analytics: {};
  Onboarding: {};
  InitialOnboarding: {};
  BuyTokens: {};
  Test: {};
};

export type RootStackParamList = {
  Compose: {};
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
  TwoFactorConfirmation: {
    onConfirm: (string) => void;
    title?: string;
    onCancel: () => void;
    mfaType: TwoFactorType;
    oldCode: string;
    showRecovery?: boolean;
  };
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
  BoostChannelScreen: {};
  BoostPostScreen: { entity: ActivityModel };
  UpgradeScreen: {
    onComplete: Function;
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
  ViewImage: {};
  RecoveryCodeUsedScreen: {};
  MultiUserLogin: {};
  MultiUserRegister: {};
  RelogScreen: {
    sessionIndex?: number;
    onLogin?: Function;
    onCancel?: Function;
  };
};

export type AuthStackParamList = {
  Welcome: {
    username?: string;
    code?: string;
  };
  Login: {
    username?: string;
    code?: string;
  };
  Forgot: {
    code?: string;
  };
  Register: {};
  TwoFactorConfirmation: {
    onConfirm: (string) => void;
    title?: string;
    onCancel: () => void;
    mfaType: TwoFactorType;
    oldCode: string;
    showRecovery?: boolean;
  };
};

export type AppStackParamList = {
  ChooseBrowser: {};
  PortraitViewerScreen: {
    items: Array<PortraitBarItem>;
    index: number;
  };
  ExportLegacyWallet: {};
  Messenger: {};
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
  BoostChannelScreen: {};
  BoostPostScreen: { entity: ActivityModel };
  ActivityFullScreenNav: {};
  Newsfeed: {};
  Main: {};
  Account: {};
  Network: {};
  Security: {};
  Billing: {};
  Referrals: {};
  BoostConsole: {};
  Other: {};
  Resources: {};
  SettingsEmail: {};
  MessengerSettingsScreen: {};
  RekeyScreen: {};
  AutoplaySettingsScreen: {};
  BoostSettingsScreen: {};
  SettingsPassword: {};
  SettingsNotifications: {};
  PushNotificationsSettings: {};
  EmailNotificationsSettings: {};
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
  TagSelector: {};
  NsfwSelector: {};
  ScheduleSelector: {};
  PermawebSelector: {};
  AccessSelector: {
    store: ComposeStoreType;
  };
  LicenseSelector: {};
  EmailConfirmation: {};
  Update: {};
  Boost: {};
  Analytics: {};
  Notifications: {};
  Channel: {};
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
    focusedUrn?: string;
  };
  Conversation: {};
  DiscoveryFeed: {};
  DiscoverySearch: { query: string; plus?: boolean; q?: string; f?: string };
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
