import React from 'react';
import { Text, View } from 'react-native';

import BoostGiftView from './BoostGiftView';
import i18n from '../../../common/services/i18n.service';
import NotificationBody from '../NotificationBody';

/**
 * Boost Submitted Notification Component
 */
export default class BoostSubmittedView extends BoostGiftView {
  /**
   * Render
   */
  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const description = this.getDescription(entity);

    return (
      <NotificationBody
        styles={styles}
        onPress={this.navToBoostConsole}
        entity={entity}>
        <View style={styles.bodyContents}>
          <Text>
            {i18n.to(
              'notification.boostSubmitted',
              { impressions: entity.params.impressions },
              { description },
            )}
          </Text>
        </View>
      </NotificationBody>
    );
  }
}
