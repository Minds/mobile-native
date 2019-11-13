import React, {
  PureComponent
} from 'react';

import {
  Text,
  View
} from 'react-native';

import i18n from '../../../common/services/i18n.service';

/**
 * Boost Accepted Notification Component
 */
export default class ReferralPingView extends PureComponent {

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;
    
    const name = (<Text style={styles.link}>{entity.fromObj.name}</Text>);

    const text = i18n.to('referrals.referralping',null,{
      name
    });
    
    return (
      <View style={styles.bodyContents}>
        <Text onPress={this.navToWallet}>{text}</Text>
      </View>
    )
  }

  /**
   * Navigate To channel
   */
  navToWallet = () => {
    // only active if receive the navigation property
    if (this.props.navigation) {
      this.props.navigation.navigate('WalletOnboarding');
    }
  }
}
