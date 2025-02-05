import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import MenuItem, { MenuItemProps } from '../common/components/menus/MenuItem';

import { ScreenHeader, Screen } from '~/common/ui/screen';
import { observer } from 'mobx-react';
import { HiddenTap } from './screens/DevToolsScreen';
import {
  AFFILIATES_ENABLED,
  GOOGLE_PLAY_STORE,
  IS_IOS,
  IS_IPAD,
  IS_TENANT,
} from '~/config/Config';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import sp from '~/services/serviceProvider';

/**
 * Retrieves the link & jwt for zendesk and navigate to it.
 */
export const navigateToHelp = async () => {
  sp.resolve('openURL').open('https://chatwoot.help/hc/minds/en');
};

const setDarkMode = () => {
  const themeService = sp.styles;
  if (themeService.theme) {
    themeService.setLight();
  } else {
    themeService.setDark();
  }
  sp.storages.app.set('theme', themeService.theme);
};

type Item = MenuItemProps & { screen?: string; params?: any };

const SettingsScreen = observer(({ navigation }) => {
  const theme = sp.styles.style;
  const hideTokens = GOOGLE_PLAY_STORE;
  const i18n = sp.i18n;
  const user = sp.session.getUser();

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
  ];

  // TODO: restore this when #5274 is clarified.
  // if (user.plus && !IS_TENANT) {
  //   firstSection.push({
  //     title: i18n.t('settings.pro'),
  //     screen: user.pro ? 'Pro' : 'UpgradeScreen',
  //     params: {
  //       pro: true,
  //       onComplete: (success: any) => {
  //         if (success) {
  //           user?.togglePro();
  //         }
  //       },
  //     },
  //   });
  // }

  firstSection.push({
    title: i18n.t('settings.security'),
    screen: 'Security',
    params: {},
  });

  if (!IS_IOS && !hideTokens && !IS_TENANT) {
    firstSection.push({
      title: i18n.t('settings.billing'),
      screen: 'Billing',
      params: {},
    });
  }

  if (!user.plus && !IS_TENANT) {
    firstSection.push({
      title: i18n.t('monetize.plus'),
      screen: 'UpgradeScreen',
      params: { onComplete: onComplete(false), pro: false },
    });
  }

  if (!user.pro && !IS_TENANT) {
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

  if (!IS_IPAD && AFFILIATES_ENABLED) {
    firstSection.push({
      title: i18n.t('settings.affiliateProgram'),
      screen: 'AffiliateProgram',
      params: {},
    });
  }

  firstSection.push({
    title: i18n.t('settings.other'),
    screen: 'Other',
    params: {},
  });

  if (!IS_TENANT) {
    firstSection.push({
      title: i18n.t('settings.resources'),
      screen: 'Resources',
      params: {},
    });
  }

  const secondSection: Array<Item> = [];
  if (!IS_TENANT) {
    secondSection.unshift({
      title: i18n.t('help'),
      onPress: navigateToHelp,
    });
    secondSection.unshift({
      title: i18n.t(
        sp.styles.theme ? 'settings.enterLight' : 'settings.enterDark',
      ),
      onPress: setDarkMode,
    });
  }

  if (sp.resolve('devMode').isActive) {
    secondSection.push({
      title: 'Developer Options',
      screen: 'DevTools',
      testID: 'SettingsScreen:DevTools',
    });
  }

  if (IS_IPAD) {
    secondSection.push({
      title: 'Switch Accounts',
      screen: 'MultiUserScreen',
    });
  }

  secondSection.push({
    title: i18n.t('settings.logout'),
    onPress: () => sp.resolve('auth').logout(),
    icon: 'login-variant',
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
      <HiddenTap>
        <ScreenHeader back={!IS_IPAD} title={i18n.t('moreScreen.settings')} />
      </HiddenTap>
      <ScrollView
        testID="SettingsScreen"
        style={theme.flexContainer}
        contentContainerStyle={theme.paddingBottom4x}>
        {firstSectionItems.map((item, index) => (
          <MenuItem key={index} noBorderTop={index > 0} {...item} />
        ))}
        <View style={theme.marginTop7x}>
          {secondSectionItems.map((item, index) => (
            <MenuItem key={index} noBorderTop={index > 0} {...item} />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
});

export default withErrorBoundaryScreen(SettingsScreen, 'SettingsScreen');
