//@ts-nocheck
import React, { Component } from 'react';

import {View, StyleSheet} from 'react-native';

/**
 * Mock video component for e2e (it takes too much cpu power in the simulator)
 */
export default class VideoBackground extends Component {
  render() {
    return <View style={[styles.container, {backgroundColor: 'black'}]}/>;
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
});