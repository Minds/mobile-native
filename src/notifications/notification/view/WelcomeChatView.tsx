import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';

import i18n from '../../../common/services/i18n.service';
import type { PropsType } from './NotificationTypes';
import NotificationBody from '../NotificationBody';

/**
 * Welcome Chat Notification Component
 */
export default class WelcomeChatView extends PureComponent<PropsType> {
  render() {
    const styles = this.props.styles;
    const entity = this.props.entity;

    return (
      <NotificationBody
        styles={styles}
        onPress={() => undefined}
        entity={entity}>
        <View style={styles.bodyContents}>
          <Text>{i18n.t('notification.welcomeChat')}</Text>
        </View>
      </NotificationBody>
    );
  }
}
