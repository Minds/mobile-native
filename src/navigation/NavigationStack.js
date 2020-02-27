import React, { Fragment } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoadingScreen from '../LoadingScreen';
import LoginScreen from '../auth/LoginScreen';
import ForgotScreen from '../auth/ForgotScreen';
import TabsScreen from '../tabs/TabsScreen';
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
import { withErrorBoundaryScreen } from '../common/components/ErrorBoundary';
// import LogsScreen from '../logs/LogsScreen';
import DeleteChannelScreen from '../settings/screens/DeleteChannelScreen';
import DiscoveryFeedScreen from '../discovery/DiscoveryFeedScreen';
import Gathering from '../gathering/Gathering';
import OnboardingScreenNew from '../onboarding/OnboardingScreenNew';
import EmailConfirmationScreen from '../onboarding/EmailConfirmationScreen';
import featuresService from '../common/services/features.service';
import ThemedStyles from '../styles/ThemedStyles';
import MessengerScreen from '../messenger/MessengerScreen';
import Topbar from '../topbar/Topbar';
import i18n from '../common/services/i18n.service';

const hideHeader = { headerShown: false };
const messengerOptions = { title: 'Messenger' };
const discoveryOptions = ({ route }) => ({ title: route.params.title || '' });
const activityOptions = ({ route }) => ({
  title: route.params.entity ? route.params.entity.ownerObj.name : '',
});

const AppStackNav = createNativeStackNavigator();
const AuthStackNav = createNativeStackNavigator();
const RootStackNav = createNativeStackNavigator();

const AppStack = function(props) {
  return (
    <AppStackNav.Navigator
      screenOptions={{
        title: '',
        ...ThemedStyles.defaultScreenOptions,
      }}>
      <AppStackNav.Screen
        name="Tabs"
        component={TabsScreenNew}
        options={hideHeader}
        // component={TabsScreen}
        // options={({ navigation, route }) => ({
        //   header: props => <Topbar {...props} />,
        // })}
      />
      <AppStackNav.Screen
        name="EmailConfirmation"
        component={EmailConfirmationScreen}
      />
      <AppStackNav.Screen name="Update" component={UpdatingScreen} />
      <AppStackNav.Screen
        name="Boost"
        component={BoostScreen}
        options={{ gesturesEnabled: false }}
      />
      <AppStackNav.Screen
        name="DeleteChannel"
        component={DeleteChannelScreen}
      />
      <AppStackNav.Screen
        name="Notifications"
        component={NotificationsScreen}
      />
      <AppStackNav.Screen
        name="NotificationsSettings"
        component={NotificationsSettingsScreen}
      />
      <AppStackNav.Screen
        name="Channel"
        component={ChannelScreen}
        options={hideHeader}
      />
      <AppStackNav.Screen
        name="Capture"
        component={CapturePoster}
        options={{ title: '' }}
      />
      <AppStackNav.Screen
        name="Activity"
        component={ActivityScreen}
        options={activityOptions}
      />
      <AppStackNav.Screen name="Conversation" component={ConversationScreen} />
      <AppStackNav.Screen
        name="DiscoveryFeed"
        component={DiscoveryFeedScreen}
        options={discoveryOptions}
      />
      <AppStackNav.Screen name="Subscribers" component={ChannelSubscribers} />
      <AppStackNav.Screen name="Settings" component={SettingsScreen} />
      <AppStackNav.Screen
        name="SettingsBlockedChannels"
        component={BlockedChannelsScreen}
      />
      <AppStackNav.Screen name="SettingsEmail" component={EmailScreen} />
      <AppStackNav.Screen name="SettingsPassword" component={PasswordScreen} />
      <AppStackNav.Screen name="SettingsRekey" component={RekeyScreen} />
      <AppStackNav.Screen name="SettingsBilling" component={BillingScreen} />
      <AppStackNav.Screen
        name="GroupsList"
        component={GroupsListScreen}
        options={{ title: i18n.t('discovery.groups') }}
      />
      <AppStackNav.Screen
        name="GroupView"
        component={GroupViewScreen}
        options={hideHeader}
      />
      <AppStackNav.Screen name="Wallet" component={WalletScreen} />
      <AppStackNav.Screen
        name="BlogList"
        component={BlogsListScreen}
        options={{ title: i18n.t('blogs.blogs') }}
      />
      <AppStackNav.Screen
        name="BoostConsole"
        component={BoostConsoleScreen}
        options={{ title: i18n.t('boost') }}
      />
      <AppStackNav.Screen
        name="BlogView"
        component={BlogsViewScreen}
        options={hideHeader}
      />
      <AppStackNav.Screen
        name="WireFab"
        component={FabScreen}
        options={hideHeader}
      />
      <AppStackNav.Screen
        name="WalletHistory"
        component={WalletHistoryScreen}
      />
      <AppStackNav.Screen name="ViewImage" component={ViewImageScreen} />
      <AppStackNav.Screen
        name="BlockchainWallet"
        component={BlockchainWalletScreen}
        options={{ title: i18n.t('blockchain.walletAddresses') }}
      />
      <AppStackNav.Screen
        name="Contributions"
        component={ContributionsScreen}
        options={{ title: i18n.t('wallet.contributionsTitle') }}
      />
      <AppStackNav.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{ title: i18n.t('wallet.transactionsTitle') }}
      />
      <AppStackNav.Screen
        name="BlockchainWalletModal"
        component={BlockchainWalletModalScreen}
        options={{ gesturesEnabled: false }}
      />
      <AppStackNav.Screen
        name="BlockchainWalletImport"
        component={BlockchainWalletImportScreen}
      />
      <AppStackNav.Screen
        name="BlockchainWalletDetails"
        component={BlockchainWalletDetailsScreen}
      />
      <AppStackNav.Screen
        name="Report"
        component={ReportScreen}
        options={{ title: i18n.t('report') }}
      />
      <AppStackNav.Screen
        name="More"
        component={MoreScreen}
        options={{ title: i18n.t('report') }}
      />
      <AppStackNav.Screen name="Withdraw" component={WithdrawScreen} />
      <AppStackNav.Screen
        name="WalletOnboarding"
        component={WalletOnboardingScreen}
        options={{ title: 'Wallet' }}
      />
      <AppStackNav.Screen name="NotSupported" component={NotSupportedScreen} />
      <AppStackNav.Screen
        name="OnboardingScreen"
        component={OnboardingScreen}
      />
      <AppStackNav.Screen
        name="OnboardingScreenNew"
        component={OnboardingScreenNew}
        options={hideHeader}
      />
      <AppStackNav.Screen
        name="Messenger"
        component={MessengerScreen}
        options={messengerOptions}
      />
    </AppStackNav.Navigator>
  );
};

const AuthStack = function(props) {
  return (
    <AuthStackNav.Navigator>
      <AuthStackNav.Screen
        name="Login"
        component={LoginScreen}
        options={hideHeader}
      />
      <AuthStackNav.Screen
        name="Forgot"
        component={ForgotScreen}
        options={hideHeader}
      />
      <AuthStackNav.Screen
        name="Register"
        component={RegisterScreen}
        options={hideHeader}
      />
    </AuthStackNav.Navigator>
  );
};

const RootStack = function(props) {
  const initial = props.isLoggedIn ? 'App' : 'Auth';

  return (
    <RootStackNav.Navigator
      initialRouteName={initial}
      screenOptions={{
        headerShown: false,
        ...ThemedStyles.defaultScreenOptions,
      }}>
      {props.isLoggedIn ? (
        <Fragment>
          <RootStackNav.Screen name="App" component={AppStack} />
          <RootStackNav.Screen name="Gathering" component={Gathering} />
        </Fragment>
      ) : (
        <RootStackNav.Screen name="Auth" component={AuthStack} />
      )}
    </RootStackNav.Navigator>
  );
};

export default RootStack;
