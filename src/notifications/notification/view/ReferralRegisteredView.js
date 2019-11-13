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
export default class ReferralRegisteredView extends PureComponent {

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const name = (<Text style={styles.link}>{entity.fromObj.name}</Text>);

    const text = i18n.to('referrals.referralregistered',null,{
      name
    });
    
    return (
      <View style={styles.bodyContents}>
        <Text onPress={this.navToChannel}>{text}</Text>
      </View>
    )
  }

  /**
   * Navigate To channel
   */
  navToChannel = () => {
    // only active if receive the navigation property
    if (this.props.navigation) {
      this.props.navigation.push('Channel', {guid:this.props.entity.fromObj.guid});
    }
  }
}
