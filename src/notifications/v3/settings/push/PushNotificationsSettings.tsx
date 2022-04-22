import React from 'react';
import { observer } from 'mobx-react';
import { ScrollView, View } from 'react-native';
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
import MText from '../../../../common/components/MText';
import Empty from '~/common/components/Empty';
import { Button } from '~/common/ui';
import CenteredLoading from '~/common/components/CenteredLoading';

type PropsType = {};

const PushNotificationsSettings = ({}: PropsType) => {
  const theme = ThemedStyles.style;
  const { notifications } = useStores();

  React.useEffect(() => {
    if (notifications.pushNotificationsSettings === null) {
      notifications.loadPushNotificationsSettings();
    }
  }, [notifications]);

  const body =
    notifications.pushNotificationsSettings &&
    notifications.pushNotificationsSettings.length > 0 ? (
      <>
        <MenuItem
          item={{
            title: i18n.t('notificationSettings.all'),
            icon: (
              <SettingToggle
                setting={notifications.pushNotificationsSettings.find(
                  setting => setting.notification_group === 'all',
                )}
              />
            ),
          }}
          containerItemStyle={theme.bgPrimaryBackground}
          titleStyle={itemTextStyle}
        />
        <MText style={titleStyle}>
          {i18n.t('notificationSettings.related').toUpperCase()}
        </MText>
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
              containerItemStyle={theme.bgPrimaryBackground}
              titleStyle={itemTextStyleMedium}
            />
          );
        })}
      </>
    ) : !notifications.pushNotificationsSettings ? (
      <Empty title={i18n.t('cantLoad')}>
        <Button
          top="L"
          onPress={() => notifications.loadPushNotificationsSettings()}
          type="action">
          {i18n.t('tryAgain')}
        </Button>
      </Empty>
    ) : (
      <CenteredLoading />
    );

  return (
    <View style={containerStyle}>
      <ScrollView>{body}</ScrollView>
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

export default observer(PushNotificationsSettings);
