import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

import BoostGiftView from './BoostGiftView';

/**
 * Boost Accepted Notification Component
 */
export default class BoostAcceptedView extends BoostGiftView {

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const description = this.getDescription(entity);

    return (
      <View style={styles.bodyContents}>
        <Text>{entity.params.impressions || entity.params.points} points {description} were accepted.</Text>
      </View>
    )
  }
}