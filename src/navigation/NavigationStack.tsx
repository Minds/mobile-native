import React, { Fragment } from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from 'react-native-screens/native-stack';
import { useDimensions } from '@react-native-community/hooks';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Platform, StatusBar, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AnalyticsScreen from '../analytics/AnalyticsScreen';

import LoginScreen from '../auth/LoginScreen';
import ForgotScreen from '../auth/ForgotScreen';
import ReferralsScreen from '../referral/ReferralsScreen';
import DataSaverScreen from '../settings/screens/DataSaverScreen';
import TabsScreen from '../tabs/TabsScreen';
import NotificationsScreen from '../notifications/NotificationsScreen';
import ActivityScreen from '../newsfeed/ActivityScreen';
import ChannelSubscribers from '../channel/subscribers/ChannelSubscribers';
import RegisterScreen from '../auth/RegisterScreen';
import ConversationScreen from '../messenger/ConversationScreen';
import GroupsListScreen from '../groups/GroupsListScreen';
import GroupViewScreen from '../groups/GroupViewScreen';
import BoostConsoleScreen from '../boost/BoostConsoleScreen';
import BlogsListScreen from '../blogs/BlogsListScreen';
import BlogsViewScreen from '../blogs/BlogsViewScreen';
import FabScreenV2 from '../wire/v2/FabScreen';
import ViewImageScreen from '../media/ViewImageScreen';
import BoostScreen from '../boost/creator/BoostScreen';
import BlockchainWalletScreen from '../blockchain/wallet/BlockchainWalletScreen';
import BlockchainWalletModalScreen from '../blockchain/wallet/modal/BlockchainWalletModalScreen';
import BlockchainWalletImportScreen from '../blockchain/wallet/import/BlockchainWalletImportScreen';
import BlockchainWalletDetailsScreen from '../blockchain/wallet/details/BlockchainWalletDetailsScreen';
import ReportScreen from '../report/ReportScreen';
import NotSupportedScreen from '../static-views/NotSupportedScreen';
// import OnboardingScreen from '../onboarding/OnboardingScreen';
import UpdatingScreen from '../update/UpdateScreen';
import { DiscoverySearchScreen } from '../discovery/v2/search/DiscoverySearchScreen';
// import Gathering from '../gathering/Gathering';
import EmailConfirmationScreen from '../onboarding/EmailConfirmationScreen';
import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';
import ComposeScreen from '../compose/ComposeScreen';
import TagSelector from '../compose/TagSelector';
import AccessSelector from '../compose/AccessSelector';
import NsfwSelector from '../compose/NsfwSelector';
import ScheduleSelector from '../compose/ScheduleSelector';
import PermawebSelector from '../compose/PermawebSelector';
import MonetizeSelector from '../compose/MonetizeSelector';
import MonetizeScreen from '../compose/monetize/MonetizeScreeen';
import LicenseSelector from '../compose/LicenseSelector';
import ChannelScreenV2 from '../channel/v2/ChannelScreen';
import SettingsScreen from '../settings/SettingsScreen';
import OtherScreen from '../settings/screens/OtherScreen';
import EmailScreen from '../settings/screens/EmailScreen';
import EditChannelStack from '../channel/v2/edit/EditChannelStack';
import ReceiverAddressScreen from '../wallet/v2/address/ReceiverAddressScreen';
import LearnMoreScreen from '../wallet/v2/LearnMoreScreen';
import BtcReceiverAddressScreen from '../wallet/v2/address/BtcAddressScreen';
import BankInfoScreen from '../wallet/v2/address/BankInfoScreen';
import ViewerScreen from '../discovery/v2/viewer/ViewerScreen';
import PlusMonetizeScreen from '../compose/monetize/PlusMonetizeScreeen';
import MembershipMonetizeScreeen from '../compose/monetize/MembershipMonetizeScreeen';
import CustomMonetizeScreen from '../compose/monetize/CustomMonetizeScreeen';
import TierScreen from '../settings/screens/TierScreen';
import PlusScreen from '../common/components/PlusScreen';
import PlusDiscoveryScreen from '../discovery/v2/PlusDiscoveryScreen';
import featuresService from '../common/services/features.service';
import JoinMembershipScreen from '../wire/v2/tiers/JoinMembershipScreen';

import {
  RootStackParamList,
  AuthStackParamList,
  AppStackParamList,
  DrawerParamList,
  ActivityFullScreenParamList,
  InternalStackParamList,
} from './NavigationTypes';

import Drawer from './Drawer';
import OptionsDrawer from '../common/components/OptionsDrawer';
import PasswordScreen from '../settings/screens/PasswordScreen';
import NotificationsSettingsScreen from '../notifications/NotificationsSettingsScreen';
import BlockedChannelsScreen from '../settings/screens/blocked/BlockedChannelsScreen';
import TierManagementScreen from '../common/components/tier-management/TierManagementScreen';
import DeleteChannelScreen from '../settings/screens/DeleteChannelScreen';
import DeactivateChannelScreen from '../settings/screens/DeactivateChannelScreen';
import LanguageScreen from '../settings/screens/LanguageScreen';
import NSFWScreen from '../settings/screens/NSFWScreen';
import MessengerSettingsScreen from '../settings/screens/MessengerScreen';
import DevicesScreen from '../settings/screens/DevicesScreen';
import BillingScreen from '../settings/screens/BillingScreen';
import RecurringPayments from '../settings/screens/RecurringPayments';
import ReportedContentScreen from '../report/ReportedContentScreen';
import AppInfoScreen from '../settings/screens/AppInfoScreen';
import WalletScreen from '../wallet/v2/WalletScreen';
import ModalTransition from './ModalTransition';
import AuthTransition from './AuthTransition';
import VideoBackground from '../common/components/VideoBackground';
import TransparentLayer from '../common/components/TransparentLayer';
import PortraitViewerScreen from '../portrait/PortraitViewerScreen';
import { portraitBarRef } from '../portrait/PortraitContentBar';
import OnboardingScreen from '../onboarding/v2/OnboardingScreen';
import VerifyEmailScreen from '../onboarding/v2/steps/VerifyEmailScreen';
import SelectHashtagsScreen from '../onboarding/v2/steps/SelectHashtagsScreen';
import SetupChannelScreen from '../onboarding/v2/steps/SetupChannelScreen';
import VerifyUniquenessScreen from '../onboarding/v2/steps/VerifyUniquenessScreen';
import PhoneValidationScreen from '../onboarding/v2/steps/PhoneValidationScreen';
import AutoplaySettingsScreen from '../settings/screens/AutoplaySettingsScreen';
import SuggestedChannelsScreen from '../onboarding/v2/steps/SuggestedChannelsScreen';
import SuggestedGroupsScreen from '../onboarding/v2/steps/SuggestedGroupsScreen';

const isIos = Platform.OS === 'ios';

const hideHeader: NativeStackNavigationOptions = { headerShown: false };
const captureOptions = {
  title: '',
  stackAnimation: 'fade',
  headerShown: false,
} as NativeStackNavigationOptions;

const AppStackNav = createNativeStackNavigator<AppStackParamList>();
const AuthStackNav = createStackNavigator<AuthStackParamList>();
const RootStackNav = createStackNavigator<RootStackParamList>();
const InternalStackNav = createNativeStackNavigator<InternalStackParamList>();
// const MainSwiper = createMaterialTopTabNavigator<MainSwiperParamList>();
const DrawerNav = createDrawerNavigator<DrawerParamList>();

const FullScreenPostStackNav = createSharedElementStackNavigator<
  ActivityFullScreenParamList
>();

const FullScreenPostStack = () => (
  <FullScreenPostStackNav.Navigator>
    <FullScreenPostStackNav.Screen
      name="ActivityFullScreen"
      component={ViewerScreen}
      options={{ stackAnimation: 'none', ...hideHeader, title: '' }}
    />
    <FullScreenPostStackNav.Screen
      name="PortraitViewerScreen"
      component={PortraitViewerScreen}
      options={{ stackAnimation: 'none', ...hideHeader, title: '' }}
    />
    <FullScreenPostStackNav.Screen
      name="ViewImage"
      component={ViewImageScreen}
      options={({ route }: { route: any }) => ({
        title: route.params.entity.ownerObj.name,
        headerStyle: {
          backgroundColor: '#000',
        },
      })}
    />
  </FullScreenPostStackNav.Navigator>
);

const AccountScreenOptions = (navigation) => [
  {
    title: i18n.t('settings.accountOptions.1'),
    onPress: () => navigation.push('SettingsEmail'),
  },
  {
    title: i18n.t('settings.accountOptions.2'),
    onPress: () => navigation.push('LanguageScreen'),
  },
  {
    title: i18n.t('settings.accountOptions.3'),
    onPress: () => navigation.push('SettingsPassword'),
  },
  {
    title: i18n.t('settings.accountOptions.4'),
    onPress: () => navigation.push('SettingsNotifications'),
  },
  Platform.OS !== 'ios'
    ? {
        title: i18n.t('settings.accountOptions.5'),
        onPress: () => navigation.push('NSFWScreen'),
      }
    : null,
  {
    title: i18n.t('settings.accountOptions.6'),
    onPress: () => navigation.push('MessengerSettingsScreen'),
  },
  {
    title: i18n.t('settings.accountOptions.7'),
    onPress: () => navigation.push('AutoplaySettingsScreen'),
  },
];

const SecurityScreenOptions = (navigation) => [
  {
    title: i18n.t('settings.securityOptions.2'),
    onPress: () => navigation.push('DevicesScreen'),
  },
];

let BillingScreenOptions;
if (!isIos) {
  BillingScreenOptions = (navigation) => [
    {
      title: i18n.t('settings.billingOptions.1'),
      onPress: () => navigation.push('PaymentMethods'),
    },
    {
      title: i18n.t('settings.billingOptions.2'),
      onPress: () => navigation.push('RecurringPayments'),
    },
  ];
} else {
  BillingScreenOptions = (navigation) => [
    {
      title: i18n.t('settings.billingOptions.2'),
      onPress: () => navigation.push('RecurringPayments'),
    },
  ];
}

const WalletOptions = () => ({
  title: i18n.t('wallet.wallet'),
  headerShown: false,
});

const modalOptions = {
  gestureResponseDistance: { vertical: 240 },
  gestureEnabled: true,
};

export const InternalStack = () => {
  const internalOptions = {
    ...ThemedStyles.defaultScreenOptions,
    headerShown: false,
    stackAnimation: 'none',
  } as NativeStackNavigationOptions;
  return (
    <InternalStackNav.Navigator screenOptions={internalOptions}>
      <InternalStackNav.Screen
        name="PlusDiscoveryScreen"
        component={PlusDiscoveryScreen}
        options={{ title: i18n.t('plusTabTitleDiscovery') }}
      />
      <InternalStackNav.Screen
        name="Wallet"
        component={WalletScreen}
        options={WalletOptions}
      />
      <InternalStackNav.Screen
        name="GroupsList"
        component={GroupsListScreen}
        options={{ title: i18n.t('discovery.groups') }}
      />
      <InternalStackNav.Screen name="Analytics" component={AnalyticsScreen} />
      <InternalStackNav.Screen name="Onboarding" component={OnboardingScreen} />

      <InternalStackNav.Screen name="Settings" component={SettingsScreen} />
    </InternalStackNav.Navigator>
  );
};

const MainScreen = () => {
  const dimensions = useDimensions().window;

  const isLargeScreen = dimensions.width >= 600;
  return (
    <DrawerNav.Navigator
      initialRouteName="Tabs"
      gestureHandlerProps={{
        hitSlop: { left: 0, width: dimensions.width },
        //@ts-ignore
        waitFor: portraitBarRef,
      }}
      drawerType="slide"
      drawerContent={Drawer}
      drawerStyle={isLargeScreen ? null : ThemedStyles.style.width90}>
      <DrawerNav.Screen
        name="Tabs"
        component={TabsScreen}
        options={hideHeader}
      />
    </DrawerNav.Navigator>
  );
};

const AppStack = function () {
  const EditChannelScreens = EditChannelStack(AppStackNav);
  return (
    <AppStackNav.Navigator screenOptions={ThemedStyles.defaultScreenOptions}>
      <AppStackNav.Screen
        name="Main"
        component={MainScreen}
        options={hideHeader}
      />
      <AppStackNav.Screen
        name="ActivityFullScreenNav"
        component={FullScreenPostStack}
        options={{ stackAnimation: 'none', ...hideHeader }}
      />
      <AppStackNav.Screen
        name="Capture"
        component={ComposeScreen}
        options={captureOptions}
      />
      <AppStackNav.Screen
        name="TagSelector"
        component={TagSelector}
        options={hideHeader}
      />
      <AppStackNav.Screen
        name="NsfwSelector"
        component={NsfwSelector}
        options={hideHeader}
      />
      <AppStackNav.Screen
        name="PermawebSelector"
        component={PermawebSelector}
        options={hideHeader}
      />
      <AppStackNav.Screen
        name="ScheduleSelector"
        component={ScheduleSelector}
        options={hideHeader}
      />
      <AppStackNav.Screen
        name="MonetizeSelector"
        component={
          featuresService.has('paywall-2020')
            ? MonetizeScreen
            : MonetizeSelector
        }
        options={hideHeader}
      />
      <AppStackNav.Screen
        name="PlusMonetize"
        component={PlusMonetizeScreen}
        options={hideHeader}
      />
      <AppStackNav.Screen
        name="MembershipMonetize"
        component={MembershipMonetizeScreeen}
        options={hideHeader}
      />
      <AppStackNav.Screen
        name="CustomMonetize"
        component={CustomMonetizeScreen}
        options={hideHeader}
      />
      <AppStackNav.Screen
        name="LicenseSelector"
        component={LicenseSelector}
        options={hideHeader}
      />
      <AppStackNav.Screen
        name="AccessSelector"
        component={AccessSelector}
        options={hideHeader}
      />
      <AppStackNav.Screen
        name="EmailConfirmation"
        component={EmailConfirmationScreen}
      />
      <AppStackNav.Screen name="Update" component={UpdatingScreen} />
      <AppStackNav.Screen
        name="Boost"
        component={BoostScreen}
        options={{ gestureEnabled: false }}
      />
      <AppStackNav.Screen
        name="Notifications"
        component={NotificationsScreen}
      />
      <AppStackNav.Screen
        name="Channel"
        component={ChannelScreenV2}
        options={hideHeader}
      />
      {EditChannelScreens}
      <AppStackNav.Screen
        name="Activity"
        component={ActivityScreen}
        options={hideHeader}
      />
      <AppStackNav.Screen name="Conversation" component={ConversationScreen} />
      <AppStackNav.Screen
        name="DiscoverySearch"
        component={DiscoverySearchScreen}
      />
      <AppStackNav.Screen name="Subscribers" component={ChannelSubscribers} />
      <AppStackNav.Screen
        name="GroupView"
        component={GroupViewScreen}
        options={hideHeader}
      />
      <AppStackNav.Screen
        name="BlogList"
        component={BlogsListScreen}
        options={{ title: i18n.t('blogs.blogs') }}
      />
      <AppStackNav.Screen
        name="BlogView"
        component={BlogsViewScreen}
        options={hideHeader}
      />
      <AppStackNav.Screen
        name="WireFab"
        component={FabScreenV2}
        options={hideHeader}
      />
      <AppStackNav.Screen
        name="ViewImage"
        component={ViewImageScreen}
        options={{
          headerStyle: {
            backgroundColor: '#000',
          },
        }}
      />
      <AppStackNav.Screen
        name="BlockchainWallet"
        component={BlockchainWalletScreen}
        options={BlockchainWalletScreen.navigationOptions}
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
      <AppStackNav.Screen name="NotSupported" component={NotSupportedScreen} />
      <AppStackNav.Screen
        name="OnboardingScreen"
        component={OnboardingScreen}
        options={hideHeader}
      />
      <AppStackNav.Screen
        name="TierScreen"
        component={TierScreen}
        options={{ title: 'Tier Management' }}
      />
      <AppStackNav.Screen
        name="LearnMoreScreen"
        component={LearnMoreScreen}
        options={{
          title: i18n.t('wallet.learnMore.title'),
          headerStyle: {
            backgroundColor: ThemedStyles.getColor('primary_background'),
          },
          headerHideShadow: true,
        }}
      />
      <AppStackNav.Screen
        name="ReceiverAddressScreen"
        component={ReceiverAddressScreen}
        options={{
          title: 'Receiver Address',
          headerStyle: {
            backgroundColor: ThemedStyles.getColor('primary_background'),
          },
          headerHideShadow: true,
        }}
      />
      <AppStackNav.Screen
        name="BtcAddressScreen"
        component={BtcReceiverAddressScreen}
        options={{
          title: i18n.t('wallet.bitcoins.update'),
          headerStyle: {
            backgroundColor: ThemedStyles.getColor('primary_background'),
          },
          headerHideShadow: true,
        }}
      />
      <AppStackNav.Screen
        name="BankInfoScreen"
        component={BankInfoScreen}
        options={{
          title: i18n.t('wallet.bank.title'),
          headerStyle: {
            backgroundColor: ThemedStyles.getColor('primary_background'),
          },
          headerHideShadow: true,
        }}
      />
      <AppStackNav.Screen
        name="Account"
        component={OptionsDrawer}
        options={{
          title: i18n.t('settings.account'),
        }}
        initialParams={{ options: AccountScreenOptions }}
      />
      <AppStackNav.Screen
        name="Security"
        component={OptionsDrawer}
        options={{ title: i18n.t('settings.security') }}
        initialParams={{ options: SecurityScreenOptions }}
      />
      <AppStackNav.Screen
        name="Billing"
        component={OptionsDrawer}
        options={{ title: i18n.t('settings.billing') }}
        initialParams={{ options: BillingScreenOptions }}
      />
      <AppStackNav.Screen
        name="Referrals"
        component={ReferralsScreen}
        options={{ title: i18n.t('settings.referrals') }}
      />
      <AppStackNav.Screen
        name="BoostConsole"
        component={BoostConsoleScreen}
        options={{ title: i18n.t('boost') }}
      />
      <AppStackNav.Screen
        name="Other"
        component={OtherScreen}
        options={{ title: i18n.t('settings.other') }}
      />
      <AppStackNav.Screen
        name="SettingsEmail"
        component={EmailScreen}
        options={{ title: i18n.t('settings.accountOptions.1') }}
      />
      <AppStackNav.Screen
        name="SettingsPassword"
        component={PasswordScreen}
        options={{ title: i18n.t('settings.accountOptions.3') }}
      />
      <AppStackNav.Screen
        name="SettingsNotifications"
        component={NotificationsSettingsScreen}
        options={{ title: i18n.t('settings.pushNotification') }}
      />
      <AppStackNav.Screen
        name="DataSaverScreen"
        component={DataSaverScreen}
        options={{ title: i18n.t('settings.networkOptions.1') }}
      />
      <AppStackNav.Screen
        name="BlockedChannels"
        component={BlockedChannelsScreen}
        options={{ title: i18n.t('settings.blockedChannels') }}
      />
      <AppStackNav.Screen
        name="TierManagementScreen"
        component={TierManagementScreen}
        options={{ title: i18n.t('settings.otherOptions.b1') }}
        initialParams={{ useForSelection: false }}
      />
      <AppStackNav.Screen
        name="DeleteChannel"
        component={DeleteChannelScreen}
      />
      <AppStackNav.Screen
        name="DeactivateChannel"
        component={DeactivateChannelScreen}
      />
      <AppStackNav.Screen
        name="LanguageScreen"
        component={LanguageScreen}
        options={{ title: i18n.t('settings.accountOptions.2') }}
      />
      <AppStackNav.Screen
        name="NSFWScreen"
        component={NSFWScreen}
        options={{ title: i18n.t('settings.accountOptions.5') }}
      />
      <AppStackNav.Screen
        name="MessengerSettingsScreen"
        component={MessengerSettingsScreen}
        options={{ title: i18n.t('settings.accountOptions.6') }}
      />
      <AppStackNav.Screen
        name="AutoplaySettingsScreen"
        component={AutoplaySettingsScreen}
        options={{ title: i18n.t('settings.accountOptions.7') }}
      />
      <AppStackNav.Screen
        name="DevicesScreen"
        component={DevicesScreen}
        options={{ title: i18n.t('settings.securityOptions.2') }}
      />
      {Platform.OS !== 'ios' && (
        <AppStackNav.Screen
          name="PaymentMethods"
          component={BillingScreen}
          options={{ title: i18n.t('settings.billingOptions.1') }}
        />
      )}
      {Platform.OS !== 'ios' && (
        <AppStackNav.Screen
          name="RecurringPayments"
          component={RecurringPayments}
          options={{ title: i18n.t('settings.billingOptions.2') }}
        />
      )}
      <AppStackNav.Screen
        name="ReportedContent"
        component={ReportedContentScreen}
        options={{ title: i18n.t('settings.otherOptions.a1') }}
      />
      <AppStackNav.Screen name="AppInfo" component={AppInfoScreen} />
    </AppStackNav.Navigator>
  );
};

const AuthStack = function () {
  return (
    <View style={ThemedStyles.style.flexContainer}>
      <StatusBar barStyle={'light-content'} backgroundColor="#000000" />
      <VideoBackground source={require('../assets/videos/minds-loop.mp4')} />
      <TransparentLayer />
      <AuthStackNav.Navigator
        headerMode="none"
        // @ts-ignore
        screenOptions={AuthTransition}>
        <AuthStackNav.Screen name="Login" component={LoginScreen} />
        <AuthStackNav.Screen name="Forgot" component={ForgotScreen} />
        <AuthStackNav.Screen name="Register" component={RegisterScreen} />
      </AuthStackNav.Navigator>
    </View>
  );
};

const RootStack = function (props) {
  const initial = props.isLoggedIn ? 'App' : 'Auth';

  return (
    <RootStackNav.Navigator
      initialRouteName={initial}
      mode="modal"
      keyboardHandlingEnabled={false}
      // @ts-ignore
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
        gestureEnabled: false,
        ...ModalTransition,
        cardOverlayEnabled: true,
      }}>
      {props.isLoggedIn ? (
        <Fragment>
          <RootStackNav.Screen name="App" component={AppStack} />
          {/* <RootStackNav.Screen name="Gathering" component={Gathering} /> */}
          {/* Modal screens here */}
          <RootStackNav.Screen
            name="JoinMembershipScreen"
            component={JoinMembershipScreen}
            options={modalOptions}
          />
          <RootStackNav.Screen
            name="BlockchainWalletModal"
            component={BlockchainWalletModalScreen}
          />
          <RootStackNav.Screen
            name="PlusScreen"
            component={PlusScreen}
            options={modalOptions}
          />
          <RootStackNav.Screen
            name="VerifyEmail"
            component={VerifyEmailScreen}
            options={modalOptions}
          />
          <RootStackNav.Screen
            name="SelectHashtags"
            component={SelectHashtagsScreen}
            options={modalOptions}
          />
          <RootStackNav.Screen
            name="SetupChannel"
            component={SetupChannelScreen}
            options={modalOptions}
          />
          <RootStackNav.Screen
            name="VerifyUniqueness"
            component={VerifyUniquenessScreen}
            options={modalOptions}
          />
          <RootStackNav.Screen
            name="SuggestedChannel"
            component={SuggestedChannelsScreen}
            options={modalOptions}
          />
          <RootStackNav.Screen
            name="SuggestedGroups"
            component={SuggestedGroupsScreen}
            options={modalOptions}
          />
          <RootStackNav.Screen
            name="PhoneValidation"
            component={PhoneValidationScreen}
            options={modalOptions}
          />
        </Fragment>
      ) : (
        <>
          <RootStackNav.Screen name="Auth" component={AuthStack} />
        </>
      )}
    </RootStackNav.Navigator>
  );
};

export default RootStack;
