import React from 'react';
import { observer } from 'mobx-react';
import { ScrollView, View } from 'react-native';
import { useStores } from '~/common/hooks/use-stores';
import {
  containerStyle,
  titleStyle,
} from '../email/EmailNotificationsSettings';
import MText from '~/common/components/MText';
import Empty from '~/common/components/Empty';
import { Button } from '~/common/ui';
import CenteredLoading from '~/common/components/CenteredLoading';
import MenuItemToggle from '~/common/components/menus/MenuItemToggle';
import sp from '~/services/serviceProvider';

type PropsType = {};

const PushNotificationsSettings = ({}: PropsType) => {
  const { notifications } = useStores();
  const i18n = sp.i18n;

  React.useEffect(() => {
    if (notifications.pushNotificationsSettings === null) {
      notifications.loadPushNotificationsSettings();
    }
  }, [notifications]);

  const allSetting = notifications.pushNotificationsSettings?.find(
    setting => setting.notification_group === 'all',
  );

  const body =
    notifications.pushNotificationsSettings &&
    notifications.pushNotificationsSettings.length > 0 ? (
      <>
        <MenuItemToggle
          title={i18n.t('notificationSettings.all')}
          value={allSetting?.enabled}
          onChange={allSetting?.toggleEnabled || (() => null)}
        />
        <MText style={titleStyle}>
          {i18n.t('notificationSettings.related').toUpperCase()}
        </MText>
        {notifications.pushNotificationsSettings.map(setting => {
          if (setting.notification_group === 'all') {
            return null;
          }
          return (
            <MenuItemToggle
              key={setting.notificationGroup}
              title={setting.notificationGroup}
              value={setting.enabled}
              onChange={setting.toggleEnabled}
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

export default observer(PushNotificationsSettings);
