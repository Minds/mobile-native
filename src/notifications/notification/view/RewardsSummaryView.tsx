import React, { Component } from 'react';

import { Text, View } from 'react-native';
import i18n from '../../../common/services/i18n.service';
import type { PropsType } from './NotificationTypes';
import NotificationBody from '../NotificationBody';

/**
 * Custom Message Notification Component
 */
export default class RewardsSummaryView extends Component<PropsType> {
  navToWallet = () => {
    this.props.navigation.push('Wallet');
  };

  render() {
    const styles = this.props.styles;
    const entity = this.props.entity;

    return (
      <NotificationBody
        styles={styles}
        onPress={this.navToWallet}
        entity={entity}>
        <View style={styles.bodyContents}>
          <Text>
            {i18n.t('notification.rewardsSummary', {
              amount: entity.params.amount,
            })}
          </Text>
        </View>
      </NotificationBody>
    );
  }
}
