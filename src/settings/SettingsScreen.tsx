import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import AuthService from '../auth/AuthService';
import MenuItem, { MenuItemProps } from '../common/components/menus/MenuItem';
import { isNetworkError } from '~/common/services/ApiErrors';
import i18n from '../common/services/i18n.service';
import sessionService from '../common/services/session.service';
import apiService, { ApiResponse } from '../common/services/api.service';
import ThemedStyles from '../styles/ThemedStyles';
import { ScreenHeader, Screen } from '~/common/ui/screen';
import { showNotification } from 'AppMessages';
import { observer } from 'mobx-react';
import { HiddenTap } from './screens/DevToolsScreen';
import {
  AFFILIATES_ENABLED,
  DEV_MODE,
  IS_IOS,
  IS_IPAD,
  IS_TENANT,
  PRO_PLUS_SUBSCRIPTION_ENABLED,
} from '~/config/Config';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import NavigationService from '~/navigation/NavigationService';
import { useIsGoogleFeatureOn } from 'ExperimentsProvider';

interface HelpResponse extends ApiResponse {
  url: string;
}

/**
 * Retrieves the link & jwt for zendesk and navigate to it.
 */
export const navigateToHelp = async () => {
  try {
    const response = await apiService.get<HelpResponse>(
      'api/v3/helpdesk/zendesk',
      {
        returnUrl: 'true',
      },
    );
    if (response && response.url) {
      NavigationService.navigate('WebView', {
        url: unescape(response.url),
      });
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

type Item = MenuItemProps & { screen?: string; params?: any };

const SettingsScreen = observer(({ navigation }) => {
  const theme = ThemedStyles.style;

  const hideTokens = useIsGoogleFeatureOn('mob-5221-google-hide-tokens');

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
  ];

  if (!IS_IOS && !hideTokens) {
    firstSection.push({
      title: i18n.t('settings.billing'),
      screen: 'Billing',
      params: {},
    });
  }

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

  firstSection.push({
    title: i18n.t('settings.resources'),
    screen: 'Resources',
    params: {},
  });

  const secondSection: Array<Item> = [
    {
      title: i18n.t('help'),
      onPress: navigateToHelp,
    },
  ];
  if (!IS_TENANT) {
    secondSection.unshift({
      title: i18n.t(
        ThemedStyles.theme ? 'settings.enterLight' : 'settings.enterDark',
      ),
      onPress: setDarkMode,
    });
  }

  if (DEV_MODE.isActive) {
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
    onPress: () => AuthService.logout(),
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
