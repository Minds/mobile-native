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

  /**
   * Navigate To channel
   */
  navToChannel = () => {
    this.props.navigation.push('Channel', { guid: this.props.entity.fromObj.guid });
  }

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const body = entity.fromObj.subscribed ?
      <Text style={styles.link} onPress={this.navToChannel}>You have a match! {entity.fromObj.name} subscribed to you</Text> :
      <Text style={styles.link} onPress={this.navToChannel}>{entity.fromObj.name} subscribed to you</Text>

    return (
      <View style={styles.bodyContents}>
        {body}
      </View>
    )
  }
}