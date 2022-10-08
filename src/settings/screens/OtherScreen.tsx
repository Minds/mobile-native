import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
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

export default function () {
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

  const referrals = [
    {
      title: i18n.t('settings.referrals'),
      onPress: useNavCallback('Referrals'),
    },
  ];

  const paidContent = [
    {
      title: i18n.t('settings.otherOptions.b1'),
      onPress: useNavCallback('TierManagementScreen'),
    },
  ];

  const contentMigration = [
    {
      title: i18n.t('settings.twitterSync.title'),
      onPress: useNavCallback('TwitterSync'),
    },
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

  const data = [
    {
      title: i18n.t('settings.networkOptions.1'),
      onPress: useNavCallback('DataSaverScreen'),
    },
  ];

  const info = [
    {
      title: i18n.t('settings.otherOptions.d1'),
      onPress: useNavCallback('AppInfo'),
    },
  ];

  return (
    <ScrollView style={containerStyle}>
      {generateSection(i18n.t('settings.otherOptions.a'), contentAdmin)}
      {generateSection(i18n.t('settings.otherOptions.g'), referrals)}
      {generateSection(i18n.t('settings.otherOptions.b'), paidContent)}
      {generateSection(
        i18n.t('settings.otherOptions.contentMigration'),
        contentMigration,
      )}
      {generateSection(i18n.t('settings.otherOptions.c'), account)}
      {generateSection(i18n.t('settings.otherOptions.f'), data)}
      {generateSection(i18n.t('settings.otherOptions.d'), info)}
    </ScrollView>
  );
}

const generateSection = (title, items) => (
  <>
    <MenuSubtitle>{title}</MenuSubtitle>
    {items.map((item, i) => (
      <MenuItem
        {...item}
        i={i}
        containerItemStyle={i > 0 ? menuItemStyle : firstMenuItemStyle}
      />
    ))}
  </>
);

const firstMenuItemStyle = ThemedStyles.combine('bgPrimaryBackground');
const menuItemStyle = ThemedStyles.combine(
  'bgPrimaryBackground',
  'borderTop0x',
);
const containerStyle = ThemedStyles.combine(
  'flexContainer',
  'bgPrimaryBackground',
);
