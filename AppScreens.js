import { StackNavigator } from 'react-navigation';

import LoadingScreen from './src/LoadingScreen';
import LoginScreen from './src/auth/LoginScreen';
import TabsScreen from './src/tabs/TabsScreen';
import NotificationsScreen from './src/notifications/NotificationsScreen';
import NotificationsSettingsScreen from './src/notifications/NotificationsSettingsScreen';
import CommentsScreen from './src/comments/CommentsScreen';
import ChannelScreen from './src/channel/ChannelScreen';
import CapturePoster from './src/capture/CapturePoster';
import RegisterScreen from './src/auth/RegisterScreen';
import DiscoveryViewScreen from './src/discovery/DiscoveryViewScreen';
import ConversationScreen from './src/messenger/ConversationScreen';
import SettingsScreen from './src/settings/SettingsScreen';
import GroupsListScreen from './src/groups/GroupsListScreen';
import GroupViewScreen from './src/groups/GroupViewScreen';
import WalletScreen from './src/wallet/WalletScreen';
import WalletHistoryScreen from './src/wallet/WalletHistoryScreen';
import BoostConsoleScreen from './src/boost/BoostConsoleScreen';
import BlogsListScreen from './src/blogs/BlogsListScreen';
import BlogsViewScreen from './src/blogs/BlogsViewScreen';
import FabScreen from './src/wire/FabScreen';
import ActivityScreen from './src/newsfeed/ActivityScreen';
import ViewImageScreen from './src/media/ViewImageScreen';
import BoostScreen from './src/boost/creator/BoostScreen';
import TokensRewardsScreen from "./src/wallet/tokens/TokensRewardsScreen";
import BlockchainWalletScreen from "./src/blockchain/wallet/BlockchainWalletScreen";
import BlockchainWalletModalScreen from './src/blockchain/wallet/modal/BlockchainWalletModalScreen';
import BlockchainWalletImportScreen from './src/blockchain/wallet/import/BlockchainWalletImportScreen';
import BlockchainWalletDetailsScreen from './src/blockchain/wallet/details/BlockchainWalletDetailsScreen';

/**
 * Main stack navigator
 */
const Stack = StackNavigator({
  Loading: {
    screen: LoadingScreen,
  },
  Boost: {
    screen: BoostScreen,
  },
  Login: {
    screen: LoginScreen,
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
    screen: ChannelScreen
  },
  Capture: {
    screen: CapturePoster
  },
  Comments: {
    screen: CommentsScreen
  },
  DiscoveryView: {
    screen: DiscoveryViewScreen
  },
  Conversation: {
    screen: ConversationScreen
  },
  Settings: {
    screen: SettingsScreen
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
    screen: BlogsViewScreen
  },
  WireFab: {
    screen: FabScreen
  },
  Activity: {
    screen: ActivityScreen
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
  TokensRewards: {
    screen: TokensRewardsScreen
  },
  BlockchainWalletModal: {
    screen: BlockchainWalletModalScreen
  },
  BlockchainWalletImport: {
    screen: BlockchainWalletImportScreen
  },
  BlockchainWalletDetails: {
    screen: BlockchainWalletDetailsScreen
  },
});

export default Stack;
