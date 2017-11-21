import React, { Component } from 'react';

import {
  Text,
  StyleSheet,
  View
} from 'react-native';

export default class FriendsView extends Component {

  render() {
    const entity = this.props.entity;

    return (
      <View style={styles.bodyContents}>
        {entity.fromObj.subscribed && <Text style={styles.link}> You have a match! { entity.fromObj.name } subscribed to you</Text>}
        {!entity.fromObj.subscribed && <Text style={styles.link}> { entity.fromObj.name } subscribed to you</Text>}
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