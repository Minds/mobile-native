import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

import i18n from '../../../common/services/i18n.service';
import token from '../../../../src/common/helpers/token';
import BoostGiftView from './BoostGiftView';
import number from "../../../common/helpers/number";

/**
 * Boost Peer Accepted Notification Component
 */
export default class BoostPeerAcceptedView extends BoostGiftView {

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const description = this.getDescription(entity);
    const type = this.getType();
    const amount = this.getAmount();

    return (
      <View style={styles.bodyContents} >
        <Text onPress={() => this.navToBoostConsole({filter:'peer'})}>
        <Text style={styles.bold} onPress={this.navToChannel}>@{entity.from.username}</Text> {i18n.t('notification.boostPeerAccepted')} <Text style={styles.bold}>{amount} {type}</Text> {description}
        </Text>
      </View>
    )
  }

  getType() {
    return (this.props.entity.params.type === 'pro') ? i18n.t('usd') : i18n.t('tokens');
  }

  getAmount() {
    if (this.props.entity.params.type === 'pro') {
      return this.props.entity.params.bid;
    } else {
      return number(token(this.props.entity.params.bid, 18), 0, 3);
    }
  }
}
