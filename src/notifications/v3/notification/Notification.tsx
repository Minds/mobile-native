import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import {
  bodyTextImportantStyle,
  bodyTextStyle,
  containerStyle,
  readIndicatorStyle,
  styles,
} from './styles';
import NotificationIcon from './content/NotificationIcon';
import ContentPreview from './content/ContentPreview';
import useNotificationRouter from './useNotificationRouter';
import Merged from './content/Merged';
import type Notification from './NotificationModel';
import sessionService from '../../../common/services/session.service';
import i18n from '../../../common/services/i18n.service';
import MText from '../../../common/components/MText';

type PropsType = {
  notification: Notification;
  onShowSubscribers: () => void;
};
const DebouncedTouchableOpacity = withPreventDoubleTap(TouchableOpacity);

const NotificationItem = observer(
  ({ notification, onShowSubscribers }: PropsType) => {
    const fromUser = notification.from;
    const toGuid = notification.to_guid;
    const avatarSrc = React.useMemo(() => {
      return fromUser.getAvatarSource();
    }, [fromUser]);
    const router = useNotificationRouter(notification, onShowSubscribers);
    const user = sessionService.getUser();

    const navToOwnChannel = React.useCallback(() => router.navToChannel(user), [
      user,
      router,
    ]);

    const navToFromChannel = React.useCallback(
      () => router.navToChannel(fromUser),
      [fromUser, router],
    );

    if (!notification.isOfNotificationType()) {
      return null;
    }

    const navToChannel = useCallback(() => {
      // If the navigation was targeted to us navigate to own channel
      if (toGuid === user.guid) return navToOwnChannel();

      // otherwise navigate to the sender channel
      return navToFromChannel();
    }, [toGuid, user, router]);

    const Noun =
      notification.Noun !== '' ? (
        <MText style={bodyTextImportantStyle} onPress={navToChannel}>
          {notification.Noun}
        </MText>
      ) : null;

    return (
      <TouchableOpacity style={containerStyle} onPress={router.navToEntity}>
        <View style={styles.innerContainer}>
          <View style={styles.avatarContainer}>
            {
              //@ts-ignore
              <DebouncedTouchableOpacity onPress={navToFromChannel}>
                <FastImage source={avatarSrc} style={styles.avatar} />
              </DebouncedTouchableOpacity>
            }
            {
              // This view is here to ensure that the wrapped icon that have absolute position
              // doesn't change move when the notification is longer than expected
              <View>
                <NotificationIcon type={notification.type} />
              </View>
            }
          </View>
          <View style={styles.bodyContainer}>
            <MText style={bodyTextStyle}>
              {notification.type !== 'token_rewards_summary' && (
                <MText
                  style={bodyTextImportantStyle}
                  onPress={navToFromChannel}>
                  {fromUser.name + ' '}
                </MText>
              )}
              <Merged notification={notification} router={router} />
              {notification.Verb}
              {notification.Pronoun ? ` ${notification.Pronoun}` : ''} {Noun}
            </MText>
          </View>
          <View style={styles.timeContainer}>
            <MText style={bodyTextStyle}>
              {i18n.date(notification.created_timestamp * 1000, 'friendly')}
            </MText>
            {notification.read === false && <View style={readIndicatorStyle} />}
          </View>
        </View>
        <ContentPreview
          notification={notification}
          navigation={router.navigation}
        />
      </TouchableOpacity>
    );
  },
);

export default NotificationItem;
