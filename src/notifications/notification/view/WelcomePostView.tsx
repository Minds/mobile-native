import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';

import i18n from '../../../common/services/i18n.service';
import type { PropsType } from './NotificationTypes';
import NotificationBody from '../NotificationBody';

/**
 * Welcome Post Notification Component
 */
export default class WelcomePostView extends PureComponent<PropsType> {
  navToCapture = () => {
    this.props.navigation.navigate('Capture');
  };

  render() {
    const styles = this.props.styles;
    const entity = this.props.entity;

    return (
      <NotificationBody
        styles={styles}
        onPress={this.navToCapture}
        entity={entity}>
        <View style={styles.bodyContents}>
          <Text style={styles.link}>{i18n.t('notification.welcomePost')}</Text>
        </View>
      </NotificationBody>
    );
  }
}
