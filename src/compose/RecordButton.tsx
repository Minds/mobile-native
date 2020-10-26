import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { mix, useTransition } from 'react-native-redash';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { observer } from 'mobx-react';
import Pulse from '../common/components/Pulse';

type PropsType = {
  store: any;
  isPhoto?: boolean;
  pulse: boolean;
  size: number;
  onPress: () => void;
  onLongPress: () => void;
  onPressOut: () => void;
};

/**
 * Animated record button
 *
 * @param {Object} props
 */
export default observer(function (props: PropsType) {
  // base the animation on the recording prop
  const transition = useTransition(props.store.recording);

  const scale = mix(transition, 1, 0.4);

  const internalSize = props.size - 10;

  const borderRadiusInternal = mix(transition, internalSize / 2, 10);

  const containerStyle = {
    width: props.size,
    height: props.size,
    borderRadius: props.size / 2,
    borderWidth: 5,
    borderColor: 'white',
  };

  const innerStyle = {
    transform: [{ scale }],
    backgroundColor: props.isPhoto ? '#868686' : '#E03C20',
    borderRadius: borderRadiusInternal,
    width: internalSize,
    height: internalSize,
  };

  return (
    <View style={styles.circleWrapper}>
      {props.pulse && <Pulse size={props.size} />}
      <TouchableOpacity
        onPress={props.onPress}
        onLongPress={props.onLongPress}
        onPressOut={props.onPressOut}
        style={[styles.circleWrapper, containerStyle]}>
        <Animated.View style={innerStyle} />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  circleWrapper: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    borderWidth: 4 * StyleSheet.hairlineWidth,
  },
});
