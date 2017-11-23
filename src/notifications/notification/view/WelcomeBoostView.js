import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * Welcome Boost Notification Component
 */
export default class WelcomeBoostView extends Component {

  render() {
    const styles = this.props.styles;

    return (
      <View style={styles.bodyContents}>
        <Text>You can gain more reach by boosting your content. Hit the blue boost icon on your posts.</Text>
      </View>
    )
  }
}