import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

import number from '../../../../src/common/helpers/number';
import token from '../../../../src/common/helpers/token';
import BoostGiftView from './BoostGiftView';

/**
 * Boost Peer Request Notification Component
 */
export default class BoostPeerRequestView extends BoostGiftView {

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const description = this.getDescription(entity, 'their');
    const type = (entity.params.type == 'pro') ? 'USD' : 'tokens';

    return (
      <View style={styles.bodyContents}>
        <Text onPress={() => this.navToBoostConsole({filter:'peer'})}>
          <Text style={styles.bold} onPress={this.navToChannel}>@{entity.from.username}</Text> is offering <Text style={styles.bold}>{ number(token(entity.params.bid, 18), 0, 3) } {type} {description}</Text>
        </Text>
      </View>
    )
  }
}