//@ts-nocheck
import React, { Component } from 'react';

import { Text, View } from 'react-native';

import BoostGiftView from './BoostGiftView';
import i18n from '../../../common/services/i18n.service';

/**
 * Boost Completed Notification Component
 */
export default class BoostCompletedView extends BoostGiftView {
  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const description = this.getDescription(entity);

    const text = i18n.to(
      'notification.boostCompleted',
      {
        impressions: entity.params.impressions,
      },
      {
        description,
      },
    );

    return (
      <View style={styles.bodyContents}>
        <Text onPress={this.navToBoostConsole}>{text}</Text>
      </View>
    );
  }
}
