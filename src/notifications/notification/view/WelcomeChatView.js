import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * Welcome Chat Notification Component
 */
export default class WelcomeChatView extends Component {

  render() {
    const styles = this.props.styles;

    return (
      <View style={styles.bodyContents}>
        <Text>Chat securely with your mutual subscriptions.</Text>
      </View>
    )
  }
}