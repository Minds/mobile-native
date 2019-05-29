import React, {
  PureComponent
} from 'react';

import {
  Text,
  View
} from 'react-native';

import i18n from '../../../common/services/i18n.service';

/**
 * Welcome Post Notification Component
 */
export default class WelcomePostView extends PureComponent {

  navToCapture = () => {
    this.props.navigation.navigate('Capture');
  }

  render() {
    const styles = this.props.styles;

    return (
      <View style={styles.bodyContents}>
        <Text style={styles.link} onPress={this.navToCapture}>{i18n.t('notification.welcomePost')}</Text>
      </View>
    )
  }
}