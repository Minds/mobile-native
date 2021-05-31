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
import NotificationIcon from './content/NotificationIcon';
import ContentPreview from './content/ContentPreview';
import useNotificationRouter from './useNotificationRouter';
import Merged from './content/Merged';

type PropsType = {
  notification: Notification;
};
const DebouncedTouchableOpacity = withPreventDoubleTap(TouchableOpacity);

const NotificationItem = ({ notification }: PropsType) => {
  const fromUser = UserModel.create(notification.from);
  const avatarSrc = fromUser.getAvatarSource();
  const router = useNotificationRouter(notification);

  const navToFromChannel = () => router.navToChannel(fromUser);

  const verb = ` ${i18n.t(`notification.verbs.${notification.type}`)}`;

  let pronoun =
    notification.type === 'quote'
      ? 'your'
      : notification.type === 'subscribe'
      ? ''
      : notification.entity?.owner_guid === sessionService.getUser().guid
      ? 'your'
      : 'their';
  pronoun = pronoun !== '' ? ` ${i18n.t(pronoun)}` : '';

  const nounText = getNoun(
    notification.entity?.type,
    notification.entity?.subtype,
  );
  const noun = (
    <Text style={bodyTextImportantStyle} onPress={router.navToEntity}>
      {' ' + nounText}
    </Text>
  );

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={
        notification.type === 'subscribe'
          ? navToFromChannel
          : router.navToEntity
      }>
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
            <Merged notification={notification} router={router} />
            {verb}
            {pronoun}
            {noun}
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
    </TouchableOpacity>
  );
};

const getNoun = (type: string | undefined, subtype: string | undefined) => {
  let noun = '';

  switch (type) {
    case 'comment':
      noun = 'comment';
      break;
    case 'object':
      noun = subtype || '';
      break;
    case 'user':
      noun = 'you';
      break;
    default:
      noun = 'post';
  }
  return noun;
};

export default NotificationItem;
