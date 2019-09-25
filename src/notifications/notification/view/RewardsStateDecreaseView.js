import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';
import i18n from "../../../common/services/i18n.service";

/**
 * Custom Message Notification Component
 */
export default class RewardsStateDecreaseView extends Component {

  navToWallet = () => {
    this.props.navigation.push('Wallet');
  }

  render() {
    const styles = this.props.styles;

    return (
      <View style={styles.bodyContents}>
        <Text onPress={this.navToWallet}>{i18n.t('notification.rewardsStateDecrease', {state: this.props.state, multiplier: this.props.multiplier})}</Text>
      </View>
    )
  }
}
