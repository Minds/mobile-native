import React, { Component } from 'react';

import {
  Text,
  StyleSheet,
  View
} from 'react-native';

export default class CustomMessageView extends Component {

  render() {
    const entity = this.props.entity;

    return (
      <View style={styles.bodyContents}>
        <Text>{entity.params.message}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bodyContents: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});