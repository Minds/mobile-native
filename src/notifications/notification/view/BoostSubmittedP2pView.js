import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

import BoostGiftView from './BoostGiftView';

/**
 * Boost Submitted P2P Notification Component
 */
export default class BoostSubmittedP2pView extends BoostGiftView {

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const description = this.getDescription(entity);

    return (
      <View style={styles.bodyContents}>
        <Text>{entity.params.points} points {description} is awaiting approval by <Text style={styles.link} onPress={this.navToChannel}>{entity.params.channel}</Text></Text>
      </View>
    )
  }
}