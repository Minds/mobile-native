import React, { useCallback, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import ThemedStyles from '~/styles/ThemedStyles';

const AnimatedHeight: React.FunctionComponent = ({ children }) => {
  const [height, setHeight] = useState(0);

  const handleLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height: layoutHeight },
      },
    }: LayoutChangeEvent) => setHeight(layoutHeight),
    [],
  );

  const animatedHeightStyle = useAnimatedStyle(() => ({
    height: withTiming(height),
  }));

  return (
    <Animated.View style={[animatedHeightStyle, { overflow: 'hidden' }]}>
      <View
        onLayout={handleLayout}
        style={ThemedStyles.style.positionAbsoluteTop}>
        {children}
      </View>
    </Animated.View>
  );
};

export default AnimatedHeight;
