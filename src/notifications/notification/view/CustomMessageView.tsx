import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * Custom Message Notification Component
 */
export default class CustomMessageView extends Component {

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    return (
      <View style={styles.bodyContents}>
        <Text>{entity.params.message}</Text>
      </View>
    )
  }
}