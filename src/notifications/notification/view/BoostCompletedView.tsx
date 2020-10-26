import React from 'react';
import { Text, View } from 'react-native';

import BoostGiftView from './BoostGiftView';
import i18n from '../../../common/services/i18n.service';
import NotificationBody from '../NotificationBody';

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
      <NotificationBody
        styles={styles}
        onPress={this.navToBoostConsole}
        entity={this.props.entity}>
        <View style={styles.bodyContents}>
          <Text>{text}</Text>
        </View>
      </NotificationBody>
    );
  }
}
