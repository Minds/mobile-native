import React from 'react';
import { View, Text } from 'react-native';
import apiService from '../../../common/services/api.service';
import logService from '../../../common/services/log.service';
import sessionService from '../../../common/services/session.service';
import ThemedStyles from '../../../styles/ThemedStyles';

type PropsType = {
  index: number;
};

const UnreadNotifications = ({ index }: PropsType) => {
  const [count, setCount] = React.useState<number>(0);

  React.useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const response: any = await apiService.get(
          'api/v3/notifications/unread-count',
          {},
          undefined,
          apiService.buildAuthorizationHeader(
            sessionService.getTokenWithIndex(index),
          ),
        );
        if (response.count) {
          setCount(response.count);
        }
      } catch (err) {
        logService.exception('[UnreadNotifications] unread-count', err);
      }
    };
    loadUnreadCount();
  }, [index]);

  if (count === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.notifications}>{count}</Text>
    </View>
  );
};

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
});

export default UnreadNotifications;
