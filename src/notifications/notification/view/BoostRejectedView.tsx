import React from 'react';
import { Text, View } from 'react-native';

import BoostGiftView from './BoostGiftView';
import i18n from '../../../common/services/i18n.service';
import NotificationBody from '../NotificationBody';

/**
 * Boost Rejected Notification Component
 */
export default class BoostRejectedView extends BoostGiftView {
  findReason(code) {
    return i18n.t(`boosts.rejectionReasons.${code}`);
  }

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const description = this.getDescription(entity);
    let reason = '';

    if (entity.params.reason && entity.params.reason !== -1) {
      reason = this.findReason(entity.params.reason);
    }

    return (
      <NotificationBody
        styles={styles}
        onPress={this.navToBoostConsole}
        entity={entity}>
        <View style={styles.bodyContents}>
          <Text onPress={this.navToBoostConsole}>
            {i18n.to('notification.boostRejected', { reason }, { description })}
          </Text>
        </View>
      </NotificationBody>
    );
  }
}
