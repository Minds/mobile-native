import React, { FC, PropsWithChildren, RefObject } from 'react';
import {
  HandlerStateChangeEvent,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import { Camera, CameraDevice } from 'react-native-vision-camera';
import { CameraStore } from './createCameraStore';

type PropsType = {
  store: CameraStore;
  camera: RefObject<Camera>;
  device: CameraDevice;
};

const FocusGesture: FC<PropsWithChildren<PropsType>> = ({
  store,
  children,
  device,
  camera,
}) => {
  const onFocus = React.useCallback(
    (tapEvent: HandlerStateChangeEvent) => {
      if (device?.supportsFocus) {
        store.setFocus({
          x: tapEvent.nativeEvent.x as number,
          y: tapEvent.nativeEvent.y as number,
        });
        camera.current?.focus({
          x: tapEvent.nativeEvent.x as number,
          y: tapEvent.nativeEvent.y as number,
        });
      }
    },
    [camera, device.supportsFocus, store],
  );
  return (
    <TapGestureHandler onActivated={onFocus} numberOfTaps={1}>
      {children}
    </TapGestureHandler>
  );
};

export default FocusGesture;
