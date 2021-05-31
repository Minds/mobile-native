import React from 'react';
import { View, Text } from 'react-native';
import { Notification } from '../../../../types/Common';
import { bodyTextImportantStyle, bodyTextStyle } from '../styles';
import { NotificationRouter } from '../useNotificationRouter';

type PropsType = {
  notification: Notification;
  router: NotificationRouter;
};

const Merged = ({ notification, router }: PropsType) => {
  const hasMerged =
    notification.merged_count > 0 && notification.merged_from[0] !== undefined;

  if (!hasMerged) {
    return null;
  }

  return (
    <Text style={bodyTextStyle}>
      {' '}
      and{' '}
      <Text
        style={bodyTextImportantStyle}
        onPress={() => router.navToChannel(notification.merged_from[0])}>
        {notification.merged_from[0].name}
      </Text>
      {notification.merged_count > 1 && (
        <Text>and {notification.merged_count} others</Text>
      )}
    </Text>
  );
};

export default Merged;
