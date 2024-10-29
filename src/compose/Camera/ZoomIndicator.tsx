import React, { useState } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import MText from '../../common/components/MText';
import sp from '~/services/serviceProvider';
type PropsType = {
  zoom: Animated.SharedValue<number>;
  zoomVisible: Animated.SharedValue<boolean>;
  maxZoom: number;
  minZoom: number;
  style: ViewStyle;
};

/**
 * Zoom indicator for the camera
 */
export default function ZoomIndicator({
  zoom,
  zoomVisible,
  maxZoom,
  minZoom,
  style,
}: PropsType) {
  const [text, setText] = useState('1.0x');

  // Animate indicator
  const animStyle = useAnimatedStyle(() => {
    return {
      left: interpolate(
        Math.max(Math.min(zoom.value, maxZoom), minZoom),
        [minZoom, maxZoom],
        [0, 150],
      ),
      width: 2,
      height: 15,
      backgroundColor: 'white',
      borderRadius: 3,
    };
  });

  // Animate fade in/out of entire component
  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: withDelay(200, withTiming(zoomVisible.value ? 1 : 0)),
    };
  });

  // Send the zoom value to the JS thread to show it on text
  useAnimatedReaction(
    () => zoom.value,
    x => {
      runOnJS(setText)(
        `${Math.max(Math.min(x, maxZoom), minZoom).toFixed(1)}x`,
      );
    },
  );

  return (
    <Animated.View style={[containerStyle, style]}>
      <View style={styles.barStyle}>
        <Animated.View style={animStyle} />
      </View>
      <MText style={styles.text}>{text}</MText>
    </Animated.View>
  );
}

const styles = sp.styles.create({
  text: [
    'centered',
    'fontXXL',
    'colorWhite',
    'paddingTop',
    { textShadowColor: '#000000', textShadowRadius: 1 },
  ],
  barStyle: [
    'borderHair',
    'bcolorWhite',
    {
      width: 152,
      backgroundColor: '#00000045',
      height: 15,
      flexDirection: 'row',
      borderRadius: 3,
    },
  ],
});
