import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';

import { MoreStackParamList } from './NavigationTypes';
import ThemedStyles from '~/styles/ThemedStyles';
import Drawer from './Drawer';
import i18n from '~/common/services/i18n.service';
import { IS_FROM_STORE, IS_IOS, IS_IPAD } from '~/config/Config';
import { useIsFeatureOn } from 'ExperimentsProvider';
import WalletStack from './WalletStack';

const MoreStack = createNativeStackNavigator<MoreStackParamList>();
const hideHeader: NativeStackNavigationOptions = { headerShown: false };

export default function () {
  const isTwitterEnabled = useIsFeatureOn('engine-2503-twitter-feats');

  const AccountScreenOptions = navigation => [
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
    !IS_IOS
      ? {
          title: i18n.t('settings.accountOptions.5'),
          onPress: () => navigation.push('NSFWScreen'),
        }
      : null,
    {
      title: i18n.t('settings.accountOptions.7'),
      onPress: () => navigation.push('AutoplaySettingsScreen'),
    },
    {
      title: i18n.t('settings.accountOptions.8'),
      onPress: () => navigation.push('BoostSettingsScreen'),
    },
  ];

  const NotificationsScreenOptions = navigation => [
    {
      title: i18n.t('settings.notificationsOptions.email'),
      onPress: () => navigation.push('EmailNotificationsSettings'),
    },
    {
      title: i18n.t('settings.notificationsOptions.push'),
      onPress: () => navigation.push('PushNotificationsSettings'),
    },
  ];

  const SecurityScreenOptions = navigation => [
    {
      title: i18n.t('settings.securityOptions.1'),
      onPress: () => navigation.push('TwoFactorAuthSettingsScreen'),
    },
    {
      title: i18n.t('settings.securityOptions.2'),
      onPress: () => navigation.push('DevicesScreen'),
    },
  ];

  const BillingScreenOptions = !IS_FROM_STORE
    ? navigation => [
        {
          title: i18n.t('settings.billingOptions.1'),
          onPress: () => navigation.push('PaymentMethods'),
        },
        {
          title: i18n.t('settings.billingOptions.2'),
          onPress: () => navigation.push('RecurringPayments'),
        },
        {
          title: 'Supermind',
          onPress: () => navigation.push('SupermindSettingsScreen'),
        },
      ]
    : navigation => [
        {
          title: 'Supermind',
          onPress: () => navigation.push('SupermindSettingsScreen'),
        },
      ];

  return (
    <MoreStack.Navigator
      initialRouteName={IS_IPAD ? 'Settings' : 'Drawer'}
      screenOptions={ThemedStyles.defaultScreenOptions}>
      <MoreStack.Screen name="Drawer" component={Drawer} options={hideHeader} />
      <MoreStack.Screen
        name="Wallet"
        component={WalletStack}
        options={hideHeader}
      />
      <MoreStack.Screen
        name="GroupsList"
        getComponent={() => require('~/groups/GroupsListScreen').default}
        options={hideHeader}
      />
      <MoreStack.Screen
        name="Analytics"
        getComponent={() => require('~/analytics/AnalyticsScreen').default}
        options={hideHeader}
      />
      <MoreStack.Screen
        name="Channel"
        getComponent={() => require('~/channel/v2/ChannelScreen').default}
        options={hideHeader}
        getId={({ params }) =>
          'Channel' + (params?.entity?.guid || params?.guid || '')
        }
      />
      <MoreStack.Screen
        name="Interactions"
        getComponent={() =>
          require('~/common/components/interactions/InteractionsScreen').default
        }
        options={hideHeader}
      />
      <MoreStack.Screen
        name="PlusDiscoveryScreen"
        getComponent={() =>
          require('~/discovery/v2/PlusDiscoveryScreen').default
        }
        options={hideHeader}
      />
      <MoreStack.Screen
        name="Settings"
        getComponent={() => require('~/settings/SettingsScreen').default}
        options={hideHeader}
      />
      <MoreStack.Screen
        name="SupermindConsole"
        getComponent={() =>
          require('~/supermind/SupermindConsoleScreen').default
        }
        options={hideHeader}
      />
      <MoreStack.Screen
        name="Account"
        getComponent={() =>
          require('~/common/components/OptionsDrawer').default
        }
        options={{
          title: i18n.t('settings.account'),
        }}
        initialParams={{ options: AccountScreenOptions }}
      />
      <MoreStack.Screen
        name="Security"
        getComponent={() =>
          require('~/common/components/OptionsDrawer').default
        }
        options={{ title: i18n.t('settings.security') }}
        initialParams={{ options: SecurityScreenOptions }}
      />
      <MoreStack.Screen
        name="Billing"
        getComponent={() =>
          require('~/common/components/OptionsDrawer').default
        }
        options={{ title: i18n.t('settings.billing') }}
        initialParams={{ options: BillingScreenOptions }}
      />
      <MoreStack.Screen
        name="Referrals"
        getComponent={() => require('~/referral/ReferralsScreen').default}
        options={hideHeader}
      />
      <MoreStack.Screen
        name="AffiliateProgram"
        getComponent={() =>
          require('modules/affiliate/screens/AffiliateProgramScreen').default
        }
        options={hideHeader}
      />
      <MoreStack.Screen
        name="BoostConsole"
        getComponent={() => require('modules/boost').BoostConsoleScreen}
        options={hideHeader}
      />
      <MoreStack.Screen
        name="Other"
        getComponent={() => require('~/settings/screens/OtherScreen').default}
        options={{ title: i18n.t('settings.other') }}
      />
      <MoreStack.Screen
        name="ChooseBrowser"
        getComponent={() =>
          require('~/settings/screens/ChooseBrowserScreen').default
        }
        options={{ title: i18n.t('settings.chooseBrowser') }}
      />
      <MoreStack.Screen
        name="Resources"
        getComponent={() =>
          require('~/settings/screens/ResourcesScreen').default
        }
        options={{ title: i18n.t('settings.resources') }}
      />
      <MoreStack.Screen
        name="SettingsNotifications"
        getComponent={() =>
          require('~/common/components/OptionsDrawer').default
        }
        options={{
          title: i18n.t('settings.accountOptions.4'),
        }}
        initialParams={{ options: NotificationsScreenOptions }}
      />
      <MoreStack.Screen
        name="SettingsEmail"
        getComponent={() => require('~/settings/screens/EmailScreen').default}
        options={{ title: i18n.t('settings.accountOptions.1') }}
      />
      <MoreStack.Screen
        name="SettingsPassword"
        getComponent={() =>
          require('~/settings/screens/PasswordScreen').default
        }
        options={{ title: i18n.t('settings.accountOptions.3') }}
      />
      <MoreStack.Screen
        name="PushNotificationsSettings"
        getComponent={() =>
          require('~/notifications/v3/settings/push/PushNotificationsSettings')
            .default
        }
        options={{ title: i18n.t('settings.pushNotification') }}
      />
      <MoreStack.Screen
        name="EmailNotificationsSettings"
        getComponent={() =>
          require('~/notifications/v3/settings/email/EmailNotificationsSettings')
            .default
        }
        options={{ title: i18n.t('settings.emailNotifications') }}
      />
      <MoreStack.Screen
        name="DataSaverScreen"
        getComponent={() =>
          require('~/settings/screens/DataSaverScreen').default
        }
        options={{ title: i18n.t('settings.networkOptions.1') }}
      />
      <MoreStack.Screen
        name="BlockedChannels"
        getComponent={() =>
          require('~/settings/screens/blocked/BlockedChannelsScreen').default
        }
        options={{ title: i18n.t('settings.blockedChannels') }}
      />
      <MoreStack.Screen
        name="TierManagementScreen"
        getComponent={() =>
          require('~/common/components/tier-management/TierManagementScreen')
            .default
        }
        options={{ title: i18n.t('settings.otherOptions.b1') }}
        initialParams={{ useForSelection: false }}
      />
      {isTwitterEnabled && (
        <MoreStack.Screen
          name="TwitterSync"
          getComponent={() =>
            require('~/settings/screens/twitter-sync/TwitterSyncScreen').default
          }
          options={{ title: i18n.t('settings.twitterSync.titleLong') }}
        />
      )}
      <MoreStack.Screen
        name="DeleteChannel"
        getComponent={() =>
          require('~/settings/screens/DeleteChannelScreen').default
        }
        options={{ title: i18n.t('settings.deleteChannel') }}
      />
      <MoreStack.Screen
        name="DeactivateChannel"
        getComponent={() =>
          require('~/settings/screens/DeactivateChannelScreen').default
        }
        options={{ title: i18n.t('settings.disableChannel') }}
      />
      <MoreStack.Screen
        name="LanguageScreen"
        getComponent={() =>
          require('~/settings/screens/LanguageScreen').default
        }
        options={{ title: i18n.t('settings.accountOptions.2') }}
      />
      <MoreStack.Screen
        name="NSFWScreen"
        getComponent={() => require('~/settings/screens/NSFWScreen').default}
        options={{ title: i18n.t('settings.accountOptions.5') }}
      />
      <MoreStack.Screen
        name="AutoplaySettingsScreen"
        getComponent={() =>
          require('~/settings/screens/AutoplaySettingsScreen').default
        }
        options={{ title: i18n.t('settings.accountOptions.7') }}
      />
      <MoreStack.Screen
        name="SupermindSettingsScreen"
        getComponent={() =>
          require('~/settings/screens/SupermindSettingsScreen').default
        }
        options={{ headerShown: false }}
      />
      <MoreStack.Screen
        name="BoostSettingsScreen"
        getComponent={() =>
          require('~/settings/screens/BoostSettingsScreen').default
        }
        options={{ title: i18n.t('settings.accountOptions.8') }}
      />
      <MoreStack.Screen
        name="TwoFactorAuthSettingsScreen"
        getComponent={() =>
          require('~/auth/twoFactorAuth/TwoFactorAuthSettingsScreen').default
        }
        options={{ title: i18n.t('settings.securityOptions.1') }}
      />
      <MoreStack.Screen
        name="RecoveryCodesScreen"
        getComponent={() =>
          require('~/auth/twoFactorAuth/RecoveryCodesScreen').default
        }
        options={{ title: i18n.t('settings.TFA') }}
      />
      <MoreStack.Screen
        name="VerifyAuthAppScreen"
        getComponent={() =>
          require('~/auth/twoFactorAuth/VerifyAuthAppScreen').default
        }
        options={{ title: i18n.t('settings.TFA') }}
      />
      <MoreStack.Screen
        name="DisableTFA"
        getComponent={() => require('~/auth/twoFactorAuth/DisableTFA').default}
        options={{ title: i18n.t('settings.TFA') }}
      />
      <MoreStack.Screen
        name="DevicesScreen"
        getComponent={() => require('~/settings/screens/DevicesScreen').default}
        options={{ title: i18n.t('settings.securityOptions.2') }}
      />
      {!IS_FROM_STORE && (
        <MoreStack.Screen
          name="PaymentMethods"
          getComponent={() =>
            require('~/settings/screens/BillingScreen').default
          }
          options={{ title: i18n.t('settings.billingOptions.1') }}
        />
      )}
      {!IS_IOS && (
        <MoreStack.Screen
          name="RecurringPayments"
          getComponent={() =>
            require('~/settings/screens/RecurringPayments').default
          }
          options={{ title: i18n.t('settings.billingOptions.2') }}
        />
      )}
      <MoreStack.Screen
        name="ReportedContent"
        getComponent={() => require('~/report/ReportedContentScreen').default}
        options={{ title: i18n.t('settings.otherOptions.a1') }}
      />
      <MoreStack.Screen
        name="AppInfo"
        getComponent={() => require('~/settings/screens/AppInfoScreen').default}
      />
      <MoreStack.Screen
        name="WebView"
        getComponent={() => require('~/common/screens/WebViewScreen').default}
      />
      <MoreStack.Screen
        name="BoostScreenV2"
        getComponent={() => require('modules/boost').BoostComposerStack}
        options={{ headerShown: false }}
      />
      <MoreStack.Screen
        name="SupermindTwitterConnect"
        getComponent={() =>
          require('~/supermind/SupermindTwitterConnectScreen').default
        }
        options={{ headerShown: false }}
      />
      <MoreStack.Screen
        name="GroupView"
        getComponent={() =>
          require('~/modules/groups/screens/GroupScreen').GroupScreen
        }
        options={{ headerShown: false }}
      />
      <MoreStack.Screen
        name="Activity"
        getComponent={() => require('~/newsfeed/ActivityScreen').default}
        options={hideHeader}
        initialParams={{ noBottomInset: true }}
      />
      <MoreStack.Screen
        name="GroupsManage"
        getComponent={() => require('~/groups/GroupsManageScreen').default}
        options={{ headerShown: false }}
      />
    </MoreStack.Navigator>
  );
}
