import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * Welcome Discover Notification Component
 */
export default class WelcomeDiscoverView extends Component {

  render() {
    const styles = this.props.styles;

    return (
      <View style={styles.bodyContents}>
        <Text><Text style={styles.link}>Tap here</Text> to discover new channels and media.</Text>
      </View>
    )
  }
}