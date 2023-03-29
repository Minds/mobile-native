import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';

import { MoreStackParamList } from './NavigationTypes';
import ThemedStyles from '~/styles/ThemedStyles';
import Drawer from './Drawer';
import i18n from '~/common/services/i18n.service';
import { IS_IOS } from '~/config/Config';
import { hasVariation } from 'ExperimentsProvider';
import { ScreenProps, screenProps } from './stack.utils';

const MoreStack = createNativeStackNavigator<MoreStackParamList>();

export default function () {
  return (
    <MoreStack.Navigator screenOptions={ThemedStyles.defaultScreenOptions}>
      <MoreStack.Screen name="Drawer" component={Drawer} options={hideHeader} />
      {moreStacks.map(({ hideIf, ...screen }) => {
        return hideIf ? undefined : (
          <MoreStack.Screen key={screen.name} {...screenProps(screen)} />
        );
      })}
    </MoreStack.Navigator>
  );
}

const hideHeader: NativeStackNavigationOptions = { headerShown: false };

const WalletOptions = () => ({
  title: i18n.t('wallet.wallet'),
  headerShown: false,
});

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

const BillingScreenOptions = !IS_IOS
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

export const moreStacks: ScreenProps<string>[] = [
  {
    name: 'Wallet',
    comp: () => require('~/wallet/v3/WalletScreen').default,
    options: WalletOptions,
  },
  {
    name: 'GroupsList',
    comp: () => require('~/groups/GroupsListScreen').default,
    options: hideHeader,
  },
  {
    name: 'Analytics',
    comp: () => require('~/analytics/AnalyticsScreen').default,
    options: hideHeader,
  },
  {
    name: 'Channel',
    comp: () => require('~/channel/v2/ChannelScreen').default,
    options: hideHeader,
  },
  {
    name: 'PlusDiscoveryScreen',
    comp: () => require('~/discovery/v2/PlusDiscoveryScreen').default,
    options: hideHeader,
  },
  {
    name: 'Settings',
    comp: () => require('~/settings/SettingsScreen').default,
    options: hideHeader,
  },
  {
    name: 'SupermindConsole',
    comp: () => require('~/supermind/SupermindConsoleScreen').default,
    options: hideHeader,
  },
  {
    name: 'Account',
    comp: () => require('~/common/components/OptionsDrawer').default,
    options: { title: i18n.t('settings.account') },
    initialParams: { options: AccountScreenOptions },
  },
  {
    name: 'Security',
    comp: () => require('~/common/components/OptionsDrawer').default,
    options: { title: i18n.t('settings.security') },
    initialParams: { options: SecurityScreenOptions },
  },
  {
    name: 'Billing',
    comp: () => require('~/common/components/OptionsDrawer').default,
    options: { title: i18n.t('settings.billing') },
    initialParams: { options: BillingScreenOptions },
  },
  {
    name: 'Referrals',
    comp: () => require('~/referral/ReferralsScreen').default,
    options: { title: i18n.t('settings.referrals') },
  },
  {
    name: 'BoostConsole',
    comp: () => require('modules/boost').BoostConsoleScreen,
    options: hideHeader,
  },
  {
    name: 'Other',
    comp: () => require('~/settings/screens/OtherScreen').default,
    options: { title: i18n.t('settings.other') },
  },
  {
    name: 'ChooseBrowser',
    comp: () => require('~/settings/screens/ChooseBrowserScreen').default,
    options: { title: i18n.t('settings.chooseBrowser') },
  },
  {
    name: 'Resources',
    comp: () => require('~/settings/screens/ResourcesScreen').default,
    options: { title: i18n.t('settings.resources') },
  },
  {
    name: 'SettingsNotifications',
    comp: () => require('~/common/components/OptionsDrawer').default,
    options: { title: i18n.t('settings.accountOptions.4') },
    initialParams: { options: NotificationsScreenOptions },
  },
  {
    name: 'SettingsEmail',
    comp: () => require('~/settings/screens/EmailScreen').default,
    options: { title: i18n.t('settings.accountOptions.1') },
  },
  {
    name: 'SettingsPassword',
    comp: () => require('~/settings/screens/PasswordScreen').default,
    options: { title: i18n.t('settings.accountOptions.3') },
  },
  {
    name: 'PushNotificationsSettings',
    comp: () =>
      require('~/notifications/v3/settings/push/PushNotificationsSettings')
        .default,
    options: { title: i18n.t('settings.pushNotification') },
  },
  {
    name: 'EmailNotificationsSettings',
    comp: () =>
      require('~/notifications/v3/settings/email/EmailNotificationsSettings')
        .default,
    options: { title: i18n.t('settings.emailNotifications') },
  },
  {
    name: 'DataSaverScreen',
    comp: () => require('~/settings/screens/DataSaverScreen').default,
    options: { title: i18n.t('settings.networkOptions.1') },
  },
  {
    name: 'BlockedChannels',
    comp: () =>
      require('~/settings/screens/blocked/BlockedChannelsScreen').default,
    options: { title: i18n.t('settings.blockedChannels') },
  },
  {
    name: 'TierManagementScreen',
    comp: () =>
      require('~/common/components/tier-management/TierManagementScreen')
        .default,
    options: { title: i18n.t('settings.otherOptions.b1') },
    initialParams: { useForSelection: false },
  },
  {
    name: 'TwitterSync',
    comp: () =>
      require('~/settings/screens/twitter-sync/TwitterSyncScreen').default,
    options: { title: i18n.t('settings.twitterSync.titleLong') },
    hideIf: hasVariation('engine-2503-twitter-feats'),
  },
  {
    name: 'DeleteChannel',
    comp: () => require('~/settings/screens/DeleteChannelScreen').default,
    options: { title: i18n.t('settings.deleteChannel') },
  },
  {
    name: 'DeactivateChannel',
    comp: () => require('~/settings/screens/DeactivateChannelScreen').default,
    options: { title: i18n.t('settings.disableChannel') },
  },
  {
    name: 'LanguageScreen',
    comp: () => require('~/settings/screens/LanguageScreen').default,
    options: { title: i18n.t('settings.accountOptions.2') },
  },
  {
    name: 'NSFWScreen',
    comp: () => require('~/settings/screens/NSFWScreen').default,
    options: { title: i18n.t('settings.accountOptions.5') },
  },
  {
    name: 'AutoplaySettingsScreen',
    comp: () => require('~/settings/screens/AutoplaySettingsScreen').default,
    options: { title: i18n.t('settings.accountOptions.7') },
  },
  {
    name: 'SupermindSettingsScreen',
    comp: () => require('~/settings/screens/SupermindSettingsScreen').default,
    options: { headerShown: false },
  },
  {
    name: 'BoostSettingsScreen',
    comp: () => require('~/settings/screens/BoostSettingsScreen').default,
    options: { title: i18n.t('settings.accountOptions.8') },
  },
  {
    name: 'TwoFactorAuthSettingsScreen',
    comp: () =>
      require('~/auth/twoFactorAuth/TwoFactorAuthSettingsScreen').default,
    options: { title: i18n.t('settings.securityOptions.1') },
  },
  {
    name: 'RecoveryCodesScreen',
    comp: () => require('~/auth/twoFactorAuth/RecoveryCodesScreen').default,
    options: { title: i18n.t('settings.TFA') },
  },
  {
    name: 'VerifyAuthAppScreen',
    comp: () => require('~/auth/twoFactorAuth/VerifyAuthAppScreen').default,
    options: { title: i18n.t('settings.TFA') },
  },
  {
    name: 'DisableTFA',
    comp: () => require('~/auth/twoFactorAuth/DisableTFA').default,
    options: { title: i18n.t('settings.TFA') },
  },
  {
    name: 'DevicesScreen',
    comp: () => require('~/settings/screens/DevicesScreen').default,
    options: { title: i18n.t('settings.securityOptions.2') },
  },
  {
    name: 'PaymentMethods',
    comp: () => require('~/settings/screens/BillingScreen').default,
    options: { title: i18n.t('settings.billingOptions.1') },
    hideIf: IS_IOS,
  },
  {
    name: 'RecurringPayments',
    comp: () => require('~/settings/screens/RecurringPayments').default,
    options: { title: i18n.t('settings.billingOptions.2') },
    hideIf: IS_IOS,
  },
  {
    name: 'ReportedContent',
    comp: () => require('~/report/ReportedContentScreen').default,
    options: { title: i18n.t('settings.otherOptions.a1') },
  },
  {
    name: 'AppInfo',
    comp: () => require('~/settings/screens/AppInfoScreen').default,
  },
  {
    name: 'WebView',
    comp: () => require('~/common/screens/WebViewScreen').default,
  },
  {
    name: 'BoostScreenV2',
    comp: () => require('modules/boost').BoostComposerStack,
    options: { headerShown: false },
  },
  {
    name: 'SupermindTwitterConnect',
    comp: () => require('~/supermind/SupermindTwitterConnectScreen').default,
    options: { headerShown: false },
  },
];
