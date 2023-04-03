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

import TabsScreen from '../tabs/TabsScreen';
import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';

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

import withModalProvider from './withModalProvide';
import { observer } from 'mobx-react';
import sessionService from '~/common/services/session.service';
import { useFeature } from '@growthbook/growthbook-react';
import AuthService from '~/auth/AuthService';
import { isStoryBookOn } from '~/config/Config';
import { ScreenProps, screenProps } from './stack.utils';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { BoostComposerStack } from '~/modules/boost';

const hideHeader: NativeStackNavigationOptions = { headerShown: false };

const AppStackNav = createNativeStackNavigator<AppStackParamList>();
const AuthStackNav = createStackNavigator<AuthStackParamList>();
const RootStackNav = createStackNavigator<RootStackParamList>();
const InternalStackNav = createNativeStackNavigator<InternalStackParamList>();

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
      <InternalStackNav.Screen {...screenProps(selectScreen('Onboarding'))} />
    </InternalStackNav.Navigator>
  );
};

const TabScreenWithModal = withModalProvider(TabsScreen);

const AppStack = observer(() => {
  if (sessionService.switchingAccount) {
    return null;
  }

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
        {appScreens.map(screen => (
          <AppStackNav.Screen {...screenProps(screen)} />
        ))}
      </AppStackNav.Navigator>
    </>
  );
});

const AuthStack = function () {
  return (
    <View style={ThemedStyles.style.flexContainer}>
      <StatusBar barStyle={'light-content'} backgroundColor="#000000" />
      <VideoBackground source={require('../assets/videos/minds-loop.mp4')} />
      <TransparentLayer />
      <AuthStackNav.Navigator
        // @ts-ignore
        screenOptions={AuthTransition}>
        <AuthStackNav.Screen {...screenProps(selectScreen('Welcome'))} />
        <AuthStackNav.Screen
          {...screenProps(selectScreen('TwoFactorConfirmation'))}
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

const RootStack = observer(function () {
  const codeEmailFF = useFeature('minds-3055-email-codes');
  const is_email_confirmed = sessionService.getUser()?.email_confirmed;

  const shouldShowEmailVerification =
    !is_email_confirmed &&
    !sessionService.switchingAccount &&
    codeEmailFF.on &&
    AuthService.justRegistered;

  rootScreens.find(
    screen => screen.name === 'ChooseBrowserModal',
  )!.navigationKey = sessionService.showAuthNav ? 'auth' : 'inApp';
  for (const screen of nextRootScreens) {
    screen.navigationKey = sessionService.showAuthNav ? 'auth' : 'inApp';
  }

  return (
    <RootStackNav.Navigator screenOptions={defaultScreenOptions}>
      {!sessionService.showAuthNav ? (
        isStoryBookOn ? (
          <RootStackNav.Screen {...screenProps(selectScreen('StoryBook'))} />
        ) : shouldShowEmailVerification ? (
          <>
            <RootStackNav.Screen {...screenProps(selectScreen('App'))} />
            <RootStackNav.Screen
              {...screenProps(selectScreen('MultiUserScreen'))}
            />
          </>
        ) : (
          <>
            <RootStackNav.Screen
              name="App"
              component={AppStack}
              options={({ route }) => ({
                // only animate on nested route changes (e.g. CommentBottomSheetModal -> channel)
                animationEnabled: Boolean(route.params),
                cardStyle: ThemedStyles.style.bgPrimaryBackground, // avoid dark fade in android transition
                ...(route.params ? TransitionPresets.SlideFromRightIOS : null),
              })}
            />
            <RootStackNav.Screen
              name="BoostScreenV2"
              component={withErrorBoundaryScreen(BoostComposerStack)}
              options={modalOptions}
            />
            {rootScreens.map(screen => (
              <RootStackNav.Screen {...screenProps(screen)} />
            ))}
          </>
        )
      ) : (
        <RootStackNav.Screen name="Auth" component={AuthStack} />
      )}
      {nextRootScreens.map(screen => (
        <RootStackNav.Screen {...screenProps(screen)} />
      ))}
    </RootStackNav.Navigator>
  );
});

export default RootStack;

const selectScreen = (screenName: string) =>
  namedScreens.filter(s => s.name === screenName)?.[0];

const namedScreens: ScreenProps<string>[] = [
  {
    name: 'Onboarding',
    comp: () => require('~/onboarding/v2/OnboardingScreen').default,
  },
  { name: 'Welcome', comp: () => require('~/auth/WelcomeScreen').default },
  {
    name: 'TwoFactorConfirmation',
    comp: () => require('~/auth/TwoFactorConfirmScreen').default,
    options: {
      ...modalOptions,
      headerMode: 'screen',
      headerShown: false,
      gestureEnabled: false,
    },
  },
  {
    name: 'StoryBook',
    comp: () => require('modules/storybook').default,
    options: {
      title: 'TAMAGUI',
      ...TransitionPresets.RevealFromBottomAndroid,
    },
  },
  {
    initialParams: { mfaType: 'email' },
    name: 'App',
    comp: () => require('~/auth/InitialEmailVerificationScreen').default,
    options: TransitionPresets.RevealFromBottomAndroid,
  },
  {
    name: 'MultiUserScreen',
    comp: () => require('~/auth/multi-user/MultiUserScreen').default,
    options: {
      title: i18n.t('multiUser.switchChannel'),
    },
  },
];

const rootScreens: ScreenProps<string>[] = [
  {
    name: 'Capture',
    comp: () => require('~/compose/CameraScreen').default,
    options: TransitionPresets.RevealFromBottomAndroid,
  },
  {
    name: 'Compose',
    comp: () => require('~/compose/ComposeScreen').default,
    options: TransitionPresets.ModalPresentationIOS,
  },
  {
    name: 'SupermindConfirmation',
    comp: () => require('~/compose/SupermindConfirmation').default,
    options: {
      ...TransitionPresets.ModalPresentationIOS,
      gestureEnabled: true,
    },
  },
  {
    name: 'SupermindCompose',
    comp: () => require('~/compose/SupermindComposeScreen').default,
  },
  /* Modal screens here */
  {
    name: 'MultiUserScreen',
    comp: () => require('~/auth/multi-user/MultiUserScreen').default,
    options: {
      title: i18n.t('multiUser.switchChannel'),
    },
  },
  {
    name: 'JoinMembershipScreen',
    comp: () => require('~/wire/v2/tiers/JoinMembershipScreen').default,
    options: modalOptions,
  },
  {
    // navigationKey: sessionService.showAuthNav ? 'auth' : 'inApp',
    name: 'ChooseBrowserModal',
    comp: () => require('~/settings/screens/ChooseBrowserModalScreen').default,
    options: modalOptions,
  },
  {
    name: 'ImageGallery',
    comp: () => require('~/media/ImageGalleryScreen').default,
  },
  {
    name: 'UpgradeScreen',
    comp: () => require('~/upgrade/UpgradeScreen').default,
    options: modalOptions,
  },
  {
    name: 'VerifyEmail',
    comp: () => require('~/onboarding/v2/steps/VerifyEmailScreen').default,
    options: modalOptions,
  },
  {
    name: 'SelectHashtags',
    comp: () => require('~/onboarding/v2/steps/SelectHashtagsScreen').default,
    options: modalOptions,
  },
  {
    name: 'SetupChannel',
    comp: () => require('~/onboarding/v2/steps/SetupChannelScreen').default,
    options: modalOptions,
  },
  {
    name: 'VerifyUniqueness',
    comp: () => require('~/onboarding/v2/steps/VerifyUniquenessScreen').default,
    options: modalOptions,
  },
  {
    name: 'SuggestedChannel',
    comp: () =>
      require('~/onboarding/v2/steps/SuggestedChannelsScreen').default,
    options: modalOptions,
  },
  {
    name: 'SuggestedGroups',
    comp: () => require('~/onboarding/v2/steps/SuggestedGroupsScreen').default,
    options: modalOptions,
  },
  {
    name: 'PhoneValidation',
    comp: () => require('~/onboarding/v2/steps/PhoneValidationScreen').default,
    options: modalOptions,
  },
  {
    name: 'BoostScreen',
    comp: () => require('~/boost/legacy/BoostScreen').default,
    options: modalOptions,
  },
  {
    name: 'WalletWithdrawal',
    comp: () =>
      require('~/wallet/v3/currency-tabs/tokens/widthdrawal/Withdrawal')
        .default,
    options: modalOptions,
  },
  {
    name: 'EarnModal',
    comp: () => require('~/earn/EarnModal').default,
    options: modalOptions,
  },
  {
    name: 'SearchScreen',
    comp: () => require('~/topbar/searchbar/SearchScreen').default,
  },
  {
    name: 'PasswordConfirmation',
    comp: () => require('~/auth/PasswordConfirmScreen').default,
    options: modalOptions,
  },
  {
    name: 'TwoFactorConfirmation',
    comp: () => require('~/auth/TwoFactorConfirmScreen').default,
    options: { ...modalOptions, gestureEnabled: false },
  },
  {
    name: 'RecoveryCodeUsedScreen',
    comp: () => require('~/auth/twoFactorAuth/RecoveryCodeUsedScreen').default,
    options: modalOptions,
  },
  {
    name: 'RelogScreen',
    comp: () => require('~/auth/RelogScreen').default,
  },
  {
    name: 'TosScreen',
    comp: () => require('~/tos/TosScreen').default,
  },
  {
    name: 'ChannelSelectScreen',
    comp: () =>
      require('../common/components/AutoComplete/ChannelSelectScreen').default,
  },
];

const nextRootScreens: ScreenProps<string>[] = [
  {
    // navigationKey: sessionService.showAuthNav ? 'auth' : 'inApp',
    name: 'MultiUserLogin',
    comp: () => require('~/auth/multi-user/LoginScreen').default,
    options: modalOptions,
  },
  {
    // navigationKey: sessionService.showAuthNav ? 'auth' : 'inApp',
    name: 'MultiUserRegister',
    comp: () => require('~/auth/multi-user/RegisterScreen').default,
    options: modalOptions,
  },
  {
    // navigationKey: sessionService.showAuthNav ? 'auth' : 'inApp',
    name: 'DevTools',
    comp: () => require('~/settings/screens/DevToolsScreen').default,
    options: modalOptions,
  },
  {
    // navigationKey: sessionService.showAuthNav ? 'auth' : 'inApp',
    name: 'ResetPassword',
    comp: () => require('~/auth/reset-password/ResetPasswordScreen').default,
    options: modalOptions,
  },
  {
    // navigationKey: sessionService.showAuthNav ? 'auth' : 'inApp',
    name: 'BottomSheet',
    comp: () =>
      require('../common/components/bottom-sheet/BottomSheetScreen').default,
    options: {
      ...modalOptions,
      cardOverlayEnabled: false,
      animationEnabled: false,
    },
  },
  {
    // navigationKey: sessionService.showAuthNav ? 'auth' : 'inApp',
    name: 'CodePushSync',
    comp: () => require('modules/codepush').CodePushSyncScreen,
    options: {
      ...TransitionPresets.ModalFadeTransition,
      gestureEnabled: false,
    },
  },
];

const appScreens: ScreenProps<string>[] = [
  {
    name: 'WebView',
    comp: () => require('~/common/screens/WebViewScreen').default,
  },
  {
    name: 'PortraitViewerScreen',
    comp: () => require('~/portrait/PortraitViewerScreen').withModal,
    options: {
      animation: 'fade_from_bottom',
      ...hideHeader,
    },
  },
  {
    name: 'EmailConfirmation',
    comp: () => require('~/onboarding/EmailConfirmationScreen').default,
  },
  {
    name: 'Update',
    comp: () => require('~/update/UpdateScreen').default,
    options: hideHeader,
  },
  {
    name: 'Notifications',
    comp: () => require('~/notifications/v3/NotificationsScreen').default,
  },
  {
    name: 'Channel',
    comp: () => require('~/channel/v2/ChannelScreen').withModal,
    options: hideHeader,
  },
  {
    name: 'DiscoverySearch',
    comp: () =>
      require('~/discovery/v2/search/DiscoverySearchScreen')
        .DiscoverySearchScreen,
  },
  {
    name: 'ChannelEdit',
    comp: () => require('~/channel/v2/edit/ChannelEditScreen').default,
    options: {
      headerBackVisible: false,
      animation: 'slide_from_bottom',
      title: i18n.t('channel.editChannel'),
    },
  },
  {
    name: 'Activity',
    comp: () => require('~/newsfeed/ActivityScreen').withModal,
    options: hideHeader,
  },
  {
    name: 'GroupView',
    comp: () => require('~/groups/GroupViewScreen').withModal,
    options: hideHeader,
  },
  {
    name: 'BlogView',
    comp: () => require('~/blogs/BlogsViewScreen').withModal,
    options: hideHeader,
  },
  {
    name: 'WireFab',
    comp: () => require('~/wire/v2/FabScreen').default,
    options: hideHeader,
  },
  {
    name: 'Report',
    comp: () => require('~/report/ReportScreen').default,
    options: { title: i18n.t('report') },
  },
  {
    name: 'TierScreen',
    comp: () => require('~/settings/screens/TierScreen').default,
    options: { title: 'Tier Management' },
  },
  {
    name: 'ReceiverAddressScreen',
    comp: () => require('~/wallet/v2/address/ReceiverAddressScreen').default,
    options: {
      title: 'Receiver Address',
      headerStyle: {
        backgroundColor: ThemedStyles.getColor('PrimaryBackground'),
      },
      headerShadowVisible: false,
    },
  },
  {
    name: 'BtcAddressScreen',
    comp: () => require('~/wallet/v2/address/BtcAddressScreen').default,
    options: {
      title: i18n.t('wallet.bitcoins.update'),
      headerStyle: {
        backgroundColor: ThemedStyles.getColor('PrimaryBackground'),
      },
      headerShadowVisible: false,
    },
  },
  {
    name: 'BankInfoScreen',
    comp: () => require('~/wallet/v2/address/BankInfoScreen').default,
    options: {
      title: i18n.t('wallet.bank.title'),
      headerStyle: {
        backgroundColor: ThemedStyles.getColor('PrimaryBackground'),
      },
      headerShadowVisible: false,
    },
  },
  {
    name: 'Supermind',
    comp: () => require('~/supermind/SupermindScreen').default,
    options: hideHeader,
  },
  {
    name: 'Referrals',
    comp: () => require('~/referral/ReferralsScreen').default,
    options: {
      title: 'Invite Friends',
    },
  },
  {
    name: 'BoostConsole',
    comp: () =>
      require('modules/boost/boost-console/screens/BoostConsoleScreen').default,
    options: hideHeader,
  },
  {
    name: 'SingleBoostConsole',
    comp: () =>
      require('modules/boost/boost-console/screens/SingleBoostConsoleScreen')
        .default,
    options: hideHeader,
  },
];
