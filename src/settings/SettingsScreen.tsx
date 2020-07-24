//@ts-nocheck
import React, { useCallback } from 'react';
import { View, FlatList, Text } from 'react-native';
import MenuItem from '../common/components/menus/MenuItem';
import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';
import Topbar from '../topbar/Topbar';
import authService from '../auth/AuthService';

const keyExtractor = (item, index) => index.toString();

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
      <Topbar navigation={navigation} />
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
        <MenuItem item={logOut} i={5} />
      </View>
    </View>
  );
}
