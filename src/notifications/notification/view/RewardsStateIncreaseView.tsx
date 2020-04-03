//@ts-nocheck
import React, {
  Component
} from 'react';

import {
  Text,
  View,
} from 'react-native';
import i18n from "../../../common/services/i18n.service";

/**
 * Custom Message Notification Component
 */
export default class RewardsStateIncreaseView extends Component {

  /**
   * Navigate to wallet
   */
  navToWallet = () => {
    this.props.navigation.push('Wallet');
  }

  /**
   * Render
   */
  render() {
    const styles = this.props.styles;

    return (
      <View style={styles.bodyContents}>
        <Text onPress={this.navToWallet}>
          {i18n.t('notification.rewardsStateIncrease', {state: this.props.state}) + '\n'}
          {i18n.t('notification.rewardsStateIncrease1', {'multiplier': this.props.multiplier})}
        </Text>
      </View>
    );
  }
}
