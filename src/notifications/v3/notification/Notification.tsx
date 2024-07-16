import React from 'react';
import { observer } from 'mobx-react';
import { View, TouchableOpacity } from 'react-native';

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
import MText from '~/common/components/MText';
import { Image } from 'expo-image';

import sp from '~/services/serviceProvider';

type PropsType = {
  notification: Notification;
  onShowSubscribers: () => void;
};
const DebouncedTouchableOpacity = withPreventDoubleTap(TouchableOpacity);

const NotificationItem = observer(
  ({ notification, onShowSubscribers }: PropsType) => {
    const fromUser = notification.from;
    const avatarSrc = React.useMemo(() => {
      return fromUser.getAvatarSource();
    }, [fromUser]);
    const router = useNotificationRouter(notification, onShowSubscribers);

    const navToFromChannel = React.useCallback(
      () => router.navToChannel(fromUser),
      [fromUser, router],
    );

    if (!notification.isOfNotificationType()) {
      return null;
    }

    const Noun =
      notification.Noun !== '' ? (
        <MText style={bodyTextImportantStyle} onPress={router.navigateToObject}>
          {notification.Noun}
        </MText>
      ) : null;
    const Subject = notification.Subject ? (
      <MText style={bodyTextImportantStyle} onPress={navToFromChannel}>
        {(notification.isImperative ? ' ' : '') +
          notification.Subject +
          (notification.isImperative ? "'s " : ' ')}
      </MText>
    ) : null;

    return (
      <TouchableOpacity
        style={[containerStyle, sp.styles.style.alignSelfCenterMaxWidth]}
        onPress={router.navToEntity}>
        <View style={styles.innerContainer}>
          <View style={styles.avatarContainer}>
            {
              //@ts-ignore
              <DebouncedTouchableOpacity onPress={navToFromChannel}>
                <Image source={avatarSrc} style={styles.avatar} />
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
              {!notification.isImperative && Subject}
              <Merged notification={notification} router={router} />
              {notification.Verb}
              {notification.isImperative && Subject}
              {notification.Pronoun ? ` ${notification.Pronoun}` : ''} {Noun}
            </MText>
          </View>
          <View style={styles.timeContainer}>
            <MText style={bodyTextStyle}>
              {sp.i18n.date(notification.created_timestamp * 1000, 'friendly')}
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
