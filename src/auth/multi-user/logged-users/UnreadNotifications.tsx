import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import MText from '~/common/components/MText';
import sp from '~/services/serviceProvider';

type PropsType = {
  index: number;
};

const UnreadNotifications = observer(({ index }: PropsType) => {
  const [count, setCount] = React.useState<number>(0);

  React.useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const response: any = await sp.session.apiServiceInstances[index].get(
          'api/v3/notifications/unread-count',
        );
        if (response.count) {
          setCount(response.count);
        }
      } catch (err) {
        sp.log.exception('[UnreadNotifications] unread-count', err);
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
      {sp.session.getSessionForIndex(index).sessionExpired && (
        <MText style={styles.expired}>
          {sp.i18n.t('multiUser.sessionExpired')}
        </MText>
      )}
    </>
  );
});

const styles = sp.styles.create({
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
