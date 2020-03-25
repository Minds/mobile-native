import React, {
  PureComponent
} from 'react';

import {
  Text,
  View
} from 'react-native';

import i18n from '../../../common/services/i18n.service';

/**
 * Welcome Chat Notification Component
 */
export default class WelcomeChatView extends PureComponent {

  render() {
    const styles = this.props.styles;

    return (
      <View style={styles.bodyContents}>
        <Text>{i18n.t('notification.welcomeChat')}</Text>
      </View>
    )
  }
}