import React from 'react';
import SmallCircleButton from '../../../../common/components/SmallCircleButton';
import ThemedStyles from '../../../../styles/ThemedStyles';
import { NotificationType } from '../NotificationModel';
import { styles } from '../styles';

const notificationIconsTypes: {
  [k in NotificationType]: { name: string; type: string };
} = {
  vote_up: { name: 'thumb-up', type: 'material' },
  vote_down: { name: 'thumb-down', type: 'material' },
  comment: { name: 'chat-bubble', type: 'material' },
  tag: { name: 'face', type: 'material' },
  remind: { name: 'repeat', type: 'material' },
  quote: { name: 'create', type: 'material' },
  subscribe: { name: 'person', type: 'material' },
  group_queue_add: { name: 'people', type: 'material' },
  token_rewards_summary: { name: 'rocket', type: 'ionicon' },
  group_queue_approve: { name: 'people', type: 'material' },
  wire_received: { name: 'attach-money', type: 'material' },
  group_queue_reject: { name: 'people', type: 'material' },
  boost_peer_request: { name: 'attach-money', type: 'material' },
  boost_peer_accepted: { name: 'attach-money', type: 'material' },
  boost_peer_rejected: { name: 'attach-money', type: 'material' },
  boost_rejected: { name: 'trending-up', type: 'material-community' },
  boost_accepted: { name: 'trending-up', type: 'material-community' },
  boost_completed: { name: 'trending-up', type: 'material-community' },
  supermind_created: { name: 'tips-and-updates', type: 'material' },
  supermind_rejected: { name: 'tips-and-updates', type: 'material' },
  supermind_accepted: { name: 'tips-and-updates', type: 'material' },
  supermind_expired: { name: 'tips-and-updates', type: 'material' },
  supermind_expire24h: { name: 'tips-and-updates', type: 'material' },
  affiliate_earnings_deposited: { name: 'attach-money', type: 'material' },
  referrer_affiliate_earnings_deposited: {
    name: 'attach-money',
    type: 'material',
  },
  gift_card_recipient_notified: { name: 'redeem', type: 'material' },
  post_subscription: { name: 'create', type: 'material' },
};

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  if (!notificationIconsTypes[type]) {
    return null;
  }

  return (
    <SmallCircleButton
      name={notificationIconsTypes[type].name}
      type={notificationIconsTypes[type].type}
      reverseColor={ThemedStyles.getColor('ButtonText')}
      color={ThemedStyles.getColor('Link')}
      size={10}
      style={styles.notificationIconStyle}
    />
  );
};

export default NotificationIcon;
