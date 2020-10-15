//@ts-nocheck
import React, { useCallback } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import authService from '../auth/AuthService';
import MenuItem from '../common/components/menus/MenuItem';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import { TAB_BAR_HEIGHT } from '../tabs/TabsScreen';

export default function ({ navigation }) {
  const theme = ThemedStyles.style;

  const navToAccount = useCallback(() => navigation.push('Account'), [
    navigation,
  ]);

  const navToSecurity = useCallback(() => navigation.push('Security'), [
    navigation,
  ]);

  const navToBilling = useCallback(() => navigation.push('Billing'), [
    navigation,
  ]);

  const navToOther = useCallback(() => navigation.push('Other'), [navigation]);

  const navToReferrals = useCallback(() => navigation.push('Referrals'), [
    navigation,
  ]);

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
        <MenuItem
          item={{
            title: i18n.t('settings.account'),
            onPress: navToAccount,
          }}
        />
        <MenuItem
          item={{
            title: i18n.t('settings.security'),
            onPress: navToSecurity,
          }}
        />
        <MenuItem
          item={{
            title: i18n.t('settings.billing'),
            onPress: navToBilling,
          }}
        />
        <MenuItem
          item={{
            title: i18n.t('settings.referrals'),
            onPress: navToReferrals,
          }}
        />
        <MenuItem
          item={{
            title: i18n.t('settings.other'),
            onPress: navToOther,
          }}
        />
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
