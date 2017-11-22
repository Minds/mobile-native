import React, { Component } from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * Missed Call Notification Component
 */
export default class MissedCallView extends Component {


  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    return (
      <View style={styles.bodyContents}>
        <Text><Text style={styles.link}>{ entity.fromObj.name }</Text> tried to call you.</Text>
      </View>
    )
  }
}