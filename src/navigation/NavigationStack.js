import React, { Fragment } from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import LoadingScreen from '../LoadingScreen';
import LoginScreen from '../auth/LoginScreen';
import ForgotScreen from '../auth/ForgotScreen';
// import TabsScreen from '../tabs/TabsScreen';
import TabsScreenNew from '../tabs/TabsScreenNew';
import NotificationsScreen from '../notifications/NotificationsScreen';
import NotificationsSettingsScreen from '../notifications/NotificationsSettingsScreen';
import ActivityScreen from '../newsfeed/ActivityScreen';
import ChannelScreen from '../channel/ChannelScreen';
import ChannelSubscribers from '../channel/subscribers/ChannelSubscribers';
import CapturePoster from '../capture/CapturePoster';
import RegisterScreen from '../auth/RegisterScreen';
import ConversationScreen from '../messenger/ConversationScreen';
import SettingsScreen from '../settings/SettingsScreen';
import PasswordScreen from '../settings/screens/PasswordScreen';
import EmailScreen from '../settings/screens/EmailScreen';
import BlockedChannelsScreen from '../settings/screens/BlockedChannelsScreen';
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
import ContributionsScreen from '../wallet/tokens/ContributionsScreen';
import TransactionsScreen from '../wallet/tokens/TransactionsScreen';
import BlockchainWalletScreen from '../blockchain/wallet/BlockchainWalletScreen';
import BlockchainWalletModalScreen from '../blockchain/wallet/modal/BlockchainWalletModalScreen';
import BlockchainWalletImportScreen from '../blockchain/wallet/import/BlockchainWalletImportScreen';
import BlockchainWalletDetailsScreen from '../blockchain/wallet/details/BlockchainWalletDetailsScreen';
import ReportScreen from '../report/ReportScreen';
import MoreScreen from '../tabs/MoreScreen';
import WithdrawScreen from '../wallet/tokens/WithdrawScreen';
import WalletOnboardingScreen from '../wallet/onboarding/WalletOnboardingScreen';
import ComingSoonScreen from '../static-views/ComingSoonScreen';
import NotSupportedScreen from '../static-views/NotSupportedScreen';
import OnboardingScreen from '../onboarding/OnboardingScreen';
import IssueReportScreen from '../issues/IssueReportScreen';
import Wizard from '../common/components/Wizard';
import UpdatingScreen from '../update/UpdateScreen';
import {withErrorBoundaryScreen} from '../common/components/ErrorBoundary';
// import LogsScreen from '../logs/LogsScreen';
import DeleteChannelScreen from '../settings/screens/DeleteChannelScreen';
import DiscoveryFeedScreen from '../discovery/DiscoveryFeedScreen';
import Gathering from '../gathering/Gathering';
import OnboardingScreenNew from '../onboarding/OnboardingScreenNew';
import EmailConfirmationScreen from '../onboarding/EmailConfirmationScreen';
import featuresService from '../common/services/features.service';
import ThemedStyles from '../styles/ThemedStyles';
import { View } from 'react-native';


const hideHeader = {headerShown: false};

const Stack = createStackNavigator();

const AppStack = function(props) {
  // const tabScreen = featuresService.has('navigation-2020')
  //   ? withErrorBoundaryScreen(TabsScreenNew)
  //   : withErrorBoundaryScreen(TabsScreen);
  return (
    <Stack.Navigator screenOptions={ThemedStyles.defaultScreenOptions}>
      <Stack.Screen name="Tabs" component={TabsScreenNew} options={hideHeader} />
      <Stack.Screen name="EmailConfirmation" component={EmailConfirmationScreen}/>
      <Stack.Screen name="Update" component={UpdatingScreen}/>
      <Stack.Screen name="Boost" component={BoostScreen} options={{gesturesEnabled: false}}/>
      <Stack.Screen name="DeleteChannel" component={DeleteChannelScreen}/>
      <Stack.Screen name="Notifications" component={NotificationsScreen}/>
      <Stack.Screen name="NotificationsSettings" component={NotificationsSettingsScreen}/>
      <Stack.Screen name="Channel" component={ChannelScreen} options={hideHeader}/>
      <Stack.Screen name="Capture" component={CapturePoster} />
      <Stack.Screen name="Activity" component={ActivityScreen}/>
      <Stack.Screen name="Conversation" component={ConversationScreen}/>
      <Stack.Screen name="DiscoveryFeed" component={DiscoveryFeedScreen}/>
      <Stack.Screen name="Subscribers" component={ChannelSubscribers}/>
      <Stack.Screen name="Settings" component={SettingsScreen}/>
      <Stack.Screen name="SettingsBlockedChannels" component={BlockedChannelsScreen}/>
      <Stack.Screen name="SettingsEmail" component={EmailScreen}/>
      <Stack.Screen name="SettingsPassword" component={PasswordScreen}/>
      <Stack.Screen name="SettingsRekey" component={RekeyScreen}/>
      <Stack.Screen name="SettingsBilling" component={BillingScreen}/>
      <Stack.Screen name="GroupsList" component={GroupsListScreen}/>
      <Stack.Screen name="GroupView" component={GroupViewScreen} options={hideHeader}/>
      <Stack.Screen name="Wallet" component={WalletScreen}/>
      <Stack.Screen name="BlogList" component={BlogsListScreen}/>
      <Stack.Screen name="BoostConsole" component={BoostConsoleScreen}/>
      <Stack.Screen name="BlogView" component={BlogsViewScreen}/>
      <Stack.Screen name="WireFab" component={FabScreen}/>
      <Stack.Screen name="WalletHistory" component={WalletHistoryScreen}/>
      <Stack.Screen name="ViewImage" component={ViewImageScreen}/>
      <Stack.Screen name="BlockchainWallet" component={BlockchainWalletScreen}/>
      <Stack.Screen name="Contributions" component={ContributionsScreen}/>
      <Stack.Screen name="Transactions" component={TransactionsScreen}/>
      <Stack.Screen name="BlockchainWalletModal" component={BlockchainWalletModalScreen} options={{gesturesEnabled: false}}/>
      <Stack.Screen name="BlockchainWalletImport" component={BlockchainWalletImportScreen} />
      <Stack.Screen name="BlockchainWalletDetails" component={BlockchainWalletDetailsScreen} />
      <Stack.Screen name="Report" component={ReportScreen} />
      <Stack.Screen name="More" component={MoreScreen} />
      <Stack.Screen name="Withdraw" component={WithdrawScreen} />
      <Stack.Screen name="WalletOnboarding" component={WalletOnboardingScreen} />
      <Stack.Screen name="NotSupported" component={NotSupportedScreen} />
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <Stack.Screen name="OnboardingScreenNew" component={OnboardingScreenNew} />
    </Stack.Navigator>
  );
};

const AuthStack = function(props) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={hideHeader} />
      <Stack.Screen name="Forgot" component={ForgotScreen} options={hideHeader}/>
      <Stack.Screen name="Register" component={RegisterScreen} options={hideHeader} />
    </Stack.Navigator>
  );
};

const RootStack = function(props) {
  return (
    <Stack.Navigator mode="modal" headerMode="none">
      {props.isLoggedIn ? (
        <Fragment>
          <Stack.Screen name="App" component={AppStack} />
          <Stack.Screen name="Gathering" component={Gathering} />
        </Fragment>
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default RootStack;