import React, { Component } from 'react';

import {
  observer,
  inject
} from 'mobx-react/native'

import { 
  View,
  StyleSheet,
} from 'react-native';

import { Icon } from 'react-native-elements'

export default class CaptureFab extends Component {

  /**
   * Nav to activity full screen
   */
  navToCapture = () => {
    this.props.navigation.navigate('Capture', {group: this.props.group});
  }

  render() {
    return (
      <Icon
        raised
        name="md-create"
        type='ionicon'
        color='#fff'
        size={32}
        containerStyle={styles.container}
        onPress={() => this.navToCapture()} 
        />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position:'absolute',
    backgroundColor:'#4690DF',
    width:55,
    height:55,
    bottom:8,
    right:8,
    zIndex:1000
  },
});