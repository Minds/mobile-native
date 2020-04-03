//@ts-nocheck
import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

import BoostGiftView from './BoostGiftView';
import i18n from '../../../common/services/i18n.service';

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
        <Text onPress={this.navToBoostConsole}>{i18n.to('notification.boostSubmittedP2p', {points: entity.params.points}, {description})} <Text style={styles.link} onPress={this.navToChannel}>{entity.params.channel}</Text></Text>
      </View>
    )
  }
}