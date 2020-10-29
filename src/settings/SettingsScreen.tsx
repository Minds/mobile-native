//@ts-nocheck
import React, { useCallback } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import authService from '../auth/AuthService';
import MenuItem from '../common/components/menus/MenuItem';
import i18n from '../common/services/i18n.service';
import sessionService from '../common/services/session.service';
import ThemedStyles from '../styles/ThemedStyles';
import { TAB_BAR_HEIGHT } from '../tabs/TabsScreen';

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
      title: i18n.t('monetize.plus'),
      screen: 'PlusScreen',
      params: { onComplete: onComplete(false), pro: false },
    },
    {
      title: i18n.t('monetize.pro'),
      screen: 'PlusScreen',
      params: { onComplete: onComplete(true), pro: true },
    },
    {
      title: i18n.t('settings.other'),
      screen: 'Other',
      params: {},
    },
  ];

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
    theme.borderPrimary,
  ];

  const logOut = {
    title: i18n.t('settings.logout'),
    onPress: authService.logout,
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
    onPress: () => Linking.openURL('https://www.minds.com/help'),
    icon: {
      name: 'help-circle-outline',
      type: 'material-community',
    },
  };

  return (
    <ScrollView
      style={[theme.flexContainer, theme.backgroundPrimary]}
      contentContainerStyle={styles.container}>
      <Text
        style={[theme.titleText, theme.paddingLeft4x, theme.paddingVertical2x]}>
        {i18n.t('moreScreen.settings')}
      </Text>
      <View style={[innerWrapper, theme.backgroundPrimary]}>
        {items.map((item) => (
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

const styles = StyleSheet.create({
  container: {
    paddingBottom: TAB_BAR_HEIGHT / 2,
  },
});
