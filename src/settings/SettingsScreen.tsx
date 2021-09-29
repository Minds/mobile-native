//@ts-nocheck
import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import AuthService from '../auth/AuthService';
import MenuItem from '../common/components/menus/MenuItem';
import { isNetworkError } from '../common/services/api.service';
import i18n from '../common/services/i18n.service';
import openUrlService from '../common/services/open-url.service';
import sessionService from '../common/services/session.service';
import apiService from '../common/services/api.service';
import ThemedStyles from '../styles/ThemedStyles';
import MText from '../common/components/MText';

/**
 * Retrieves the link & jwt for zendesk and navigate to it.
 */
const navigateToHelp = async () => {
  try {
    const response = await apiService.get('api/v3/helpdesk/zendesk', {
      returnUrl: 'true',
    });
    if (response && response.url) {
      openUrlService.openLinkInInAppBrowser(unescape(response.url));
    }
  } catch (err) {
    console.log(err);
    if (isNetworkError(err)) {
      showMessage(i18n.t('errorMessage'));
    } else {
      showMessage(i18n.t('cantReachServer'));
    }
  }
};

export default function ({ navigation }) {
  const theme = ThemedStyles.style;

  const user = sessionService.getUser();

  const onComplete = useCallback(
    (forPro: boolean) => {
      return (success: any) => {
        if (success) {
          forPro ? user.togglePro() : user.togglePlus();
        }
      };
    },
    [user],
  );

  const itemsMapping = [
    {
      title: i18n.t('settings.account'),
      screen: 'Account',
      params: {},
    },
    {
      title: i18n.t('settings.networkOptions.1'),
      screen: 'DataSaverScreen',
      params: {},
    },
    {
      title: i18n.t('settings.security'),
      screen: 'Security',
      params: {},
    },
    {
      title: i18n.t('settings.billing'),
      screen: 'Billing',
      params: {},
    },
    {
      title: i18n.t('settings.referrals'),
      screen: 'Referrals',
      params: {},
    },
    {
      title: i18n.t('boost'),
      screen: 'BoostConsole',
    },
    {
      title: i18n.t('blockchain.exportLegacyWallet'),
      screen: 'ExportLegacyWallet',
    },
    {
      title: i18n.t('messenger.legacyMessenger'),
      screen: 'Messenger',
    },
  ];

  if (!user.plus) {
    itemsMapping.push({
      title: i18n.t('monetize.plus'),
      screen: 'UpgradeScreen',
      params: { onComplete: onComplete(false), pro: false },
    });
  }

  if (!user.pro) {
    itemsMapping.push({
      title: i18n.t('monetize.pro'),
      screen: 'UpgradeScreen',
      params: { onComplete: onComplete(true), pro: true },
    });
  }

  itemsMapping.push({
    title: i18n.t('settings.other'),
    screen: 'Other',
    params: {},
  });

  itemsMapping.push({
    title: i18n.t('settings.resources'),
    screen: 'Resources',
    params: {},
  });

  const items = itemsMapping.map(({ title, screen, params }) => ({
    title,
    onPress: () => navigation.push(screen, params),
  }));

  const setDarkMode = () => {
    if (ThemedStyles.theme) {
      ThemedStyles.setLight();
    } else {
      ThemedStyles.setDark();
    }
  };

  const innerWrapper = [
    theme.borderTopHair,
    theme.borderBottomHair,
    theme.bcolorPrimaryBorder,
  ];

  const logOut = {
    title: i18n.t('settings.logout'),
    onPress: AuthService.logout,
    icon: {
      name: 'login-variant',
      type: 'material-community',
    },
  };

  const themeChange = {
    title: i18n.t(
      ThemedStyles.theme ? 'settings.enterLight' : 'settings.enterDark',
    ),
    onPress: setDarkMode,
  };

  const help = {
    title: i18n.t('help'),
    onPress: navigateToHelp,
    icon: {
      name: 'help-circle-outline',
      type: 'material-community',
    },
  };

  return (
    <ScrollView
      style={[theme.flexContainer, theme.bgPrimaryBackground]}
      contentContainerStyle={theme.paddingBottom4x}>
      <MText
        style={[theme.titleText, theme.paddingLeft4x, theme.paddingVertical2x]}>
        {i18n.t('moreScreen.settings')}
      </MText>
      <View style={[innerWrapper, theme.bgPrimaryBackground]}>
        {items.map(item => (
          <MenuItem item={item} />
        ))}
      </View>
      <View style={[innerWrapper, theme.marginTop7x]}>
        <MenuItem item={themeChange} i={4} />
        <MenuItem item={help} i={5} />
        <MenuItem item={logOut} i={6} />
      </View>
    </ScrollView>
  );
}
