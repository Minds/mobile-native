import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';

import TabsScreen from '../tabs/TabsScreen';
import TabsScreenVertical from '../tabs/TabsScreenVertical';

import {
  AppStackParamList,
  AuthStackParamList,
  RootStackParamList,
} from './NavigationTypes';

import ModalTransition from './ModalTransition';
import AuthTransition from './AuthTransition';

import { observer } from 'mobx-react';
import { IS_IPAD, IS_TENANT } from '~/config/Config';
import withModalProvider from './withModalProvide';
import sp from '~/services/serviceProvider';

const hideHeader: NativeStackNavigationOptions = { headerShown: false };

const AppStackNav = createNativeStackNavigator<AppStackParamList>();
const AuthStackNav = createStackNavigator<AuthStackParamList>();
const RootStackNav = createStackNavigator<RootStackParamList>();

const modalOptions = {
  gestureResponseDistance: 240,
  gestureEnabled: true,
};

const TabScreenWithModal = withModalProvider(
  IS_IPAD ? TabsScreenVertical : TabsScreen,
);

const AppStack = observer(() => {
  if (sp.session.switchingAccount) {
    return null;
  }
  const i18n = sp.i18n;
  const statusBarStyle =
    sp.styles.theme === 0 ? 'dark-content' : 'light-content';
  return (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={sp.styles.getColor('PrimaryBackground')}
      />
      <AppStackNav.Navigator screenOptions={sp.styles.defaultScreenOptions}>
        <AppStackNav.Screen
          name="Tabs"
          component={TabScreenWithModal}
          options={hideHeader}
        />
        <AppStackNav.Screen
          name="YoutubePlayer"
          getComponent={() =>
            require('~/modules/youtube-player/screens/YoutubePlayerScreen')
              .default
          }
          options={({ route }) => ({ title: route.params.title || 'Youtube' })}
        />
        <AppStackNav.Screen
          name="More"
          options={{
            gestureDirection: 'horizontal',
            gestureEnabled: true,
            animation: 'slide_from_right',
            ...hideHeader,
          }}
          getComponent={() => require('~/navigation/MoreStack').default}
        />
        <AppStackNav.Screen
          name="GifCardClaim"
          getComponent={() =>
            require('~/modules/gif-card/screens/GifCardClaimScreen')
              .GifCardClaimScreen
          }
          options={hideHeader}
        />
        <AppStackNav.Screen
          name="WebView"
          getComponent={() => require('~/common/screens/WebViewScreen').default}
        />
        <AppStackNav.Screen
          name="PortraitViewerScreen"
          getComponent={() =>
            require('~/portrait/PortraitViewerScreen').withModal
          }
          options={{
            animation: 'fade_from_bottom',
            ...hideHeader,
          }}
        />
        <AppStackNav.Screen
          name="ChatStack"
          getComponent={() => require('~/modules/chat').ChatConversationStack}
          options={hideHeader}
        />
        <AppStackNav.Screen
          name="ChatNew"
          getComponent={() =>
            require('~/modules/chat/screens/ChatNewScreen').default
          }
          options={hideHeader}
        />
        <AppStackNav.Screen
          name="Update"
          getComponent={() => require('~/update/UpdateScreen').default}
          options={hideHeader}
        />
        <AppStackNav.Screen
          name="Notifications"
          getComponent={() =>
            require('~/notifications/v3/NotificationsScreen').default
          }
        />
        <AppStackNav.Screen
          name="Channel"
          getComponent={() => require('~/channel/v2/ChannelScreen').withModal}
          options={hideHeader}
          getId={({ params }) =>
            'Channel' + (params?.entity?.guid || params?.guid || '')
          }
        />
        <AppStackNav.Screen
          name="Interactions"
          getComponent={() =>
            require('~/common/components/interactions/InteractionsScreen')
              .default
          }
          options={hideHeader}
        />
        <AppStackNav.Screen
          name="DiscoverySearch"
          getComponent={() =>
            require('~/discovery/v2/search/DiscoverySearchScreen')
              .DiscoverySearchScreen
          }
        />
        <AppStackNav.Screen
          name="ChannelEdit"
          getComponent={() =>
            require('~/channel/v2/edit/ChannelEditScreen').default
          }
          options={{
            headerBackVisible: false,
            animation: 'slide_from_bottom',
            title: i18n.t('channel.editChannel'),
          }}
        />
        <AppStackNav.Screen
          name="Activity"
          getComponent={() => require('~/newsfeed/ActivityScreen').withModal}
          options={hideHeader}
        />
        <AppStackNav.Screen
          name="GroupView"
          getComponent={() =>
            require('~/modules/groups/screens/GroupScreen').GroupScreen
          }
          options={hideHeader}
        />
        <AppStackNav.Screen
          name="BlogView"
          getComponent={() => require('~/blogs/BlogsViewScreen').withModal}
          options={hideHeader}
        />
        <AppStackNav.Screen
          name="WireFab"
          getComponent={() => require('~/wire/v2/FabScreen').default}
          options={hideHeader}
        />
        <AppStackNav.Screen
          name="TierScreen"
          getComponent={() => require('~/settings/screens/TierScreen').default}
          options={{ title: 'Tier Management' }}
        />
        <AppStackNav.Screen
          name="ReceiverAddressScreen"
          getComponent={() =>
            require('~/wallet/v2/address/ReceiverAddressScreen').default
          }
          options={{
            title: 'Receiver Address',
            headerStyle: {
              backgroundColor: sp.styles.getColor('PrimaryBackground'),
            },
            headerShadowVisible: false,
          }}
        />
        <AppStackNav.Screen
          name="BtcAddressScreen"
          getComponent={() =>
            require('~/wallet/v2/address/BtcAddressScreen').default
          }
          options={{
            title: i18n.t('wallet.bitcoins.update'),
            headerStyle: {
              backgroundColor: sp.styles.getColor('PrimaryBackground'),
            },
            headerShadowVisible: false,
          }}
        />
        <AppStackNav.Screen
          name="BankInfoScreen"
          getComponent={() =>
            require('~/wallet/v2/address/BankInfoScreen').default
          }
          options={{
            title: i18n.t('wallet.bank.title'),
            headerStyle: {
              backgroundColor: sp.styles.getColor('PrimaryBackground'),
            },
            headerShadowVisible: false,
          }}
        />
        <AppStackNav.Screen
          name="Supermind"
          getComponent={() => require('~/supermind/SupermindScreen').default}
          options={hideHeader}
        />
        <AppStackNav.Screen
          name="BoostConsole"
          getComponent={() => require('modules/boost').BoostConsoleScreen}
          options={hideHeader}
        />
        <AppStackNav.Screen
          name="SingleBoostConsole"
          getComponent={() => require('modules/boost').SingleBoostConsoleScreen}
          options={hideHeader}
        />
      </AppStackNav.Navigator>
    </>
  );
});

const AuthStack = function () {
  return (
    <>
      <StatusBar barStyle={'light-content'} backgroundColor="#000000" />
      <AuthStackNav.Navigator
        // @ts-ignore
        screenOptions={AuthTransition}>
        <AuthStackNav.Screen
          name="Welcome"
          getComponent={() => require('~/auth/WelcomeScreen').default}
        />
        <AuthStackNav.Screen
          name="TwoFactorConfirmation"
          getComponent={() => require('~/auth/TwoFactorConfirmScreen').default}
          options={{
            ...modalOptions,
            headerMode: 'screen',
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </AuthStackNav.Navigator>
    </>
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

const rootStackCardScreenOptions = {
  headerShown: true,
  ...TransitionPresets.SlideFromRightIOS,
  cardStyle: {
    backgroundColor: sp.styles.getColor('PrimaryBackground'),
  },
  headerStyle: {
    backgroundColor: sp.styles.getColor('PrimaryBackground'),
  },
};

const RootStack = observer(function () {
  const is_email_confirmed = sp.session.getUser()?.email_confirmed;
  const auth = sp.resolve('auth');
  const session = sp.session;
  const i18n = sp.i18n;
  const shouldShowEmailVerification =
    !is_email_confirmed && !sp.session.switchingAccount && auth.justRegistered;

  return (
    <RootStackNav.Navigator screenOptions={defaultScreenOptions}>
      {!sp.session.showAuthNav ? (
        shouldShowEmailVerification ? (
          <>
            <RootStackNav.Screen
              initialParams={{ mfaType: 'email' }}
              name="App"
              getComponent={() =>
                require('~/auth/InitialEmailVerificationScreen').default
              }
              options={TransitionPresets.RevealFromBottomAndroid}
            />
            <RootStackNav.Screen
              name="MultiUserScreen"
              getComponent={() =>
                require('~/auth/multi-user/MultiUserScreen').default
              }
              options={{
                title: i18n.t('multiUser.switchChannel'),
              }}
            />
          </>
        ) : (
          <>
            {auth.justRegistered && !auth.onboardCompleted && !IS_TENANT ? (
              <RootStackNav.Screen
                name="App"
                getComponent={() =>
                  require('modules/onboarding').MandatoryOnboardingStack
                }
                options={modalOptions}
              />
            ) : (
              <RootStackNav.Screen
                name="App"
                component={AppStack}
                options={({ route }) => ({
                  // only animate on nested route changes (e.g. CommentBottomSheetModal -> channel)
                  animationEnabled: Boolean(route.params),
                  cardStyle: sp.styles.style.bgPrimaryBackground, // avoid dark fade in android transition
                  ...(route.params
                    ? TransitionPresets.SlideFromRightIOS
                    : null),
                })}
              />
            )}
            <RootStackNav.Screen
              name="Report"
              options={{ title: i18n.t('report'), headerShown: true }}
              getComponent={() => require('~/report/ReportScreen').default}
            />
            <RootStackNav.Screen
              name="TenantMemberships"
              options={{ title: 'Memberships', headerShown: true }}
              getComponent={() =>
                require('~/modules/site-membership/screens/TenantMembershipsScreen')
                  .default
              }
            />
            <RootStackNav.Screen
              name="Capture"
              getComponent={() => require('~/compose/CameraScreen').default}
              options={TransitionPresets.RevealFromBottomAndroid}
            />
            <RootStackNav.Screen
              name="Compose"
              getComponent={() => require('~/compose/ComposeStack').default}
              options={TransitionPresets.ModalPresentationIOS}
            />
            <RootStackNav.Screen
              name="SupermindConfirmation"
              getComponent={() =>
                require('~/compose/SupermindConfirmation').default
              }
              options={{
                ...TransitionPresets.ModalPresentationIOS,
                gestureEnabled: true,
              }}
            />
            <RootStackNav.Screen
              name="SupermindCompose"
              getComponent={() =>
                require('~/compose/SupermindComposeScreen').default
              }
            />
            {/* Modal screens here */}
            <RootStackNav.Screen
              name="MultiUserScreen"
              getComponent={() =>
                require('~/auth/multi-user/MultiUserScreen').default
              }
              options={{
                title: i18n.t('multiUser.switchChannel'),
              }}
            />
            <RootStackNav.Screen
              name="JoinMembershipScreen"
              getComponent={() =>
                require('~/wire/v2/tiers/JoinMembershipScreen').default
              }
              options={modalOptions}
            />
            <RootStackNav.Screen
              navigationKey={session.showAuthNav ? 'auth' : 'inApp'}
              name="ChooseBrowserModal"
              getComponent={() =>
                require('~/settings/screens/ChooseBrowserModalScreen').default
              }
              options={modalOptions}
            />
            <RootStackNav.Screen
              name="ImageGallery"
              getComponent={() => require('~/media/ImageGalleryScreen').default}
            />
            <RootStackNav.Screen
              name="UpgradeScreen"
              getComponent={() => require('~/upgrade/UpgradeScreen').default}
              options={modalOptions}
            />
            <RootStackNav.Screen
              name="VerifyEmail"
              getComponent={() =>
                require('~/onboarding/v2/steps/VerifyEmailScreen').default
              }
              options={modalOptions}
            />
            <RootStackNav.Screen
              name="SelectHashtags"
              getComponent={() =>
                require('~/onboarding/v2/steps/SelectHashtagsScreen').default
              }
              options={modalOptions}
            />
            <RootStackNav.Screen
              name="SetupChannel"
              getComponent={() =>
                require('~/onboarding/v2/steps/SetupChannelScreen').default
              }
              options={modalOptions}
            />
            <RootStackNav.Screen
              name="VerifyUniqueness"
              getComponent={() =>
                require('~/onboarding/v2/steps/VerifyUniquenessScreen').default
              }
              options={modalOptions}
            />
            <RootStackNav.Screen
              name="SuggestedChannel"
              getComponent={() =>
                require('~/onboarding/v2/steps/SuggestedChannelsScreen').default
              }
              options={modalOptions}
            />
            <RootStackNav.Screen
              name="SuggestedGroups"
              getComponent={() =>
                require('~/onboarding/v2/steps/SuggestedGroupsScreen').default
              }
              options={modalOptions}
            />
            <RootStackNav.Screen
              name="PhoneValidation"
              getComponent={() =>
                require('~/onboarding/v2/steps/PhoneValidationScreen').default
              }
              options={modalOptions}
            />
            <RootStackNav.Screen
              name="WalletWithdrawal"
              getComponent={() =>
                require('~/wallet/v3/currency-tabs/tokens/widthdrawal/Withdrawal')
                  .default
              }
              options={modalOptions}
            />
            <RootStackNav.Screen
              name="EarnModal"
              getComponent={() => require('~/earn/EarnModal').default}
              options={modalOptions}
            />
            <RootStackNav.Screen
              name="SearchScreen"
              getComponent={() =>
                require('~/topbar/searchbar/SearchScreen').default
              }
            />
            <RootStackNav.Screen
              name="PasswordConfirmation"
              getComponent={() =>
                require('~/auth/PasswordConfirmScreen').default
              }
              options={modalOptions}
            />
            <RootStackNav.Screen
              name="TwoFactorConfirmation"
              getComponent={() =>
                require('~/auth/TwoFactorConfirmScreen').default
              }
              options={{ ...modalOptions, gestureEnabled: false }}
            />
            <RootStackNav.Screen
              name="RecoveryCodeUsedScreen"
              getComponent={() =>
                require('~/auth/twoFactorAuth/RecoveryCodeUsedScreen').default
              }
              options={modalOptions}
            />
            <RootStackNav.Screen
              name="RelogScreen"
              getComponent={() => require('~/auth/RelogScreen').default}
            />
            <RootStackNav.Screen
              name="TosScreen"
              getComponent={() => require('~/tos/TosScreen').default}
            />
            <RootStackNav.Screen
              name="ChannelSelectScreen"
              getComponent={() =>
                require('../common/components/AutoComplete/ChannelSelectScreen')
                  .default
              }
            />
            <RootStackNav.Screen
              name="BoostScreenV2"
              getComponent={() => require('modules/boost').BoostComposerStack}
              options={modalOptions}
            />
            <RootStackNav.Screen
              name="TierManagementScreen"
              getComponent={() =>
                require('~/common/components/tier-management/TierManagementScreen')
                  .default
              }
              options={{
                title: i18n.t('settings.otherOptions.b1'),
                headerBackTitle: i18n.t('back'),
                ...rootStackCardScreenOptions,
              }}
            />
            <RootStackNav.Screen
              name="TierScreen"
              getComponent={() =>
                require('~/settings/screens/TierScreen').default
              }
              options={{
                title: 'Tier Management',
                ...rootStackCardScreenOptions,
              }}
            />
            <RootStackNav.Screen
              name="GroupsList"
              getComponent={() =>
                require('~/modules/groups/screens/GroupsListScreen').default
              }
              options={{
                ...rootStackCardScreenOptions,
                headerShown: false,
              }}
            />
            <RootStackNav.Screen
              name="GroupsDiscovery"
              getComponent={() =>
                require('~/groups/GroupsDiscoveryScreen').default
              }
              options={{
                ...rootStackCardScreenOptions,
                headerShown: false,
              }}
            />
            <RootStackNav.Screen
              name="GroupView"
              getComponent={() =>
                require('~/modules/groups/screens/GroupScreen').GroupScreen
              }
              options={{
                ...rootStackCardScreenOptions,
                headerShown: false,
              }}
            />
            <RootStackNav.Screen
              name="BoostUpgrade"
              getComponent={() => require('~/modules/boost').BoostUpgrade}
              options={{
                ...defaultScreenOptions,
                headerShown: false,
              }}
            />
          </>
        )
      ) : (
        <>
          <RootStackNav.Screen name="Auth" component={AuthStack} />
        </>
      )}
      <RootStackNav.Screen
        navigationKey={session.showAuthNav ? 'auth' : 'inApp'}
        name="OidcLogin"
        getComponent={() => require('~/auth/oidc/OidcScreen').default}
        options={modalOptions}
      />
      <RootStackNav.Screen
        navigationKey={session.showAuthNav ? 'auth' : 'inApp'}
        name="MultiUserLogin"
        getComponent={() => require('~/auth/multi-user/LoginScreen').default}
        options={modalOptions}
      />
      <RootStackNav.Screen
        navigationKey={session.showAuthNav ? 'auth' : 'inApp'}
        name="MultiUserRegister"
        getComponent={() => require('~/auth/multi-user/RegisterScreen').default}
        options={modalOptions}
      />
      <RootStackNav.Screen
        navigationKey={session.showAuthNav ? 'auth' : 'inApp'}
        name="DevTools"
        getComponent={() =>
          require('~/settings/screens/DevToolsScreen').default
        }
        options={modalOptions}
      />
      <RootStackNav.Screen
        navigationKey={session.showAuthNav ? 'auth' : 'inApp'}
        name="ResetPassword"
        getComponent={() =>
          require('~/auth/reset-password/ResetPasswordScreen').default
        }
        options={modalOptions}
      />
      <RootStackNav.Screen
        navigationKey={session.showAuthNav ? 'auth' : 'inApp'}
        name="BottomSheet"
        getComponent={() =>
          require('../common/components/bottom-sheet/BottomSheetScreen').default
        }
        options={{
          ...modalOptions,
          cardOverlayEnabled: false,
          animationEnabled: false,
        }}
      />
      <RootStackNav.Screen
        name="ChangeEmail"
        getComponent={() => require('~/auth/ChangeEmailScreen').default}
      />
      <RootStackNav.Screen
        name="WebContent"
        getComponent={() => require('../common/screens/WebContent').default}
      />
      <RootStackNav.Screen
        name="CustomPages"
        getComponent={() =>
          require('~/modules/custom-pages/index').CustomPageScreen
        }
      />
    </RootStackNav.Navigator>
  );
});

export default RootStack;
