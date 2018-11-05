import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * Messenger Invite Notification Component
 */
export default class MessengerInviteView extends Component {

  /**
   * Navigate to chat
   */
  navToChat = () => {
    this.props.navigation.navigate('Conversation', { target: this.props.entity.fromObj.guid });
  }

  /**
   * Render
   */
  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    return (
      <View style={styles.bodyContents}>
        <Text onPress={this.navToChat}><Text style={styles.link}>{entity.fromObj.name}</Text> wants to chat with you!</Text>
      </View>
    )
  }
}