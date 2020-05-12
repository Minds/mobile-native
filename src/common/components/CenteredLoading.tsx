//@ts-nocheck
import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default class CenteredLoading extends Component {
  render() {
    return (
      <View style={styles.activitycontainer} onLayout={this.props.onLayout}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }
}

const styles = {
  activitycontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    minHeight: 100,
    flex: 1,
  },
};
