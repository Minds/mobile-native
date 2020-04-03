//@ts-nocheck
import React, {
  Component,
} from 'react';

import {View, StyleSheet} from 'react-native';

export default class TriangleCorner extends Component {
  render() {
    return <View style={[styles.triangleCorner, this.props.style]} />;
  }
}

const styles = StyleSheet.create({
  triangleCorner: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 100,
    borderTopWidth: 100,
    borderRightColor: 'transparent',
    borderTopColor: 'red',
  },
});
