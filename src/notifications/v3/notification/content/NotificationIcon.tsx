import React from 'react';
import SmallCircleButton from '../../../../common/components/SmallCircleButton';
import { NotificationType } from '../NotificationModel';
import { styles } from '../styles';

const notificationIconsTypes = {
  vote_up: { name: 'thumb-up', type: 'material' },
  vote_down: { name: 'thumb-down', type: 'material' },
  comment: { name: 'chat-bubble', type: 'material' },
  tag: { name: 'face', type: 'material' },
  remind: { name: 'repeat', type: 'material' },
  quote: { name: 'create', type: 'material' },
  subscribe: { name: 'person', type: 'material' },
  group_queue_add: { name: 'people', type: 'material' },
  token_rewards_summary: { name: 'rocket', type: 'ionicon' },
};

const NotificationIcon = ({ type }: { type: NotificationType }) => (
  <SmallCircleButton
    name={notificationIconsTypes[type].name}
    type={notificationIconsTypes[type].type}
    reverseColor={'#FFFF'}
    color={'#1B85D6'}
    size={10}
    style={styles.notificationIconStyle}
  />
);

export default NotificationIcon;
