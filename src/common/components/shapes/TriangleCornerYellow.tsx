//@ts-nocheck
import React, { Component } from 'react';

import { StyleSheet } from 'react-native';
import TriangleCorner from './TriangleCorner';

export default class TriangleCornerYellow extends Component {
  render() {
    return <TriangleCorner style={styles.triangleCornerBottomLeft} />;
  }
}

const styles = StyleSheet.create({
  triangleCornerBottomLeft: {
    transform: [
      { rotate: '90deg' },
      { skewY: '60deg' },
      { scaleX: 4 },
      { scaleY: 8 },
    ],
    position: 'absolute',
    top: -80,
    right: 5,
    borderTopColor: '#FED12F',
    zIndex: -10,
  },
});
