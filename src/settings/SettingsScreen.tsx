import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';

import AuthService from '../auth/AuthService';
import MenuItem, { MenuItemItem } from '../common/components/menus/MenuItem';
import { isNetworkError } from '../common/services/api.service';
import i18n from '../common/services/i18n.service';
import openUrlService from '../common/services/open-url.service';
import sessionService from '../common/services/session.service';
import apiService, { ApiResponse } from '../common/services/api.service';
import ThemedStyles from '../styles/ThemedStyles';
import { ScreenHeader, Screen } from '~/common/ui/screen';
import { showNotification } from 'AppMessages';
import { observer } from 'mobx-react';
import { HiddenTap } from './screens/DevToolsScreen';
import { DEV_MODE, PRO_PLUS_SUBSCRIPTION_ENABLED } from '~/config/Config';

interface HelpResponse extends ApiResponse {
  url: string;
}

/**
 * Retrieves the link & jwt for zendesk and navigate to it.
 */
const navigateToHelp = async () => {
  try {
    const response = await apiService.get<HelpResponse>(
      'api/v3/helpdesk/zendesk',
      {
        returnUrl: 'true',
      },
    );
    if (response && response.url) {
      openUrlService.openLinkInInAppBrowser(unescape(response.url));
    }
  } catch (err) {
    console.log(err);
    if (isNetworkError(err)) {
      showNotification(i18n.t('errorMessage'), 'warning');
    } else {
      showNotification(i18n.t('cantReachServer'), 'warning');
    }
  }
};

const setDarkMode = () => {
  if (ThemedStyles.theme) {
    ThemedStyles.setLight();
  } else {
    ThemedStyles.setDark();
  }
};

type Item = MenuItemItem & { screen?: string; params?: any };

const SettingsScreen = observer(({ navigation }) => {
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

  const firstSection: Array<Item> = [
    {
      title: i18n.t('settings.account'),
      screen: 'Account',
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
  ];

  if (!user.plus && PRO_PLUS_SUBSCRIPTION_ENABLED) {
    firstSection.push({
      title: i18n.t('monetize.plus'),
      screen: 'UpgradeScreen',
      params: { onComplete: onComplete(false), pro: false },
    });
  }

  if (!user.pro && PRO_PLUS_SUBSCRIPTION_ENABLED) {
    firstSection.push({
      title: i18n.t('monetize.pro'),
      screen: 'UpgradeScreen',
      params: { onComplete: onComplete(true), pro: true },
    });
  }

  firstSection.push({
    title: i18n.t('settings.chooseBrowser'),
    screen: 'ChooseBrowser',
  });

  firstSection.push({
    title: i18n.t('settings.other'),
    screen: 'Other',
    params: {},
  });

  firstSection.push({
    title: i18n.t('settings.resources'),
    screen: 'Resources',
    params: {},
  });

  const secondSection: Array<Item> = [
    {
      title: i18n.t('settings.boostConsole'),
      screen: 'BoostConsole',
    },
    {
      title: i18n.t(
        ThemedStyles.theme ? 'settings.enterLight' : 'settings.enterDark',
      ),
      onPress: setDarkMode,
    },
    {
      title: i18n.t('help'),
      onPress: navigateToHelp,
    },
  ];

  if (DEV_MODE.isActive) {
    secondSection.push({
      title: 'Developer Options',
      screen: 'DevTools',
    });
  }

  secondSection.push({
    title: i18n.t('settings.logout'),
    onPress: () => AuthService.logout(),
    icon: {
      name: 'login-variant',
      type: 'material-community',
    },
  });

  const firstSectionItems = firstSection.map(
    ({ title, screen, params, ...rest }) => ({
      title,
      onPress: () => navigation.push(screen, params),
      ...rest,
    }),
  );
  const secondSectionItems = secondSection.map(
    ({ title, screen, params, ...rest }) => ({
      title,
      onPress: () => navigation.push(screen, params),
      ...rest,
    }),
  );

  return (
    <Screen safe>
      <ScrollView
        style={containerStyle}
        contentContainerStyle={theme.paddingBottom4x}>
        <HiddenTap>
          <ScreenHeader title={i18n.t('moreScreen.settings')} />
        </HiddenTap>
        <View style={[innerWrapper, theme.bgSecondaryBackground]}>
          {firstSectionItems.map((item, index) => (
            <MenuItem
              item={item}
              containerItemStyle={
                index > 0
                  ? menuItemStyle
                  : ThemedStyles.style.bgSecondaryBackground
              }
            />
          ))}
        </View>
        <View style={[innerWrapper, theme.marginTop7x]}>
          {secondSectionItems.map((item, index) => (
            <MenuItem
              item={item}
              containerItemStyle={
                index > 0
                  ? menuItemStyle
                  : ThemedStyles.style.bgSecondaryBackground
              }
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
});

export default SettingsScreen;

const innerWrapper = ThemedStyles.combine(
  'borderTopHair',
  'borderBottomHair',
  'bcolorPrimaryBorder',
);
const menuItemStyle = ThemedStyles.combine(
  'borderTop0x',
  'bgSecondaryBackground',
);
const containerStyle = ThemedStyles.combine(
  'flexContainer',
  'bgPrimaryBackground',
);
