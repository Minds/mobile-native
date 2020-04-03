//@ts-nocheck
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Pulse from './Pulse';

import FastImage from 'react-native-fast-image';

/**
 * Pulse avatar
 */
export default class PulseAnimAvatar extends React.Component {
  state = {};

  /**
   * Derive state from props
   * @param {object} nextProps
   * @param {object} prevState
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.size !== prevState.size ||
      nextProps.avatar !== prevState.avatar
    ) {
      return {
        sizeStyle: {
          width: nextProps.size,
          height: nextProps.size,
        },
        imageStyle: {
          width: nextProps.size,
          height: nextProps.size,
          borderRadius: nextProps.size / 2,
          backgroundColor: nextProps.avatarBackgroundColor
        },
        avatarUri: {
          uri: nextProps.avatar
        },
      };
    }
    return null;
  }

  /**
   * Render
   */
  render() {
    const {onPress} = this.props;

    return (
      <View style={styles.main}>
        <Pulse
          {...this.props}
        />
        <TouchableOpacity
          activeOpacity={.5}
          onPress={onPress}
          style={this.state.sizeStyle}
        >
          <FastImage
            source={this.state.avatarUri}
            style={[this.state.imageStyle, this.props.style]}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

PulseAnimAvatar.defaultProps = {
  size: 100,
  avatar: undefined,
  avatarBackgroundColor: 'transparent',
  style: null,
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
