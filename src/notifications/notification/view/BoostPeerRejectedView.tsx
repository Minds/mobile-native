import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

import BoostPeerAcceptedView from './BoostPeerAcceptedView';
import i18n from '../../../common/services/i18n.service';

/**
 * Boost Peer Rejected Notification Component
 */
export default class BoostPeerRejectedView extends BoostPeerAcceptedView {

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const description = this.getDescription(entity);
    const type = this.getType();
    const amount = this.getAmount();

    return (
      <View style={styles.bodyContents}>
        <Text onPress={() => this.navToBoostConsole({filter:'peer'})}>
          <Text style={styles.bold} onPress={this.navToChannel}>@{entity.from.username}</Text> {i18n.t('notification.boostPeerRejected')} <Text style={styles.bold}>{amount} {type}</Text> {description} {i18n.t('notification.notCharged')}
        </Text>
      </View>
    );
  }
}
