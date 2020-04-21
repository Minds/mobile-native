//@ts-nocheck
import React, { useCallback } from 'react';
import { View, FlatList } from 'react-native';
import SettingsItem from './SettingsItem';
import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';
import Topbar from '../topbar/Topbar';
import authService from '../auth/AuthService';

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

  const keyExtractor = useCallback((item, index) => index.toString());

  const setDarkMode = () => {
    if (ThemedStyles.theme) {
      ThemedStyles.setLight();
    } else {
      ThemedStyles.setDark();
    }
  };

  const list = [
    {
      title: i18n.t('settings.account'),
      onPress: navToAccount,
    },
    {
      title: i18n.t('settings.security'),
      onPress: navToSecurity,
    },
    {
      title: i18n.t('settings.billing'),
      onPress: navToBilling,
    },
    {
      title: i18n.t('settings.other'),
      onPress: navToOther,
    },
  ];

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

  return (
    <View style={[theme.flexContainer, theme.backgroundPrimary]}>
      <Topbar
        title={i18n.t('moreScreen.settings')}
        navigation={navigation}
        renderBack
        background={theme.backgroundPrimary}
      />
      <View style={innerWrapper}>
        <FlatList
          data={list}
          renderItem={SettingsItem}
          style={[theme.backgroundPrimary, theme.paddingTop4x]}
          keyExtractor={keyExtractor}
        />
      </View>
      <View style={[innerWrapper, theme.marginTop7x]}>
        <SettingsItem item={themeChange} i={4} />
        <SettingsItem item={logOut} i={5} />
      </View>
    </View>
  );
}
