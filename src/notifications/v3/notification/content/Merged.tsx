import React from 'react';
import { View, Text } from 'react-native';
import i18n from '../../../../common/services/i18n.service';
import type NotificationModel from '../NotificationModel';
import { bodyTextImportantStyle, bodyTextStyle } from '../styles';
import { NotificationRouter } from '../useNotificationRouter';

type PropsType = {
  notification: NotificationModel;
  router: NotificationRouter;
};

const Merged = ({ notification, router }: PropsType) => {
  if (!notification.hasMerged) {
    return null;
  }

  return (
    <Text style={bodyTextStyle}>
      {`${i18n.t('and')} `}
      {notification.merged_count === 1 && (
        <Text
          style={bodyTextImportantStyle}
          onPress={() => router.navToChannel(notification.merged_from[0])}>
          {notification.merged_from[0].name + ' '}
        </Text>
      )}
      {notification.merged_count > 1 && (
        <Text onPress={router.navToEntity}>
          {notification.merged_count} {`${i18n.t('others')} `}
        </Text>
      )}
    </Text>
  );
};

export default Merged;
