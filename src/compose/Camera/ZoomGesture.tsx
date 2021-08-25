import { Extrapolate } from '@msantang78/react-native-pager';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  interpolate,
} from 'react-native-reanimated';
import { CameraStore } from './createCameraStore';

// TODO: Check a better value for android
const SCALE_FULL_ZOOM = 3;

type PropsType = {
  children: React.ReactNode;
  zoomVisible: Animated.SharedValue<boolean>;
  zoom: Animated.SharedValue<number>;
  minZoom: number;
  maxZoom: number;
  store: CameraStore;
};

/**
 * Zoom gesture handler
 */
const ZoomGesture: FC<PropsType> = ({
  children,
  zoomVisible,
  zoom,
  minZoom,
  maxZoom,
  store,
}) => {
  const onPinchGesture = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    { startZoom?: number }
  >({
    onStart: (_, context) => {
      context.startZoom = zoom.value;
      // display the zoom indicator
      zoomVisible.value = true;
    },
    onEnd: () => {
      // hide the zoom indicator
      zoomVisible.value = false;
    },
    onActive: (event, context) => {
      // we're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(
        event.scale,
        [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM],
        [-1, 0, 1],
        Extrapolate.CLAMP,
      );
      zoom.value = interpolate(
        scale,
        [-1, 0, 1],
        [minZoom, startZoom, maxZoom],
        Extrapolate.CLAMP,
      );
    },
  });
  return (
    <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={store.show}>
      <Animated.View style={StyleSheet.absoluteFill}>{children}</Animated.View>
    </PinchGestureHandler>
  );
};

export default ZoomGesture;
