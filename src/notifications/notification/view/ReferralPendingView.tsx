//@ts-nocheck
import React, {
  PureComponent
} from 'react';

import {
  Text,
  View,
} from 'react-native';

import i18n from '../../../common/services/i18n.service';

/**
 * Referral Pending
 */
export default class ReferralPendingView extends PureComponent {
  /**
   * Navigate to navToContributions
   */
  navToContributions = () => {
    this.props.navigation.push('Contributions');
  };

  /**
   * Render
   */
  render() {
    const styles = this.props.styles;

    return (
      <View style={styles.bodyContents}>
        <Text onPress={this.navToContributions}>
          {i18n.to('notification.referralPending', null, {
            user: (
              <Text style={styles.link}>{this.props.entity.fromObj.name}</Text>
            ),
          })}
        </Text>
      </View>
    );
  }
}
