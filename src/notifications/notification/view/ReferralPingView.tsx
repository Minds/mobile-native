import React, { PureComponent } from 'react';

import { Text, View } from 'react-native';

import i18n from '../../../common/services/i18n.service';
import type { PropsType } from './NotificationTypes';
import NotificationBody from '../NotificationBody';

/**
 * Referral Ping
 */
export default class ReferralPingView extends PureComponent<PropsType> {
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
    const entity = this.props.entity;

    return (
      <NotificationBody
        styles={styles}
        onPress={this.navToContributions}
        entity={entity}>
        <View style={styles.bodyContents}>
          <Text>
            {i18n.to('notification.referralPing', null, {
              user: (
                <Text style={styles.link}>
                  {this.props.entity.fromObj.name}
                </Text>
              ),
            })}
          </Text>
        </View>
      </NotificationBody>
    );
  }
}
