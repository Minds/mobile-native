import React, {
  Component,
} from 'react';

import {View, Image, StyleSheet, Dimensions} from 'react-native';
import TriangleCorner from './TriangleCorner';
import {CommonStyle} from '../../../styles/Common';
import TriangleCornerYellow from './TriangleCornerYellow';

const wHeight = Dimensions.get('window').height,
  wWidth = Dimensions.get('window').width;

export default class Rectangle extends Component {
  render() {
    return (
      <View style={[CommonStyle.flexContainerCenter, CommonStyle.padding2x]}>
        <Image
          source={require('./../../../assets/logos/bulb.png')}
          style={styles.bulb}
        />
        <TriangleCornerYellow />
        <View style={CommonStyle.flexContainerCenter}>
          <View style={[styles.rectangle, styles.shadow]}>
            <TriangleCorner style={[styles.triangle, styles.triangleTop]} />
            {this.props.children}
            <TriangleCorner style={[styles.triangle, styles.triangleBottom]} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 11,
  },
  triangle: {
    borderRightWidth: wWidth * 0.837,
    borderTopWidth: wHeight * 0.01,
    borderTopColor: '#FFF',
  },
  triangleTop: {
    top: wHeight * -0.01,
    right: 2.5,
    transform: [{rotate: '180deg'}],
  },
  triangleBottom: {
    top: wHeight * 0.01,
    right: 0,
  },
  rectangle: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: '#FFF',
    zIndex: -5,
    width: wWidth * 0.83,
    height: wHeight * 0.7,
  },
  bulb: {
    width: 26.25,
    height: 45,
    marginLeft: 15,
    marginTop: 15,
  },
});
