import React, { Component } from 'react';

import { Text, View } from 'react-native';
import type { PropsType } from './NotificationTypes';
import NotificationBody from '../NotificationBody';

/**
 * Messenger Invite Notification Component
 */
export default class MessengerInviteView extends Component<PropsType> {
  /**
   * Navigate to chat
   */
  navToChat = () => {
    this.props.navigation.navigate('Conversation', {
      target: this.props.entity.fromObj.guid,
    });
  };

  /**
   * Render
   */
  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    return (
      <NotificationBody
        styles={styles}
        onPress={this.navToChat}
        entity={entity}>
        <View style={styles.bodyContents}>
          <Text>
            <Text style={styles.link}>{entity.fromObj.name}</Text> wants to chat
            with you!
          </Text>
        </View>
      </NotificationBody>
    );
  }
}
