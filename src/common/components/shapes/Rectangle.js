import React, {
  Component,
} from 'react';

import {View, Image, StyleSheet} from 'react-native';
import TriangleCorner from './TriangleCorner';
import {CommonStyle} from '../../../styles/Common';
import TriangleCornerYellow from './TriangleCornerYellow';

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
            <TriangleCorner style={styles.triangleTop} />
            {this.props.children}
            <TriangleCorner style={styles.triangleBottom} />
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
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.8,
    shadowRadius: 6.68,
    elevation: 11,
  },
  triangleTop: {
    top: -10,
    right: 2.5,
    borderRightWidth: 345,
    borderTopWidth: 10,
    borderTopColor: '#FFF',
    transform: [{rotate: '180deg'}],
  },
  triangleBottom: {
    top: 132,
    right: 0,
    borderRightWidth: 345,
    borderTopWidth: 10,
    borderTopColor: '#FFF',
  },
  rectangle: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: '#FFF',
    zIndex: -5,
    width: '87.5%',
    height: '78.78%',
  },
  bulb: {
    width: 26.25,
    height: 45,
    marginLeft: 15,
    marginTop: 15,
  },
});
