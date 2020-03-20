import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated from "react-native-reanimated";
import { bInterpolate, useTransition, useTimingTransition } from "react-native-redash";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { observer } from 'mobx-react';

/**
 * Animated record button
 *
 * @param {Object} props
 */
export default observer(function(props) {

  // base the animation on the recording prop
  const transition = useTransition(props.store.recording);

  const scale = bInterpolate(transition, 1, 0.4);

  const internalSize = props.size - 6;

  const borderRadiusInternal = bInterpolate(transition, internalSize / 2, 10);

  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        styles.circleWrapper,
        {
          width: props.size,
          height: props.size,
          borderRadius: props.size / 2,
          borderWidth: 3,
          borderColor: 'white',
        },
      ]}
    >
      <Animated.View
        style={{
          transform: [{scale}],
          backgroundColor: '#E03C20',
          borderRadius: borderRadiusInternal,
          width: internalSize,
          height: internalSize,
        }}
      />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  circleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    borderWidth: 4 * StyleSheet.hairlineWidth,
  },
});