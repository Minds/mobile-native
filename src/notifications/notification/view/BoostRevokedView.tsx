import React from 'react';
import { Text, View } from 'react-native';

import BoostGiftView from './BoostGiftView';
import i18n from '../../../common/services/i18n.service';

/**
 * Boost Revoked Notification Component
 */
export default class BoostRevokedView extends BoostGiftView {
  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const description = this.getDescription(entity);

    return (
      <View style={styles.bodyContents}>
        <Text onPress={this.navToBoostConsole}>
          {i18n.to('notification.boostRevoked', null, { description })}
        </Text>
      </View>
    );
  }
}
