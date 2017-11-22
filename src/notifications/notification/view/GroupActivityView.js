import React, { Component } from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * Group Activity Notification Component
 */
export default class GroupActivityView extends Component {

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    //TODO: Navigate to activity entity.entityObj.guid on click
    return (
      <View style={styles.bodyContents}>
        <Text style={styles.link}>{entity.fromObj.name}</Text>
        <Text> posted in </Text>
        <Text style={styles.link}>{entity.params.group.name}</Text>
      </View>
    )
  }
}