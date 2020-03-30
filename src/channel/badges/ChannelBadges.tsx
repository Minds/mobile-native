import React, { PureComponent } from 'react';

import { View, StyleSheet, ViewStyle } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import type UserModel from '../UserModel';

type PropsType = {
  channel: UserModel;
  size?: number;
  style?: ViewStyle;
};

/**
 * Channel Badges
 */
export default class ChannelBadges extends PureComponent<PropsType> {
  /**
   * Render
   */
  render() {
    const size = this.props.size || 25;
    const channel = this.props.channel;

    const badges: Array<React.ReactNode> = [];

    if (channel.plus) {
      badges.push(
        <Icon
          name="add-circle-outline"
          size={size}
          style={styles.icon}
          key={1}
        />,
      );
    }

    if (channel.verified) {
      badges.push(
        <Icon name="verified-user" size={size} style={styles.icon} key={2} />,
      );
    }

    if (channel.founder) {
      badges.push(
        <Icon name="flight-takeoff" size={size} style={styles.icon} key={3} />,
      );
    }

    return <View style={[styles.view, this.props.style]}>{badges}</View>;
  }
}

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowColor: '#000000',
    shadowOpacity: 0.35,
    marginLeft: 5,
    textShadowRadius: 5,
    paddingBottom: 5,
  },
});
