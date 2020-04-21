//@ts-nocheck
import React, { useCallback } from 'react';
import { View, FlatList } from 'react-native';
import SettingsItem from '../SettingsItem';
import ThemedStyles from '../../styles/ThemedStyles';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../common/services/i18n.service';

export default function () {
  const CS = ThemedStyles.style;
  const navigation = useNavigation();

  const navToEmailScreen = useCallback(() => navigation.push('SettingsEmail'), [
    navigation,
  ]);

  const navToPasswordScreen = useCallback(
    () => navigation.push('SettingsPassword'),
    [navigation],
  );

  const navToNotificationsScreen = useCallback(
    () => navigation.push('SettingsNotifications'),
    [navigation],
  );

  const navToLanguageScreen = useCallback(
    () => navigation.push('LanguageScreen'),
    [navigation],
  );

  const navToNSFWScreen = useCallback(() => navigation.push('NSFWScreen'), [
    navigation,
  ]);

  const keyExtractor = (item, index) => index.toString();

  const list = [
    {
      title: i18n.t('settings.accountOptions.1'),
      onPress: navToEmailScreen,
    },
    {
      title: i18n.t('settings.accountOptions.2'),
      onPress: navToLanguageScreen,
    },
    {
      title: i18n.t('settings.accountOptions.3'),
      onPress: navToPasswordScreen,
    },
    {
      title: i18n.t('settings.accountOptions.4'),
      onPress: navToNotificationsScreen,
    },
    {
      title: i18n.t('settings.accountOptions.5'),
      onPress: navToNSFWScreen,
    },
  ];

  return (
    <View
      style={[
        CS.flexContainer,
        CS.backgroundPrimary,
        CS.borderTopHair,
        CS.borderBottomHair,
        CS.borderPrimary,
      ]}>
      <FlatList
        data={list}
        renderItem={SettingsItem}
        style={[CS.backgroundPrimary, CS.paddingTop4x]}
        keyExtractor={keyExtractor}
      />
    </View>
  );
}
