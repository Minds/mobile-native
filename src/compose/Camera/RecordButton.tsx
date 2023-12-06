import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
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
  const recording = props.store.recording;
  const isPhoto = props.isPhoto;
  const internalSize = props.size - 5;
  const [pressed, setPressed] = React.useState(false);

  const innerStyle: any = useAnimatedStyle(
    () => ({
      transform: [
        {
          scale: withTiming(
            isPhoto ? (pressed ? 0.9 : 1) : recording ? 0.4 : 1,
          ),
        },
      ],
      backgroundColor: isPhoto ? '#fff' : '#E03C20',
      borderRadius: withTiming(recording ? 10 : internalSize / 2),
      width: internalSize,
      height: internalSize,
    }),
    [recording, isPhoto, internalSize, pressed],
  );

  const onPressIn = () => {
    setPressed(true);
  };

  const onPressOut = () => {
    setPressed(false);
    props.onPressOut?.();
  };

  const buttonStyle = useMemo(
    () => ({
      ...styles.circleWrapper,
      width: props.size,
      height: props.size,
      borderRadius: props.size / 2,
    }),
    [props.size],
  );

  return (
    <View style={containerStyle}>
      {props.pulse && <Pulse size={props.size} />}
      <Pressable
        onPress={props.onPress}
        onLongPress={props.onLongPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={buttonStyle}>
        <Animated.View style={innerStyle} />
      </Pressable>
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

const containerStyle = [styles.circleWrapper, styles.circle];
