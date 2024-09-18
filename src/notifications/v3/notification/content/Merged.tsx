import React from 'react';
import MText from '~/common/components/MText';
import type NotificationModel from '../NotificationModel';
import { bodyTextImportantStyle, bodyTextStyle } from '../styles';
import { NotificationRouter } from '../useNotificationRouter';
import sp from '~/services/serviceProvider';

type PropsType = {
  notification: NotificationModel;
  router: NotificationRouter;
};

const Merged = ({ notification, router }: PropsType) => {
  if (!notification.hasMerged) {
    return null;
  }
  const i18n = sp.i18n;

  return (
    <MText style={bodyTextStyle}>
      {`${i18n.t('and')} `}
      {notification.merged_count === 1 && (
        <MText
          style={bodyTextImportantStyle}
          onPress={() => router.navToChannel(notification.merged_from[0])}>
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
