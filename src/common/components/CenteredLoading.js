import React, { Component } from 'react';
import {
  View,
  ActivityIndicator
} from 'react-native';

export default class CenteredLoading extends Component {

  render() {
    return (
    <View style={styles.activitycontainer}>
      <ActivityIndicator size={'large'} />
    </View>
    );
  }
}

const styles = {
  activitycontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
}