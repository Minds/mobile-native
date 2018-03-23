import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

import BoostGiftView from './BoostGiftView';

/**
 * Boost Submitted Notification Component
 */
export default class BoostSubmittedView extends BoostGiftView {

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const isComment = entity.entityObj.type != 'comment';

    const description = this.getDescription(entity);

    return (
      <View style={styles.bodyContents}>
        <Text onPress={this.navToBoostConsole}>{entity.params.impressions} views {description} is awaiting approval</Text>
      </View>
    )
  }
}