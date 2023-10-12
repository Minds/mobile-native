import React, { useEffect, useState } from 'react';
import LottieView from 'lottie-react-native';
import Animated from 'react-native-reanimated';
import { mix, useTransition } from 'react-native-redash';
import ThemedStyles from '../../../styles/ThemedStyles';

export default function SwipeAnimation(props) {
  const theme = ThemedStyles.style;
  const [hide, setHide] = useState(false);
  const [finished, setFinished] = useState(false);
  const transition = useTransition(hide, { duration: 400 });
  const opacity = mix(transition, 1, 0);

  useEffect(() => {
    const timer = setTimeout(() => setHide(true), 1300);
    const timerf = setTimeout(() => setFinished(true), 1500);
    return () => {
      clearTimeout(timer);
      clearTimeout(timerf);
    };
  }, []);

  const containerStyle = {
    opacity,
    backgroundColor: ThemedStyles.getColor('SecondaryBackground') + '76',
  };

  if (finished) {
    return null;
  }

  return (
    <Animated.View
      style={[containerStyle, theme.positionAbsolute, theme.centered]}>
      <LottieView
        autoPlay={props.autoPlay}
        resizeMode="contain"
        style={props.style}
        source={require('~/assets/animations/swipe.json')}
        loop={false}
        enableMergePathsAndroidForKitKatAndAbove
        speed={3}
        colorFilters={[
          {
            keypath: 'Shape Layer 3',
            color: ThemedStyles.getColor('PrimaryText'),
          },
          {
            keypath: 'Shape Layer 2',
            color: ThemedStyles.getColor('PrimaryText'),
          },
          {
            keypath: 'Shape Layer 1',
            color: ThemedStyles.getColor('PrimaryText'),
          },
        ]}
      />
    </Animated.View>
  );
}
