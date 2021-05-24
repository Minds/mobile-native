import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import i18n from '../../../common/services/i18n.service';
import { Notification } from '../../../types/Common';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/core';
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

type PropsType = {
  notification: Notification;
};
const DebouncedTouchableOpacity = withPreventDoubleTap(TouchableOpacity);

const NotificationItem = ({ notification }: PropsType) => {
  const navigation = useNavigation();
  const fromUser = UserModel.create(notification.from);
  const avatarSrc = fromUser.getAvatarSource();

  const navToChannel = () => {
    navigation.navigate('Channel', {
      guid: notification.from_guid,
      entity: fromUser,
    });
  };

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

  return (
    <View style={containerStyle}>
      <View style={styles.innerContainer}>
        <View style={styles.avatarContainer}>
          {
            //@ts-ignore
            <DebouncedTouchableOpacity onPress={navToChannel}>
              <FastImage source={avatarSrc} style={styles.avatar} />
            </DebouncedTouchableOpacity>
          }

          <NotificationIcon type={notification.type} />
        </View>
        <View style={styles.bodyContainer}>
          <Text style={bodyTextStyle}>
            <Text style={bodyTextImportantStyle} onPress={navToChannel}>
              {fromUser.name}
            </Text>
            {' ' + i18n.t(`notification.verbs.${notification.type}`)}
            {' ' + i18n.t(pronoun)}
            <Text style={bodyTextImportantStyle}>{' ' + noun}</Text>
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={bodyTextStyle}>
            {friendlyDateDiff(notification.created_timestamp * 1000, '', false)}
          </Text>
          <View style={styles.readIndicator} />
        </View>
      </View>
      <ContentPreview notification={notification} navigation={navigation} />
    </View>
  );
};

export default NotificationItem;
