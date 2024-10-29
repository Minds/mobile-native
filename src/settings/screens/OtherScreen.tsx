import React, { useCallback } from 'react';

import MenuItem from '~/common/components/menus/MenuItem';

import MenuSubtitle from '~/common/components/menus/MenuSubtitle';
import { IS_TENANT, MEMBERSHIP_TIERS_ENABLED } from '~/config/Config';
import { Screen } from '~/common/ui';
import sp from '~/services/serviceProvider';

function useNavCallback(screen) {
  return useCallback(() => {
    sp.navigation.navigate(screen);
  }, [screen]);
}

export default function () {
  const i18n = sp.i18n;
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

  if (IS_TENANT || sp.session.getUser().plus) {
    contentMigration.push({
      title: i18n.t('settings.rssSync'),
      onPress: useNavCallback('RssScreen'),
    });
  }

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
      {generateSection(i18n.t('settings.otherOptions.a'), contentAdmin)}
      {MEMBERSHIP_TIERS_ENABLED &&
        generateSection(i18n.t('settings.otherOptions.b'), paidContent)}
      {generateSection(
        i18n.t('settings.otherOptions.contentMigration'),
        contentMigration,
      )}
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

const firstMenuItemStyle = sp.styles.combine('bgPrimaryBackground');
const menuItemStyle = sp.styles.combine('bgPrimaryBackground', 'borderTop0x');
