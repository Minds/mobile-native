import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * Friends Notification Component
 */
export default class FriendsView extends Component {

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    return (
      <View style={styles.bodyContents}>
        {entity.fromObj.subscribed && <Text style={styles.link}> You have a match! { entity.fromObj.name } subscribed to you</Text>}
        {!entity.fromObj.subscribed && <Text style={styles.link}> { entity.fromObj.name } subscribed to you</Text>}
      </View>
    )
  }
}