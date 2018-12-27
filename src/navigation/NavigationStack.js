import { createStackNavigator } from 'react-navigation';

import LoadingScreen from '../LoadingScreen';
import LoginScreen from '../auth/LoginScreen';
import ForgotScreen from '../auth/ForgotScreen';
import TabsScreen from '../tabs/TabsScreen';
import NotificationsScreen from '../notifications/NotificationsScreen';
import NotificationsSettingsScreen from '../notifications/NotificationsSettingsScreen';
import ActivityScreen from '../newsfeed/ActivityScreen';
import ChannelScreen from '../channel/ChannelScreen';
import ChannelSubscribers from '../channel/subscribers/ChannelSubscribers';
import CapturePoster from '../capture/CapturePoster';
import RegisterScreen from '../auth/RegisterScreen';
import DiscoveryViewScreen from '../discovery/DiscoveryViewScreen';
import ConversationScreen from '../messenger/ConversationScreen';
import SettingsScreen from '../settings/SettingsScreen';
import PasswordScreen from '../settings/screens/PasswordScreen';
import EmailScreen from '../settings/screens/EmailScreen';
import BillingScreen from '../settings/screens/BillingScreen';
import RekeyScreen from '../settings/screens/RekeyScreen';
import GroupsListScreen from '../groups/GroupsListScreen';
import GroupViewScreen from '../groups/GroupViewScreen';
import WalletScreen from '../wallet/WalletScreen';
import WalletHistoryScreen from '../wallet/WalletHistoryScreen';
import BoostConsoleScreen from '../boost/BoostConsoleScreen';
import BlogsListScreen from '../blogs/BlogsListScreen';
import BlogsViewScreen from '../blogs/BlogsViewScreen';
import FabScreen from '../wire/FabScreen';
import ViewImageScreen from '../media/ViewImageScreen';
import BoostScreen from '../boost/creator/BoostScreen';
import ContributionsScreen from "../wallet/tokens/ContributionsScreen";
import TransactionsScreen from "../wallet/tokens/TransactionsScreen";
import BlockchainWalletScreen from "../blockchain/wallet/BlockchainWalletScreen";
import BlockchainWalletModalScreen from '../blockchain/wallet/modal/BlockchainWalletModalScreen';
import BlockchainWalletImportScreen from '../blockchain/wallet/import/BlockchainWalletImportScreen';
import BlockchainWalletDetailsScreen from '../blockchain/wallet/details/BlockchainWalletDetailsScreen';
import ReportScreen from '../report/ReportScreen';
import MoreScreen from '../tabs/MoreScreen';
import CheckoutModalScreen from '../payments/checkout/CheckoutModalScreen';
import WithdrawScreen from '../wallet/tokens/WithdrawScreen';
import WalletOnboardingScreen from "../wallet/onboarding/WalletOnboardingScreen";
import ComingSoonScreen from '../static-views/ComingSoonScreen';
import NotSupportedScreen from '../static-views/NotSupportedScreen';
import OnboardingScreen from '../onboarding/OnboardingScreen';

/**
 * Main stack navigator
 */
const Stack = createStackNavigator({
  Loading: {
    screen: LoadingScreen,
  },
  Boost: {
    screen: BoostScreen,
    navigationOptions: {
      gesturesEnabled: false
    },
  },
  Login: {
    screen: LoginScreen,
  },
  Forgot: {
    screen: ForgotScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Tabs: {
    screen: TabsScreen,
  },
  Notifications: {
    screen: NotificationsScreen,
  },
  NotificationsSettings: {
    screen: NotificationsSettingsScreen
  },
  Channel: {
    screen: ChannelScreen,
    path: 'channel/:guid',
  },
  Capture: {
    screen: CapturePoster
  },
  Activity: {
    screen: ActivityScreen,
    path: 'activity/:guid',
  },
  DiscoveryView: {
    screen: DiscoveryViewScreen
  },
  Conversation: {
    screen: ConversationScreen
  },
  Subscribers: {
    screen: ChannelSubscribers
  },
  Settings: {
    screen: SettingsScreen
  },
  SettingsEmail: {
    screen: EmailScreen
  },
  SettingsRekey: {
    screen: RekeyScreen
  },
  SettingsPassword: {
    screen: PasswordScreen
  },
  SettingsBilling: {
    screen: BillingScreen
  },
  GroupsList: {
    screen: GroupsListScreen
  },
  GroupView: {
    screen: GroupViewScreen
  },
  Wallet: {
    screen: WalletScreen
  },
  BlogList: {
    screen: BlogsListScreen
  },
  BoostConsole: {
    screen: BoostConsoleScreen
  },
  BlogView: {
    screen: BlogsViewScreen,
    path: 'blog/view/:guid',
  },
  WireFab: {
    screen: FabScreen,
    navigationOptions: {
      gesturesEnabled: false
    },
  },
  WalletHistory: {
    screen: WalletHistoryScreen
  },
  ViewImage: {
    screen: ViewImageScreen
  },
  BlockchainWallet: {
    screen: BlockchainWalletScreen
  },
  Contributions: {
    screen: ContributionsScreen,
  },
  Transactions: {
    screen: TransactionsScreen
  },
  BlockchainWalletModal: {
    screen: BlockchainWalletModalScreen,
    navigationOptions: {
      gesturesEnabled: false
    },
  },
  BlockchainWalletImport: {
    screen: BlockchainWalletImportScreen
  },
  BlockchainWalletDetails: {
    screen: BlockchainWalletDetailsScreen
  },
  Report: {
    screen: ReportScreen,
  },
  More: {
    screen: MoreScreen
  },
  CheckoutModal: {
    screen: CheckoutModalScreen,
    navigationOptions: {
      gesturesEnabled: false
    },
  },
  Withdraw: {
    screen: WithdrawScreen
  },
  WalletOnboarding: {
    screen: WalletOnboardingScreen
  },
  ComingSoon: {
    screen: ComingSoonScreen
  },
  NotSupported: {
    screen: NotSupportedScreen
  },
  OnboardingScreen: {
    screen: OnboardingScreen,
  },
});

export default Stack;
