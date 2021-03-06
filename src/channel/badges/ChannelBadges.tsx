import React, { PureComponent } from 'react';

import { StyleSheet, ViewStyle, TextStyle, Falsy } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import type UserModel from '../UserModel';
import ThemedStyles from '../../styles/ThemedStyles';

type PropsType = {
  channel: UserModel;
  size?: number;
  style?: ViewStyle;
  iconStyle: TextStyle;
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

    const style = this.props.iconStyle
      ? [styles.icon, this.props.iconStyle]
      : styles.icon;

    if (channel.plus) {
      badges.push(
        //@ts-ignore style not defined in types
        <Icon name="add-circle-outline" size={size} style={style} key={1} />,
      );
    }

    if (channel.verified) {
      badges.push(
        <Icon
          name="verified-user"
          size={size}
          style={[
            styles.icon,
            this.props.iconStyle as any,
            channel.isAdmin() ? ThemedStyles.style.colorGreen : null,
          ]}
          key={2}
        />,
      );
    }

    if (channel.founder) {
      badges.push(
        //@ts-ignore style not defined in types
        <Icon name="flight-takeoff" size={size} style={style} key={3} />,
      );
    }

    return <>{badges}</>;
  }
}

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    backgroundColor: 'red',
    alignItems: 'flex-end',
  },
  icon: {
    marginLeft: 5,
    alignSelf: 'center',
  },
});
