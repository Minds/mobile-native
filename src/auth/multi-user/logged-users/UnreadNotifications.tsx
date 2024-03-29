import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import MText from '../../../common/components/MText';
import i18n from '../../../common/services/i18n.service';
import logService from '../../../common/services/log.service';
import sessionService from '../../../common/services/session.service';
import ThemedStyles from '../../../styles/ThemedStyles';

type PropsType = {
  index: number;
};

const UnreadNotifications = observer(({ index }: PropsType) => {
  const [count, setCount] = React.useState<number>(0);

  React.useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const response: any = await sessionService.apiServiceInstances[
          index
        ].get('api/v3/notifications/unread-count');
        if (response.count) {
          setCount(response.count);
        }
      } catch (err) {
        logService.exception('[UnreadNotifications] unread-count', err);
      }
    };
    loadUnreadCount();
  }, [index]);
  return (
    <>
      {count > 0 && (
        <View style={styles.container}>
          <MText style={styles.notifications}>{count}</MText>
        </View>
      )}
      {sessionService.getSessionForIndex(index).sessionExpired && (
        <MText style={styles.expired}>
          {i18n.t('multiUser.sessionExpired')}
        </MText>
      )}
    </>
  );
});

const styles = ThemedStyles.create({
  container: [
    'bgSecondaryText_Light',
    'borderRadius15x',
    'paddingHorizontal2x',
    'centered',
    'marginRight',
    { paddingVertical: 2 },
  ],
  notifications: ['colorWhite', 'fontMedium'],
  expired: ['colorSecondaryText', 'centered', 'marginRight'],
});

export default UnreadNotifications;
