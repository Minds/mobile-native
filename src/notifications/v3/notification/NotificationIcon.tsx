import React from 'react';
import SmallCircleButton from '../../../common/components/SmallCircleButton';
import { NotificationType } from '../../../types/Common';
import { styles } from './styles';

const notificationIconsTypes = {
  vote_up: 'thumb-up',
  vote_down: 'thumb-down',
  comment: 'chat-bubble',
  tag: 'face',
  remind: 'repeat',
  quote: 'create',
  subscribe: 'person',
};

const NotificationIcon = ({ type }: { type: NotificationType }) => (
  <SmallCircleButton
    name={notificationIconsTypes[type]}
    type={'material'}
    reverseColor={'#FFFF'}
    color={'#1B85D6'}
    size={10}
    style={styles.notificationIconStyle}
  />
);

export default NotificationIcon;
