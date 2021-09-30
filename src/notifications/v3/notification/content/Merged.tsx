import React from 'react';
import MText from '../../../../common/components/MText';
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
    <MText style={bodyTextStyle}>
      {`${i18n.t('and')} `}
      {notification.merged_count === 1 && (
        <MText
          style={bodyTextImportantStyle}
          onPress={() => router.navToChannel(notification.merged_from[0])}
        >
          {notification.merged_from[0].name + ' '}
        </MText>
      )}
      {notification.merged_count > 1 && (
        <MText onPress={router.navToEntity}>
          {notification.merged_count} {`${i18n.t('others')} `}
        </MText>
      )}
    </MText>
  );
};

export default Merged;
