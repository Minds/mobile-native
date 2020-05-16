import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';

import i18n from '../../../common/services/i18n.service';
import type { PropsType } from './NotificationTypes';
import NotificationBody from '../NotificationBody';

/**
 * Welcome Boost Notification Component
 */
export default class WelcomeBoostView extends PureComponent<PropsType> {
  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    return (
      <NotificationBody
        styles={styles}
        onPress={() => undefined}
        entity={entity}>
        <View style={styles.bodyContents}>
          <Text>{i18n.t('notification.welcomeBoost')}</Text>
        </View>
      </NotificationBody>
    );
  }
}
