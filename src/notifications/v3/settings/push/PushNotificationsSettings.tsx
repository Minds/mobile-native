import React from 'react';
import { observer } from 'mobx-react';
import { Text, ScrollView, View } from 'react-native';
import i18n from '../../../../common/services/i18n.service';
import ThemedStyles from '../../../../styles/ThemedStyles';
import { useStores } from '../../../../common/hooks/use-stores';
import MenuItem from '../../../../common/components/menus/MenuItem';
import type PushNotificationsSettingModel from './PushNotificationsSettingModel';
import Toggle from '../../../../common/components/Toggle';
import {
  containerStyle,
  itemTextStyle,
  itemTextStyleMedium,
  titleStyle,
} from '../email/EmailNotificationsSettings';

type PropsType = {};

const PushNotificationsSettings = ({}: PropsType) => {
  const theme = ThemedStyles.style;
  const { notifications } = useStores();
  return (
    <View style={containerStyle}>
      <ScrollView>
        <MenuItem
          item={{
            title: i18n.t('notificationSettings.enableDisable'),
            icon: (
              <SettingToggle
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
                icon: <SettingToggle setting={setting} />,
              }}
              containerItemStyle={theme.backgroundPrimary}
              titleStyle={itemTextStyleMedium}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const SettingToggle = observer(
  ({ setting }: { setting: PushNotificationsSettingModel | undefined }) => {
    if (!setting) {
      return null;
    }
    return (
      <Toggle
        onValueChange={() => setting.toggleEnabled()}
        value={setting.enabled}
      />
    );
  },
);

export default PushNotificationsSettings;
