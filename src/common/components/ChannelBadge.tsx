import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ThemedStyles from '../../styles/ThemedStyles';
import { StyleSheet, Text } from 'react-native';
import type UserModel from '../../channel/UserModel';

type badge = {
  badge: string;
  icon: string;
  color: string;
  shoudlShow: (channel: UserModel, activeBadges: Array<string>) => boolean;
};

const badges: Array<badge> = [
  {
    badge: 'Verified',
    icon: 'verified-user',
    color: 'verifiedBadge',
    shoudlShow: (channel: UserModel, activeBadges: Array<string>) =>
      activeBadges.includes('verified') &&
      channel.verified &&
      !channel.is_admin,
  },
  {
    badge: 'Plus',
    icon: 'add_circle_outline',
    color: 'icon_active',
    shoudlShow: (channel: UserModel, activeBadges: Array<string>) =>
      activeBadges.includes('plus') && channel.plus && !channel.pro,
  },
  {
    badge: 'Pro',
    icon: 'business-center',
    color: 'icon_active',
    shoudlShow: (channel: UserModel, activeBadges: Array<string>) =>
      activeBadges.includes('plus') && channel.pro,
  },
  {
    badge: 'Admin',
    icon: 'verified-user',
    color: 'adminBadge',
    shoudlShow: (channel: UserModel, activeBadges: Array<string>) =>
      activeBadges.includes('admin') && channel.is_admin,
  },
  {
    badge: 'Founder',
    icon: 'flight-takeoff',
    color: 'icon_active',
    shoudlShow: (channel: UserModel, activeBadges: Array<string>) =>
      activeBadges.includes('founder') && channel.founder,
  },
  {
    badge: 'Boosted OnChain in the last 7 days',
    icon: 'link',
    color: 'icon_active',
    shoudlShow: (channel: UserModel, activeBadges: Array<string>) =>
      activeBadges.includes('onchain_booster') &&
      channel.onchain_booster * 1000 > Date.now(),
  },
];

type PropsType = {
  channel: UserModel;
  addSpace?: boolean;
  activeBadges?: Array<string>;
  iconSize?: number;
};

const ChannelBadge = ({
  channel,
  addSpace,
  activeBadges,
  iconSize,
}: PropsType) => {
  const badgesActive = activeBadges ?? ['verified', 'admin'];
  const sizeIcon = iconSize ?? 16;
  const badgesIcons: Array<JSX.Element> = [];

  badges.forEach((badge) => {
    if (badge.shoudlShow(channel, badgesActive)) {
      const badgeColor = {
        color: ThemedStyles.getColor(badge.color),
      };

      badgesIcons.push(
        <Icon
          key={badge.badge}
          name={badge.icon}
          size={sizeIcon}
          style={[styles.badge, badgeColor]}
        />,
      );

      // add space for the case where the badge is inside a text component
      if (addSpace) {
        badgesIcons.push(<Text> </Text>);
      }
    }
  });

  if (badgesIcons.length === 0) {
    return null;
  }

  return badgesIcons;
};

const styles = StyleSheet.create({
  badge: {
    marginHorizontal: 2,
  },
});

export default ChannelBadge;
