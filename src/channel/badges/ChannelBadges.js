import React, {
  PureComponent
} from 'react';

import {
  View,
  Text
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { CommonStyle } from '../../styles/Common';
import colors from '../../styles/Colors';
import { isAbsolute } from 'path';

/**
 * Channel Badges
 */
export default class ChannelBadges extends PureComponent {

  /**
   * Prop types
   */
  static propTypes = {
    channel: PropTypes.object.isRequired
  }

  /**
   * Render
   */
  render() {
    const size = this.props.size || 18;
    const channel = this.props.channel;

    const badges = []

    if (channel.plus) {
      badges.push(<Icon name="add-circle-outline" size={size} color={colors.primary} key={1} />)
    }

    if (channel.verified) {
      badges.push(<Icon name="verified-user" size={size} color={colors.primary} key={2} />)
    }

    if (channel.founder) {
      badges.push(<Icon name="flight-takeoff" size={size}  color={colors.primary} key={3} />)
    }

    return <Text>{badges}</Text>
  }
}