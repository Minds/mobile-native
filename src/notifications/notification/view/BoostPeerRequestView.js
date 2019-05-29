import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

import number from '../../../../src/common/helpers/number';
import token from '../../../../src/common/helpers/token';

import BoostPeerAcceptedView from './BoostPeerAcceptedView';
import i18n from '../../../common/services/i18n.service';

/**
 * Boost Peer Request Notification Component
 */
export default class BoostPeerRequestView extends BoostPeerAcceptedView {

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const description = this.getDescription(entity, 'their');
    const type = this.getType();
    const amount = this.getAmount();

    return (
      <View style={styles.bodyContents}>
        <Text onPress={() => this.navToBoostConsole({filter:'peer'})}>
          <Text style={styles.bold} onPress={this.navToChannel}>@{entity.from.username}</Text> {i18n.t('notification.boostPeerRequest')} <Text style={styles.bold}>{amount} {type} {description}</Text>
        </Text>
      </View>
    )
  }
}