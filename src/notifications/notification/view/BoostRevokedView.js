import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

import BoostGiftView from './BoostGiftView';

/**
 * Boost Revoked Notification Component
 */
export default class BoostRevokedView extends BoostGiftView {

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const description = this.getDescription(entity);

    return (
      <View style={styles.bodyContents}>
        <Text onPress={this.navToBoostConsole}>Your boost {entity.params.points} {description} was revoked</Text>
      </View>
    )
  }
}