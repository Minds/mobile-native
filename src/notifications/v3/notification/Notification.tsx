import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import FastImage from 'react-native-fast-image';
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
import InteractionsModal from '../../../common/components/interactions/InteractionsModal';
import sessionService from '../../../common/services/session.service';
import i18n from '../../../common/services/i18n.service';

type PropsType = {
  notification: Notification;
};
const DebouncedTouchableOpacity = withPreventDoubleTap(TouchableOpacity);

const NotificationItem = React.memo(({ notification }: PropsType) => {
  const fromUser = notification.from;
  const avatarSrc = React.useMemo(() => {
    return fromUser.getAvatarSource();
  }, [fromUser]);
  const modalRef = React.useRef<any>(null);
  const router = useNotificationRouter(notification, modalRef);
  const user = sessionService.getUser();

  const navToChannel = React.useCallback(() => router.navToChannel(user), [
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

  const Noun =
    notification.Noun !== '' ? (
      <Text style={bodyTextImportantStyle} onPress={navToChannel}>
        {notification.Noun}
      </Text>
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
          <Text style={bodyTextStyle}>
            {notification.type !== 'token_rewards_summary' && (
              <Text style={bodyTextImportantStyle} onPress={navToFromChannel}>
                {fromUser.name + ' '}
              </Text>
            )}
            <Merged notification={notification} router={router} />
            {notification.Verb}
            {notification.Pronoun ? ` ${notification.Pronoun}` : ''} {Noun}
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={bodyTextStyle}>
            {i18n.date(notification.created_timestamp * 1000, 'friendly')}
          </Text>
          {notification.read === false && <View style={readIndicatorStyle} />}
        </View>
      </View>
      <ContentPreview
        notification={notification}
        navigation={router.navigation}
      />
      {notification.type === 'subscribe' && notification.hasMerged && (
        <InteractionsModal entity={user} ref={modalRef} />
      )}
    </TouchableOpacity>
  );
});

export default NotificationItem;
