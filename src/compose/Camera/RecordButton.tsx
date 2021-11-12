import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { mix, useTransition } from 'react-native-redash';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { observer } from 'mobx-react';
import Pulse from '../../common/components/Pulse';

type PropsType = {
  store: any;
  isPhoto?: boolean;
  pulse: boolean;
  size: number;
  onPress?: () => void;
  onLongPress: () => void;
  onPressOut?: () => void;
};

/**
 * Animated record button
 */
export default observer(function (props: PropsType) {
  // base the animation on the recording prop
  const transition = useTransition(props.store.recording);
  const scale = mix(transition, 1, 0.4);
  const internalSize = props.size - 5;
  const borderRadiusInternal = mix(transition, internalSize / 2, 10);

  const innerStyle = useMemo(
    () => ({
      transform: [{ scale }],
      backgroundColor: props.isPhoto ? '#fff' : '#E03C20',
      borderRadius: borderRadiusInternal,
      width: internalSize,
      height: internalSize,
    }),
    [borderRadiusInternal, internalSize, props.isPhoto, scale],
  );
  const containerStyle = useMemo(
    () => [styles.circleWrapper, styles.circle],
    [],
  );
  const buttonStyle = useMemo(
    () => [
      styles.circleWrapper,
      {
        width: props.size,
        height: props.size,
        borderRadius: props.size / 2,
      },
    ],
    [props.size],
  );

  return (
    <View style={containerStyle}>
      {props.pulse && <Pulse size={props.size} />}
      <TouchableOpacity
        onPress={props.onPress}
        onLongPress={props.onLongPress}
        onPressOut={props.onPressOut}
        style={buttonStyle}>
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
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 100,
  },
});
