import React, { Component } from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * Group Invite Notification Component
 */
export default class GroupInviteView extends Component {

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    //TODO: navigate to group entity.params.group.guid on click
    return (
      <View style={styles.bodyContents}>
        <Text>{entity.params.user} invited you to join <Text>{entity.params.group.name}</Text></Text>
      </View>
    )
  }
}