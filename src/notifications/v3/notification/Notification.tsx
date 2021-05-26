import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import i18n from '../../../common/services/i18n.service';
import { Notification } from '../../../types/Common';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import FastImage from 'react-native-fast-image';
import UserModel from '../../../channel/UserModel';
import sessionService from '../../../common/services/session.service';
import friendlyDateDiff from '../../../common/helpers/friendlyDateDiff';
import {
  bodyTextImportantStyle,
  bodyTextStyle,
  containerStyle,
  styles,
} from './styles';
import NotificationIcon from './NotificationIcon';
import ContentPreview from './ContentPreview';
import useNotificationRouter from './useNotificationRouter';

type PropsType = {
  notification: Notification;
};
const DebouncedTouchableOpacity = withPreventDoubleTap(TouchableOpacity);

const NotificationItem = ({ notification }: PropsType) => {
  const fromUser = UserModel.create(notification.from);
  const avatarSrc = fromUser.getAvatarSource();
  const router = useNotificationRouter(notification);

  const pronoun =
    notification.type === 'quote'
      ? 'your'
      : notification.type === 'subscribe'
      ? ''
      : notification.entity?.owner_guid === sessionService.getUser().guid
      ? 'your'
      : 'their';

  let noun = '';

  switch (notification.entity?.type) {
    case 'comment':
      noun = 'comment';
      break;
    case 'object':
      noun = notification.entity?.subtype;
      break;
    case 'user':
      noun = 'you';
      break;
    default:
      noun = 'post';
  }

  const hasMerged =
    notification.merged_count > 0 && notification.merged_from[0] !== undefined;

  const navToFromChannel = () => router.navToChannel(fromUser);

  return (
    <View style={containerStyle}>
      <View style={styles.innerContainer}>
        <View style={styles.avatarContainer}>
          {
            //@ts-ignore
            <DebouncedTouchableOpacity onPress={navToFromChannel}>
              <FastImage source={avatarSrc} style={styles.avatar} />
            </DebouncedTouchableOpacity>
          }

          <NotificationIcon type={notification.type} />
        </View>
        <View style={styles.bodyContainer}>
          <Text style={bodyTextStyle}>
            <Text style={bodyTextImportantStyle} onPress={navToFromChannel}>
              {fromUser.name}
            </Text>
            {hasMerged && (
              <Text style={bodyTextStyle}>
                {' '}
                and{' '}
                <Text
                  style={bodyTextImportantStyle}
                  onPress={() =>
                    router.navToChannel(notification.merged_from[0])
                  }>
                  {notification.merged_from[0].name}
                </Text>
                {notification.merged_count > 1 && (
                  <Text>and {notification.merged_count} others</Text>
                )}
              </Text>
            )}
            {' ' + i18n.t(`notification.verbs.${notification.type}`)}
            {' ' + pronoun !== '' ? i18n.t(pronoun) : ''}
            <Text style={bodyTextImportantStyle} onPress={router.navToEntity}>
              {' ' + noun}
            </Text>
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={bodyTextStyle}>
            {friendlyDateDiff(notification.created_timestamp * 1000, '', false)}
          </Text>
          {notification.read === false && <View style={styles.readIndicator} />}
        </View>
      </View>
      <ContentPreview
        notification={notification}
        navigation={router.navigation}
      />
    </View>
  );
};

export default NotificationItem;
