import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import formatDate from '../../common/helpers/date';
import { NotificationType } from './Notification';

type PropsType = {
  onPress: () => void;
  styles: any;
  entity: NotificationType;
  children: React.ReactNode;
};

const NotificationBody = (props: PropsType) => {
  return (
    <TouchableOpacity style={props.styles.body} onPress={props.onPress}>
      {props.children}
      <Text style={props.styles.timestamp}>
        {formatDate(props.entity.time_created)}
      </Text>
    </TouchableOpacity>
  );
};

export default NotificationBody;
