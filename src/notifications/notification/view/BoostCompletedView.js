import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

import BoostGiftView from './BoostGiftView';

/**
 * Boost Completed Notification Component
 */
export default class BoostCompletedView extends BoostGiftView {

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const description = this.getDescription(entity);

    return (
      <View style={styles.bodyContents}>
        <Text onPress={this.navToBoostConsole}>{entity.params.impressions}/{entity.params.impressions} views {description} have been met.</Text>
      </View>
    )
  }
}