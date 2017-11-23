import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

import BoostGiftView from './BoostGiftView';

/**
 * Boost Peer Request Notification Component
 */
export default class BoostPeerRequestView extends BoostGiftView {

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const description = this.getDescription(entity, 'their');
    const type = (entity.params.type == 'pro') ? 'USD' : 'points';

    return (
      <View style={styles.bodyContents}>
        <Text>
          <Text style={style.bold}>@{entity.from.username}</Text> is offering <Text style={style.bold}>{entity.params.bid} {type}</Text> {description}
        </Text>
      </View>
    )
  }
}