//@ts-nocheck
import React, { useCallback } from 'react';
import { View, FlatList, Text, Linking } from 'react-native';
import MenuItem from '../common/components/menus/MenuItem';
import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';
import authService from '../auth/AuthService';

const keyExtractor = (item, index) => index.toString();

export default function ({ navigation }) {
  const theme = ThemedStyles.style;

  const navToAccount = useCallback(() => navigation.push('Account'), [
    navigation,
  ]);

  const navToNetwork = useCallback(() => navigation.push('Network'), [
    navigation,
  ]);

  const navToSecurity = useCallback(() => navigation.push('Security'), [
    navigation,
  ]);

  const navToBilling = useCallback(() => navigation.push('Billing'), [
    navigation,
  ]);

  const navToOther = useCallback(() => navigation.push('Other'), [navigation]);

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
      title: i18n.t('settings.network'),
      onPress: navToNetwork,
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

  const help = {
    title: i18n.t('help'),
    onPress: () => Linking.openURL('https://www.minds.com/help'),
    icon: {
      name: 'help-circle-outline',
      type: 'material-community',
    },
  };

  return (
    <View style={[theme.flexContainer, theme.backgroundPrimary]}>
      <View style={innerWrapper}>
        <Text
          style={[
            theme.titleText,
            theme.paddingLeft4x,
            theme.paddingVertical2x,
          ]}>
          {i18n.t('moreScreen.settings')}
        </Text>
        <FlatList
          data={list}
          renderItem={MenuItem}
          style={theme.backgroundPrimary}
          keyExtractor={keyExtractor}
        />
      </View>
      <View style={[innerWrapper, theme.marginTop7x]}>
        <MenuItem item={themeChange} i={4} />
        <MenuItem item={help} i={5} />
        <MenuItem item={logOut} i={6} />
      </View>
    </View>
  );
}
