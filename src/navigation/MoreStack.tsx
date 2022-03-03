import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';

import { MoreStackParamList } from './NavigationTypes';
import ThemedStyles from '~/styles/ThemedStyles';
import ChannelScreen from '~/channel/v2/ChannelScreen';
import Drawer from './Drawer';
import GroupsListScreen from '~/groups/GroupsListScreen';
import WalletScreen from '~/wallet/v3/WalletScreen';
import i18n from '~/common/services/i18n.service';
import AnalyticsScreen from '~/analytics/AnalyticsScreen';
import SettingsScreen from '~/settings/SettingsScreen';
import BuyTokensScreen from '~/buy-tokens/BuyTokensScreen';
import PlusDiscoveryScreen from '~/discovery/v2/PlusDiscoveryScreen';
import OptionsDrawer from '../common/components/OptionsDrawer';
import PasswordScreen from '../settings/screens/PasswordScreen';
import BlockedChannelsScreen from '../settings/screens/blocked/BlockedChannelsScreen';
import TierManagementScreen from '../common/components/tier-management/TierManagementScreen';
import DeleteChannelScreen from '../settings/screens/DeleteChannelScreen';
import DeactivateChannelScreen from '../settings/screens/DeactivateChannelScreen';
import LanguageScreen from '../settings/screens/LanguageScreen';
import NSFWScreen from '../settings/screens/NSFWScreen';
import DevicesScreen from '../settings/screens/DevicesScreen';
import BillingScreen from '../settings/screens/BillingScreen';
import RecurringPayments from '../settings/screens/RecurringPayments';
import ReportedContentScreen from '../report/ReportedContentScreen';
import AppInfoScreen from '../settings/screens/AppInfoScreen';
import AutoplaySettingsScreen from '../settings/screens/AutoplaySettingsScreen';
import BoostSettingsScreen from '../settings/screens/BoostSettingsScreen';
import TwoFactorAuthSettingsScreen from '../auth/twoFactorAuth/TwoFactorAuthSettingsScreen';
import RecoveryCodesScreen from '../auth/twoFactorAuth/RecoveryCodesScreen';
import VerifyAuthAppScreen from '../auth/twoFactorAuth/VerifyAuthAppScreen';
import DisableTFA from '../auth/twoFactorAuth/DisableTFA';
import PushNotificationsSettings from '../notifications/v3/settings/push/PushNotificationsSettings';
import EmailNotificationsSettings from '../notifications/v3/settings/email/EmailNotificationsSettings';
import ChooseBrowserScreen from '~/settings/screens/ChooseBrowserScreen';
import { IS_IOS } from '~/config/Config';
import ReferralsScreen from '~/referral/ReferralsScreen';
import BoostConsoleScreen from '~/boost/BoostConsoleScreen';
import OtherScreen from '~/settings/screens/OtherScreen';
import EmailScreen from '~/settings/screens/EmailScreen';
import DataSaverScreen from '~/settings/screens/DataSaverScreen';
import ResourcesScreen from '~/settings/screens/ResourcesScreen';
import TwitterSyncScreen from '~/settings/screens/twitter-sync/TwitterSyncScreen';

const MoreStack = createNativeStackNavigator<MoreStackParamList>();
const hideHeader: NativeStackNavigationOptions = { headerShown: false };

const WalletOptions = () => ({
  title: i18n.t('wallet.wallet'),
  headerShown: false,
});

export default function () {
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
    IS_IOS
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

  let BillingScreenOptions;
  if (!IS_IOS) {
    BillingScreenOptions = navigation => [
      {
        title: i18n.t('settings.billingOptions.1'),
        onPress: () => navigation.push('PaymentMethods'),
      },
      {
        title: i18n.t('settings.billingOptions.2'),
        onPress: () => navigation.push('RecurringPayments'),
      },
    ];
  }

  return (
    <MoreStack.Navigator screenOptions={ThemedStyles.defaultScreenOptions}>
      <MoreStack.Screen name="Drawer" component={Drawer} options={hideHeader} />
      <MoreStack.Screen
        name="Wallet"
        component={WalletScreen}
        options={WalletOptions}
      />
      <MoreStack.Screen
        name="GroupsList"
        component={GroupsListScreen}
        options={hideHeader}
      />
      <MoreStack.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={hideHeader}
      />
      <MoreStack.Screen
        name="Channel"
        component={ChannelScreen}
        options={hideHeader}
      />
      <MoreStack.Screen
        name="PlusDiscoveryScreen"
        component={PlusDiscoveryScreen}
        options={hideHeader}
      />
      <MoreStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={hideHeader}
      />
      <MoreStack.Screen
        name="BuyTokens"
        component={BuyTokensScreen}
        options={hideHeader}
      />
      <MoreStack.Screen
        name="Account"
        component={OptionsDrawer}
        options={{
          title: i18n.t('settings.account'),
        }}
        initialParams={{ options: AccountScreenOptions }}
      />
      <MoreStack.Screen
        name="Security"
        component={OptionsDrawer}
        options={{ title: i18n.t('settings.security') }}
        initialParams={{ options: SecurityScreenOptions }}
      />
      <MoreStack.Screen
        name="Billing"
        component={OptionsDrawer}
        options={{ title: i18n.t('settings.billing') }}
        initialParams={{ options: BillingScreenOptions }}
      />
      <MoreStack.Screen
        name="Referrals"
        component={ReferralsScreen}
        options={{ title: i18n.t('settings.referrals') }}
      />
      <MoreStack.Screen
        name="BoostConsole"
        component={BoostConsoleScreen}
        options={{ title: i18n.t('boost') }}
      />
      <MoreStack.Screen
        name="Other"
        component={OtherScreen}
        options={{ title: i18n.t('settings.other') }}
      />
      <MoreStack.Screen
        name="ChooseBrowser"
        component={ChooseBrowserScreen}
        options={{ title: i18n.t('settings.chooseBrowser') }}
      />
      <MoreStack.Screen
        name="Resources"
        component={ResourcesScreen}
        options={{ title: i18n.t('settings.resources') }}
      />
      <MoreStack.Screen
        name="SettingsNotifications"
        component={OptionsDrawer}
        options={{
          title: i18n.t('settings.accountOptions.4'),
        }}
        initialParams={{ options: NotificationsScreenOptions }}
      />
      <MoreStack.Screen
        name="SettingsEmail"
        component={EmailScreen}
        options={{ title: i18n.t('settings.accountOptions.1') }}
      />
      <MoreStack.Screen
        name="SettingsPassword"
        component={PasswordScreen}
        options={{ title: i18n.t('settings.accountOptions.3') }}
      />
      <MoreStack.Screen
        name="PushNotificationsSettings"
        component={PushNotificationsSettings}
        options={{ title: i18n.t('settings.pushNotification') }}
      />
      <MoreStack.Screen
        name="EmailNotificationsSettings"
        component={EmailNotificationsSettings}
        options={{ title: i18n.t('settings.pushNotification') }}
      />
      <MoreStack.Screen
        name="DataSaverScreen"
        component={DataSaverScreen}
        options={{ title: i18n.t('settings.networkOptions.1') }}
      />
      <MoreStack.Screen
        name="BlockedChannels"
        component={BlockedChannelsScreen}
        options={{ title: i18n.t('settings.blockedChannels') }}
      />
      <MoreStack.Screen
        name="TierManagementScreen"
        component={TierManagementScreen}
        options={{ title: i18n.t('settings.otherOptions.b1') }}
        initialParams={{ useForSelection: false }}
      />
      <MoreStack.Screen
        name="TwitterSync"
        component={TwitterSyncScreen}
        options={{ title: i18n.t('settings.twitterSync.titleLong') }}
      />
      <MoreStack.Screen
        name="DeleteChannel"
        component={DeleteChannelScreen}
        options={{ title: i18n.t('settings.deleteChannel') }}
      />
      <MoreStack.Screen
        name="DeactivateChannel"
        component={DeactivateChannelScreen}
        options={{ title: i18n.t('settings.disableChannel') }}
      />
      <MoreStack.Screen
        name="LanguageScreen"
        component={LanguageScreen}
        options={{ title: i18n.t('settings.accountOptions.2') }}
      />
      <MoreStack.Screen
        name="NSFWScreen"
        component={NSFWScreen}
        options={{ title: i18n.t('settings.accountOptions.5') }}
      />
      <MoreStack.Screen
        name="AutoplaySettingsScreen"
        component={AutoplaySettingsScreen}
        options={{ title: i18n.t('settings.accountOptions.7') }}
      />
      <MoreStack.Screen
        name="BoostSettingsScreen"
        component={BoostSettingsScreen}
        options={{ title: i18n.t('settings.accountOptions.8') }}
      />
      <MoreStack.Screen
        name="TwoFactorAuthSettingsScreen"
        component={TwoFactorAuthSettingsScreen}
        options={{ title: i18n.t('settings.securityOptions.1') }}
      />
      <MoreStack.Screen
        name="RecoveryCodesScreen"
        component={RecoveryCodesScreen}
        options={{ title: i18n.t('settings.TFA') }}
      />
      <MoreStack.Screen
        name="VerifyAuthAppScreen"
        component={VerifyAuthAppScreen}
        options={{ title: i18n.t('settings.TFA') }}
      />
      <MoreStack.Screen
        name="DisableTFA"
        component={DisableTFA}
        options={{ title: i18n.t('settings.TFA') }}
      />
      <MoreStack.Screen
        name="DevicesScreen"
        component={DevicesScreen}
        options={{ title: i18n.t('settings.securityOptions.2') }}
      />
      {IS_IOS && (
        <MoreStack.Screen
          name="PaymentMethods"
          component={BillingScreen}
          options={{ title: i18n.t('settings.billingOptions.1') }}
        />
      )}
      {IS_IOS && (
        <MoreStack.Screen
          name="RecurringPayments"
          component={RecurringPayments}
          options={{ title: i18n.t('settings.billingOptions.2') }}
        />
      )}
      <MoreStack.Screen
        name="ReportedContent"
        component={ReportedContentScreen}
        options={{ title: i18n.t('settings.otherOptions.a1') }}
      />
      <MoreStack.Screen name="AppInfo" component={AppInfoScreen} />
    </MoreStack.Navigator>
  );
}
