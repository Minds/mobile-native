import React, {
  PureComponent
} from 'react';

import {
  Text,
  View
} from 'react-native';

import i18n from '../../../common/services/i18n.service';

/**
 * Welcome Discover Notification Component
 */
export default class WelcomeDiscoverView extends PureComponent {

  render() {
    const styles = this.props.styles;

    return (
      <View style={styles.bodyContents}>
        <Text onPress={this.navToDiscovery}>{i18n.t('notification.welcomeDiscover')}</Text>
      </View>
    )
  }

  /**
   * Navigate to discovery
   */
  navToDiscovery = () => {
    this.props.navigation.navigate('Discovery');
  }
}