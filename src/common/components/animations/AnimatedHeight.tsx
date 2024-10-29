import React, { PropsWithChildren, useCallback, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import sp from '~/services/serviceProvider';

const AnimatedHeight: React.FunctionComponent<PropsWithChildren<{}>> = ({
  children,
}) => {
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
      <View onLayout={handleLayout} style={sp.styles.style.positionAbsoluteTop}>
        {children}
      </View>
    </Animated.View>
  );
};

export default AnimatedHeight;
