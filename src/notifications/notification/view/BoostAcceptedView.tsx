//@ts-nocheck
import React, { Component } from 'react';

import { Text, View } from 'react-native';

import BoostGiftView from './BoostGiftView';
import i18n from '../../../common/services/i18n.service';

/**
 * Boost Accepted Notification Component
 */
export default class BoostAcceptedView extends BoostGiftView {
  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const description = this.getDescription(entity);

    const text = i18n.to(
      'notification.boostAccepted',
      {
        count: entity.params.impressions || entity.params.points,
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
