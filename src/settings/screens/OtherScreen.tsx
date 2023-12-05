import React, { useCallback } from 'react';
import MenuItem from '../../common/components/menus/MenuItem';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import MenuSubtitle from '../../common/components/menus/MenuSubtitle';
import NavigationService from '../../navigation/NavigationService';
import { useIsFeatureOn } from 'ExperimentsProvider';
import {
  BLOCK_USER_ENABLED,
  IS_TENANT,
  MEMBERSHIP_TIERS_ENABLED,
  TWITTER_ENABLED,
} from '~/config/Config';
import sessionService from '~/common/services/session.service';
import { Screen } from '~/common/ui';

function useNavCallback(screen) {
  return useCallback(() => {
    NavigationService.navigate(screen);
  }, [screen]);
}

export default function () {
  const isTwitterFFEnabled = useIsFeatureOn('engine-2503-twitter-feats');
  const contentAdmin = [
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
  ];

  const contentMigration: Array<any> = [];

  if (isTwitterFFEnabled && TWITTER_ENABLED) {
    contentMigration.push({
      title: i18n.t('settings.twitterSync.title'),
      onPress: useNavCallback('TwitterSync'),
    });
  }

  if (IS_TENANT || sessionService.getUser().plus) {
    contentMigration.push({
      title: i18n.t('settings.rssSync'),
      onPress: useNavCallback('RssScreen'),
    });
  }

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
    <Screen scroll>
      {BLOCK_USER_ENABLED &&
        generateSection(i18n.t('settings.otherOptions.a'), contentAdmin)}
      {MEMBERSHIP_TIERS_ENABLED &&
        generateSection(i18n.t('settings.otherOptions.b'), paidContent)}
      {generateSection(
        i18n.t('settings.otherOptions.contentMigration'),
        contentMigration,
      )}
      {generateSection(i18n.t('settings.otherOptions.c'), account)}
      {generateSection(i18n.t('settings.otherOptions.f'), data)}
      {generateSection(i18n.t('settings.otherOptions.d'), info)}
    </Screen>
  );
}

const generateSection = (title, items) => {
  return items.length ? (
    <>
      <MenuSubtitle>{title}</MenuSubtitle>
      {items.map((item, i) => (
        <MenuItem
          key={i}
          {...item}
          i={i}
          containerItemStyle={i > 0 ? menuItemStyle : firstMenuItemStyle}
        />
      ))}
    </>
  ) : null;
};

const firstMenuItemStyle = ThemedStyles.combine('bgPrimaryBackground');
const menuItemStyle = ThemedStyles.combine(
  'bgPrimaryBackground',
  'borderTop0x',
);
