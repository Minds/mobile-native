import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * Welcome Post Notification Component
 */
export default class WelcomePostView extends Component {

  render() {
    const styles = this.props.styles;

    return (
      <View style={styles.bodyContents}>
        <Text><Text style={styles.link}>Tap here</Text> to create a post.</Text>
      </View>
    )
  }
}