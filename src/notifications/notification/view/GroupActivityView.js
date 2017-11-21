import React, { Component } from 'react';

import {
  Text,
  StyleSheet,
  View
} from 'react-native';

export default class GroupActivityView extends Component {

  render() {
    const entity = this.props.entity;

    return (
      <View style={styles.bodyContents}>
        <Text style={styles.link}>{entity.fromObj.name}</Text>
        <Text> posted in </Text>
        <Text style={styles.link}>{entity.params.group.name}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bodyContents: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  link: {
    fontWeight: 'bold',
  },
});