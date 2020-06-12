//@ts-nocheck
import React, { useCallback } from 'react';
import { Text, ScrollView } from 'react-native';
import MenuItem from '../../common/components/menus/MenuItem';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import MenuSubtitle from '../../common/components/menus/MenuSubtitle';
import NavigationService from '../../navigation/NavigationService';

function useNavCallback(screen) {
  return useCallback(() => {
    NavigationService.navigate(screen);
  }, [screen]);
}

export default function ({ navigation }) {
  const theme = ThemedStyles.style;

  const contentAdmin = [
    /*{
      title: i18n.t('settings.otherOptions.a1'),
      onPress: useNavCallback('ReportedContent'),
    },*/
    {
      title: i18n.t('settings.blockedChannels'),
      onPress: useNavCallback('BlockedChannels'),
    },
  ];

  const paidContent = [
    {
      title: i18n.t('settings.otherOptions.b1'),
      onPress: useNavCallback('TierManagementScreen'),
    },
    /*{
      title: i18n.t('settings.otherOptions.b2'),
      onPress: '',
    },*/
  ];

  const account = [
    {
      title: i18n.t('settings.deactivate'),
      onPress: useNavCallback('DeactivateChannel'),
    },
    {
      title: i18n.t('settings.otherOptions.c2'),
      onPress: useNavCallback('DeleteChannel'),
    },
  ];

  const info = [
    {
      title: i18n.t('settings.otherOptions.d1'),
      onPress: useNavCallback('AppInfo'),
    },
  ];

  return (
    <ScrollView style={[theme.flexContainer, theme.backgroundPrimary]}>
      <MenuSubtitle>{i18n.t('settings.otherOptions.a')}</MenuSubtitle>
      {contentAdmin.map((item, i) => (
        <MenuItem item={item} i={i} />
      ))}

      <MenuSubtitle>{i18n.t('settings.otherOptions.b')}</MenuSubtitle>
      {paidContent.map((item, i) => (
        <MenuItem item={item} i={i} />
      ))}

      <MenuSubtitle>{i18n.t('settings.otherOptions.c')}</MenuSubtitle>
      {account.map((item, i) => (
        <MenuItem item={item} i={i} />
      ))}

      <MenuSubtitle>{i18n.t('settings.otherOptions.d')}</MenuSubtitle>
      {info.map((item, i) => (
        <MenuItem item={item} i={i} />
      ))}
    </ScrollView>
  );
}
