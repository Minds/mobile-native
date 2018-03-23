import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

import BoostGiftView from './BoostGiftView';

/**
 * Boost Peer Accepted Notification Component
 */
export default class BoostPeerAcceptedView extends BoostGiftView {

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const description = this.getDescription(entity);
    const type = (entity.params.type == 'pro') ? 'USD' : 'points';

    return (
      <View style={styles.bodyContents} >
        <Text onPress={() => this.navToBoostConsole({filter:'peer'})}>
          <Text style={style.bold} onPress={this.navToChannel}>@{entity.from.username}</Text> accepted your bid of <Text style={style.bold}>{entity.params.bid} {type}</Text> {description}
        </Text>
      </View>
    )
  }
}