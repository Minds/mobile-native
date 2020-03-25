import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * Welcome Points Notification Component
 */
export default class WelcomePointsView extends Component {

  render() {
    const styles = this.props.styles;

    return (
      <View style={styles.bodyContents}>
        <Text>Welcome to Minds. We have given you <Text style={styles.link}>100 points</Text> to get you started.</Text>
      </View>
    )
  }
}