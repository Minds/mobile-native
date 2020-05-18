import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';

import i18n from '../../../common/services/i18n.service';
import type { PropsType } from './NotificationTypes';
import NotificationBody from '../NotificationBody';

/**
 * Welcome Discover Notification Component
 */
export default class WelcomeDiscoverView extends PureComponent<PropsType> {
  render() {
    const styles = this.props.styles;
    const entity = this.props.entity;

    return (
      <NotificationBody
        styles={styles}
        onPress={this.navToDiscovery}
        entity={entity}>
        <View style={styles.bodyContents}>
          <Text>{i18n.t('notification.welcomeDiscover')}</Text>
        </View>
      </NotificationBody>
    );
  }

  /**
   * Navigate to discovery
   */
  navToDiscovery = () => {
    this.props.navigation.navigate('Discovery');
  };
}
