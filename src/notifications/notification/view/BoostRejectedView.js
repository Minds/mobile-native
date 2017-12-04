import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

import BoostGiftView from './BoostGiftView';
import rejectionReasons from './../../../boost/RejectionReasons';

/**
 * Boost Rejected Notification Component
 */
export default class BoostRejectedView extends BoostGiftView {

  findReason(code) {
    return rejectionReasons.find((item) => {
      return item.code == code;
    });
  }

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const description = this.getDescription(entity);
    let reason = '';

    if (entity.params.reason && entity.params.reason !== -1) {
      reason = this.findReason(entity.params.reason).label;
    }

    return (
      <View style={styles.bodyContents}>
        <Text>Your boos {entity.params.points} {description} was rejected: <Text style={styles.link}>{entity.params.channel}</Text> {reason} Your points have been credited back to your wallet.</Text>
      </View>
    )
  }
}