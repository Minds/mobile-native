import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { StatusBar, View } from 'react-native';
import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';

import WelcomeScreen from '../auth/WelcomeScreen';
import MultiUserLoginScreen from '../auth/multi-user/LoginScreen';
import MultiUserRegisterScreen from '../auth/multi-user/RegisterScreen';
import TabsScreen from '../tabs/TabsScreen';
import NotificationsScreen from '../notifications/v3/NotificationsScreen';
import ActivityScreen from '../newsfeed/ActivityScreen';
import ChannelSubscribers from '../channel/subscribers/ChannelSubscribers';
import GroupViewScreen from '../groups/GroupViewScreen';
import BlogsViewScreen from '../blogs/BlogsViewScreen';
import FabScreenV2 from '../wire/v2/FabScreen';
import ViewImageScreen from '../media/ViewImageScreen';
import ReportScreen from '../report/ReportScreen';
import UpdatingScreen from '../update/UpdateScreen';
import EmailConfirmationScreen from '../onboarding/EmailConfirmationScreen';
import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';
import ComposeScreen from '../compose/ComposeScreen';
import CameraScreen from '../compose/CameraScreen';
import ChannelScreenV2 from '../channel/v2/ChannelScreen';
import ReceiverAddressScreen from '../wallet/v2/address/ReceiverAddressScreen';
import BtcReceiverAddressScreen from '../wallet/v2/address/BtcAddressScreen';
import BankInfoScreen from '../wallet/v2/address/BankInfoScreen';
import TierScreen from '../settings/screens/TierScreen';
import UpgradeScreen from '../upgrade/UpgradeScreen';
import JoinMembershipScreen from '../wire/v2/tiers/JoinMembershipScreen';

import {
  AppStackParamList,
  AuthStackParamList,
  InternalStackParamList,
  RootStackParamList,
} from './NavigationTypes';

import ModalTransition from './ModalTransition';
import AuthTransition from './AuthTransition';
import VideoBackground from '../common/components/VideoBackground';
import TransparentLayer from '../common/components/TransparentLayer';
import PortraitViewerScreen from '../portrait/PortraitViewerScreen';
import OnboardingScreen from '../onboarding/v2/OnboardingScreen';
import VerifyEmailScreen from '../onboarding/v2/steps/VerifyEmailScreen';
import SelectHashtagsScreen from '../onboarding/v2/steps/SelectHashtagsScreen';
import SetupChannelScreen from '../onboarding/v2/steps/SetupChannelScreen';
import VerifyUniquenessScreen from '../onboarding/v2/steps/VerifyUniquenessScreen';
import PhoneValidationScreen from '../onboarding/v2/steps/PhoneValidationScreen';
import SuggestedChannelsScreen from '../onboarding/v2/steps/SuggestedChannelsScreen';
import SuggestedGroupsScreen from '../onboarding/v2/steps/SuggestedGroupsScreen';
import BoostChannelScreen from '../boost/v2/BoostChannelScreen';
import BoostPostScreen from '../boost/v2/BoostPostScreen';
import Withdrawal from '../wallet/v3/currency-tabs/tokens/widthdrawal/Withdrawal';
import EarnModal from '../earn/EarnModal';
import SearchScreen from '../topbar/searchbar/SearchScreen';
import PasswordConfirmScreen from '../auth/PasswordConfirmScreen';
import TwoFactorConfirmScreen from '../auth/TwoFactorConfirmScreen';
import RecoveryCodeUsedScreen from '../auth/twoFactorAuth/RecoveryCodeUsedScreen';
import ChannelEditScreen from '../channel/v2/edit/ChannelEditScreen';
import MultiUserScreen from '../auth/multi-user/MultiUserScreen';
import RelogScreen from '../auth/RelogScreen';
import ChooseBrowserModalScreen from '~/settings/screens/ChooseBrowserModalScreen';
import withModalProvider from './withModalProvide';
import { DiscoverySearchScreen } from '~/discovery/v2/search/DiscoverySearchScreen';
import DevToolsScreen from '~/settings/screens/DevToolsScreen';

const hideHeader: NativeStackNavigationOptions = { headerShown: false };

const AppStackNav = createNativeStackNavigator<AppStackParamList>();
const AuthStackNav = createStackNavigator<AuthStackParamList>();
const RootStackNav = createStackNavigator<RootStackParamList>();
const InternalStackNav = createNativeStackNavigator<InternalStackParamList>();
// const MainSwiper = createMaterialTopTabNavigator<MainSwiperParamList>();
// const DrawerNav = createDrawerNavigator<DrawerParamList>();

const modalOptions = {
  gestureResponseDistance: 240,
  gestureEnabled: true,
};

export const InternalStack = () => {
  const internalOptions = {
    ...ThemedStyles.defaultScreenOptions,
    headerShown: false,
    animation: 'none',
  } as NativeStackNavigationOptions;
  return (
    <InternalStackNav.Navigator screenOptions={internalOptions}>
      <InternalStackNav.Screen name="Onboarding" component={OnboardingScreen} />
    </InternalStackNav.Navigator>
  );
};

const TabScreenWithModal = withModalProvider(TabsScreen);
const PortraitViewerScreenWithModal = withModalProvider(PortraitViewerScreen);
const ChannelScreenV2WithModal = withModalProvider(ChannelScreenV2);
const ActivityScreenWithModal = withModalProvider(ActivityScreen);
const GroupViewScreenWithModal = withModalProvider(GroupViewScreen);
const BlogsViewScreenWithModal = withModalProvider(BlogsViewScreen);

const AppStack = function () {
  const statusBarStyle =
    ThemedStyles.theme === 0 ? 'dark-content' : 'light-content';
  return (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={ThemedStyles.getColor('SecondaryBackground')}
      />
      <AppStackNav.Navigator screenOptions={ThemedStyles.defaultScreenOptions}>
        <AppStackNav.Screen
          name="Tabs"
          component={TabScreenWithModal}
          options={hideHeader}
        />
        <AppStackNav.Screen
          name="PortraitViewerScreen"
          component={PortraitViewerScreenWithModal}
          options={{
            animation: 'fade_from_bottom',
            ...hideHeader,
          }}
        />
        <AppStackNav.Screen
          name="EmailConfirmation"
          component={EmailConfirmationScreen}
        />
        <AppStackNav.Screen
          name="Update"
          component={UpdatingScreen}
          options={hideHeader}
        />
        <AppStackNav.Screen
          name="Notifications"
          component={NotificationsScreen}
        />
        <AppStackNav.Screen
          name="Channel"
          component={ChannelScreenV2WithModal}
          options={hideHeader}
        />
        <AppStackNav.Screen
          name="DiscoverySearch"
          component={DiscoverySearchScreen}
        />
        <AppStackNav.Screen
          name="ChannelEdit"
          component={ChannelEditScreen}
          options={{
            headerBackVisible: false,
            animation: 'slide_from_bottom',
            title: i18n.t('channel.editChannel'),
          }}
        />
        <AppStackNav.Screen
          name="Activity"
          component={ActivityScreenWithModal}
          options={hideHeader}
        />
        <AppStackNav.Screen name="Subscribers" component={ChannelSubscribers} />
        <AppStackNav.Screen
          name="GroupView"
          component={GroupViewScreenWithModal}
          options={hideHeader}
        />
        <AppStackNav.Screen
          name="BlogView"
          component={BlogsViewScreenWithModal}
          options={hideHeader}
        />
        <AppStackNav.Screen
          name="WireFab"
          component={FabScreenV2}
          options={hideHeader}
        />
        {/* <AppStackNav.Screen
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
      /> */}
        <AppStackNav.Screen
          name="Report"
          component={ReportScreen}
          options={{ title: i18n.t('report') }}
        />
        <AppStackNav.Screen
          name="TierScreen"
          component={TierScreen}
          options={{ title: 'Tier Management' }}
        />
        <AppStackNav.Screen
          name="ReceiverAddressScreen"
          component={ReceiverAddressScreen}
          options={{
            title: 'Receiver Address',
            headerStyle: {
              backgroundColor: ThemedStyles.getColor('PrimaryBackground'),
            },
            headerShadowVisible: false,
          }}
        />
        <AppStackNav.Screen
          name="BtcAddressScreen"
          component={BtcReceiverAddressScreen}
          options={{
            title: i18n.t('wallet.bitcoins.update'),
            headerStyle: {
              backgroundColor: ThemedStyles.getColor('PrimaryBackground'),
            },
            headerShadowVisible: false,
          }}
        />
        <AppStackNav.Screen
          name="BankInfoScreen"
          component={BankInfoScreen}
          options={{
            title: i18n.t('wallet.bank.title'),
            headerStyle: {
              backgroundColor: ThemedStyles.getColor('PrimaryBackground'),
            },
            headerShadowVisible: false,
          }}
        />
      </AppStackNav.Navigator>
    </>
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
        <AuthStackNav.Screen name="Welcome" component={WelcomeScreen} />
        <AuthStackNav.Screen
          name="TwoFactorConfirmation"
          component={TwoFactorConfirmScreen}
          options={{
            headerMode: 'screen',
            headerShown: false,
            ...modalOptions,
          }}
        />
      </AuthStackNav.Navigator>
    </View>
  );
};

const defaultScreenOptions: StackNavigationOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: 'transparent' },
  gestureEnabled: false,
  keyboardHandlingEnabled: false,
  presentation: 'transparentModal',
  ...ModalTransition,
  cardOverlayEnabled: true,
};

const RootStack = function (props) {
  const initial = props.showAuthNav ? 'Auth' : 'App';

  return (
    <RootStackNav.Navigator
      initialRouteName={initial}
      screenOptions={defaultScreenOptions}>
      {!props.showAuthNav ? (
        <>
          <RootStackNav.Screen
            name="App"
            component={AppStack}
            options={{
              animationEnabled: false,
              cardStyle: ThemedStyles.style.bgPrimaryBackground, // avoid dark fade in android transition
            }}
          />
          <RootStackNav.Screen
            name="Capture"
            component={CameraScreen}
            options={TransitionPresets.RevealFromBottomAndroid}
          />
          <RootStackNav.Screen
            name="Compose"
            component={ComposeScreen}
            options={TransitionPresets.ModalPresentationIOS}
          />
          {/* Modal screens here */}
          <RootStackNav.Screen
            name="MultiUserScreen"
            component={MultiUserScreen}
            options={{
              title: i18n.t('multiUser.switchChannel'),
            }}
          />
          <RootStackNav.Screen
            name="JoinMembershipScreen"
            component={JoinMembershipScreen}
            options={modalOptions}
          />
          <RootStackNav.Screen
            name="ChooseBrowserModal"
            component={ChooseBrowserModalScreen}
            options={modalOptions}
          />
          <RootStackNav.Screen name="ViewImage" component={ViewImageScreen} />
          {/* <RootStackNav.Screen
              name="BlockchainWalletModal"
              component={BlockchainWalletModalScreen}
            /> */}
          <RootStackNav.Screen
            name="UpgradeScreen"
            component={UpgradeScreen}
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
          <RootStackNav.Screen
            name="BoostChannelScreen"
            component={BoostChannelScreen}
            options={modalOptions}
          />
          <RootStackNav.Screen
            name="BoostPostScreen"
            component={BoostPostScreen}
            options={modalOptions}
          />
          <RootStackNav.Screen
            name="WalletWithdrawal"
            component={Withdrawal}
            options={modalOptions}
          />
          <RootStackNav.Screen
            name="EarnModal"
            component={EarnModal}
            options={modalOptions}
          />
          <RootStackNav.Screen name="SearchScreen" component={SearchScreen} />
          <RootStackNav.Screen
            name="PasswordConfirmation"
            component={PasswordConfirmScreen}
            options={modalOptions}
          />
          <RootStackNav.Screen
            name="TwoFactorConfirmation"
            component={TwoFactorConfirmScreen}
            options={modalOptions}
          />
          <RootStackNav.Screen
            name="RecoveryCodeUsedScreen"
            component={RecoveryCodeUsedScreen}
            options={modalOptions}
          />
          <RootStackNav.Screen name="RelogScreen" component={RelogScreen} />
        </>
      ) : (
        <>
          <RootStackNav.Screen name="Auth" component={AuthStack} />
        </>
      )}
      <RootStackNav.Screen
        name="MultiUserLogin"
        component={MultiUserLoginScreen}
        options={modalOptions}
      />
      <RootStackNav.Screen
        name="MultiUserRegister"
        component={MultiUserRegisterScreen}
        options={modalOptions}
      />
      <RootStackNav.Screen
        name="DevTools"
        component={DevToolsScreen}
        options={modalOptions}
      />
    </RootStackNav.Navigator>
  );
};

export default RootStack;
