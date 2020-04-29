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

  const navToTFA = useCallback(() => navigation.push('TFAScreen'), [
    navigation,
  ]);

  const navToDevices = useCallback(() => navigation.push('DevicesScreen'), [
    navigation,
  ]);

  const keyExtractor = useCallback((item, index) => index.toString());

  const list = [
    {
      title: i18n.t('settings.securityOptions.1'),
      onPress: navToTFA,
    },
    {
      title: i18n.t('settings.securityOptions.2'),
      onPress: navToDevices,
    },
  ];

  return (
    <View
      style={[
        CS.flexContainer,
        CS.backgroundPrimary,
        CS.borderBottomHair,
        CS.borderPrimary,
        CS.paddingTop4x,
      ]}>
      <FlatList
        data={list}
        renderItem={SettingsItem}
        style={[CS.backgroundPrimary]}
        keyExtractor={keyExtractor}
      />
    </View>
  );
}
