import React, { Fragment } from 'react';

import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from 'react-native-screens/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

import LoginScreen from '../auth/LoginScreen';
import ForgotScreen from '../auth/ForgotScreen';
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
import MoreScreen from '../tabs/MoreScreen';
import NotSupportedScreen from '../static-views/NotSupportedScreen';
import OnboardingScreen from '../onboarding/OnboardingScreen';
import UpdatingScreen from '../update/UpdateScreen';
import { DiscoverySearchScreen } from '../discovery/v2/search/DiscoverySearchScreen';
import Gathering from '../gathering/Gathering';
import EmailConfirmationScreen from '../onboarding/EmailConfirmationScreen';
import ThemedStyles from '../styles/ThemedStyles';
import MessengerScreen from '../messenger/MessengerScreen';
import i18n from '../common/services/i18n.service';
import ComposeScreen from '../compose/ComposeScreen';
import TagSelector from '../compose/TagSelector';
import NsfwSelector from '../compose/NsfwSelector';
import ScheduleSelector from '../compose/ScheduleSelector';
import MonetizeSelector from '../compose/MonetizeSelector';
import LicenseSelector from '../compose/LicenseSelector';
import ChannelScreenV2 from '../channel/v2/ChannelScreen';

import {
  RootStackParamList,
  AuthStackParamList,
  AppStackParamList,
  MainSwiperParamList,
} from './NavigationTypes';
import EditChannelStack from '../channel/v2/edit/EditChannelStack';
import ReceiverAddressScreen from '../wallet/v2/address/ReceiverAddressScreen';
import LearnMoreScreen from '../wallet/v2/LearnMoreScreen';
import BtcReceiverAddressScreen from '../wallet/v2/address/BtcAddressScreen';
import BankInfoScreen from '../wallet/v2/address/BankInfoScreen';
import ViewerScreen from '../discovery/v2/viewer/ViewerScreen';

const hideHeader: NativeStackNavigationOptions = { headerShown: false };
const messengerOptions = { title: 'Messenger' };
const captureOptions = {
  title: '',
  stackAnimation: 'fade',
  headerShown: false,
} as NativeStackNavigationOptions;

const activityOptions = ({ route }) => ({
  title: route.params.entity ? route.params.entity.ownerObj.name : '',
});

const AppStackNav = createNativeStackNavigator<AppStackParamList>();
const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();
const RootStackNav = createNativeStackNavigator<RootStackParamList>();
const MainSwiper = createMaterialTopTabNavigator<MainSwiperParamList>();

const FullScreenPostStackNav = createSharedElementStackNavigator();

const FullScreenPostStack = () => (
  <FullScreenPostStackNav.Navigator>
    <FullScreenPostStackNav.Screen
      name="ActivityFullScreen"
      component={ViewerScreen}
      options={{ stackAnimation: 'none', ...hideHeader, title: '' }}
    />
    <FullScreenPostStackNav.Screen
      name="ViewImage"
      component={ViewImageScreen}
      options={({ route }) => ({
        title: route.params.entity.ownerObj.name,
        headerStyle: {
          backgroundColor: '#000',
        },
      })}
    />
  </FullScreenPostStackNav.Navigator>
);

// Main navigation swiper
const MainSwiperScreen = () => {
  return (
    <MainSwiper.Navigator
      initialRouteName="Tabs"
      lazy={true}
      tabBar={() => null}
      screenOptions={ThemedStyles.defaultScreenOptions}>
      <MainSwiper.Screen
        name="Capture"
        component={ComposeScreen}
        options={captureOptions}
      />
      <MainSwiper.Screen
        name="Tabs"
        component={TabsScreen}
        options={hideHeader}
      />
      <MainSwiper.Screen
        name="Messenger"
        component={MessengerScreen}
        options={messengerOptions}
      />
    </MainSwiper.Navigator>
  );
};

const AppStack = function () {
  const EditChannelScreens = EditChannelStack(AppStackNav);
  return (
    <AppStackNav.Navigator screenOptions={ThemedStyles.defaultScreenOptions}>
      <AppStackNav.Screen
        name="Main"
        component={MainSwiperScreen}
        options={hideHeader}
      />
      <AppStackNav.Screen
        name="ActivityFullScreenNav"
        component={FullScreenPostStack}
        options={{ stackAnimation: 'none', ...hideHeader }}
      />
      <AppStackNav.Screen
        name="StackCapture"
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
        name="ScheduleSelector"
        component={ScheduleSelector}
        options={hideHeader}
      />
      <AppStackNav.Screen
        name="MonetizeSelector"
        component={MonetizeSelector}
        options={hideHeader}
      />
      <AppStackNav.Screen
        name="LicenseSelector"
        component={LicenseSelector}
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
        options={activityOptions}
      />
      <AppStackNav.Screen name="Conversation" component={ConversationScreen} />
      <AppStackNav.Screen
        name="DiscoverySearch"
        component={DiscoverySearchScreen}
      />
      <AppStackNav.Screen name="Subscribers" component={ChannelSubscribers} />
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
        name="BlockchainWalletModal"
        component={BlockchainWalletModalScreen}
        options={{ gestureEnabled: false }}
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
      <AppStackNav.Screen name="NotSupported" component={NotSupportedScreen} />
      <AppStackNav.Screen
        name="OnboardingScreen"
        component={OnboardingScreen}
        options={hideHeader}
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
    </AppStackNav.Navigator>
  );
};

const AuthStack = function () {
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

const RootStack = function (props) {
  const initial = props.isLoggedIn ? 'App' : 'Auth';

  return (
    <RootStackNav.Navigator
      initialRouteName={initial}
      // mode="modal"
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
