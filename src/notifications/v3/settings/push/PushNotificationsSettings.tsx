import React from 'react';
import { observer } from 'mobx-react';
import { Text, Switch, ScrollView } from 'react-native';
import i18n from '../../../../common/services/i18n.service';
import ThemedStyles from '../../../../styles/ThemedStyles';
import { useStores } from '../../../../common/hooks/use-stores';
import MenuItem from '../../../../common/components/menus/MenuItem';
import type PushNotificationsSettingModel from './PushNotificationsSettingModel';

type PropsType = {};

const PushNotificationsSettings = ({}: PropsType) => {
  const theme = ThemedStyles.style;
  const { notifications } = useStores();
  return (
    <ScrollView style={containerStyle}>
      <MenuItem
        item={{
          title: i18n.t('notificationSettings.enableDisable'),
          icon: (
            <SettingSwitch
              setting={notifications.pushNotificationsSettings.find(
                setting => setting.notification_group === 'all',
              )}
            />
          ),
        }}
        containerItemStyle={theme.backgroundPrimary}
        titleStyle={itemTextStyle}
      />
      <Text style={titleStyle}>
        {i18n.t('notificationSettings.related').toUpperCase()}
      </Text>
      {notifications.pushNotificationsSettings.map(setting => {
        if (setting.notification_group === 'all') {
          return null;
        }
        return (
          <MenuItem
            item={{
              title: setting.notificationGroup,
              icon: <SettingSwitch setting={setting} />,
            }}
            containerItemStyle={theme.backgroundPrimary}
            titleStyle={itemTextStyleMedium}
          />
        );
      })}
    </ScrollView>
  );
};

const SettingSwitch = observer(
  ({ setting }: { setting: PushNotificationsSettingModel | undefined }) => {
    if (!setting) {
      return null;
    }
    return (
      <Switch
        trackColor={{ false: '#767577', true: '#1B85D6' }}
        thumbColor={setting.enabled ? '#ffffff' : '#f4f3f4'}
        ios_backgroundColor="#767577"
        onValueChange={() => setting._toggleEnabled()}
        value={setting.enabled}
      />
    );
  },
);

const titleStyle = ThemedStyles.combine(
  'fontMedium',
  'fontL',
  'colorSecondaryText',
  'marginBottom5x',
  'marginTop8x',
  'paddingLeft4x',
);

const itemTextStyle = ThemedStyles.combine('fontL', 'colorPrimaryText');

const itemTextStyleMedium = ThemedStyles.combine('fontMedium', itemTextStyle);

const containerStyle = ThemedStyles.combine(
  'flexContainer',
  'backgroundSecondary',
  'paddingTop9x',
);

export default PushNotificationsSettings;
