import React, { useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import {
  CameraDeviceFormat,
  sortFormats,
  useCameraDevices,
  frameRateIncluded,
  Camera,
} from 'react-native-vision-camera';
import FIcon from 'react-native-vector-icons/Feather';
import { useRoute, useNavigation } from '@react-navigation/native';
import { when } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';

import { useSafeArea } from 'react-native-safe-area-context';
import Reanimated, {
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import ThemedStyles from '../../styles/ThemedStyles';
import RecordButton from './RecordButton';

import VideoClock from '../VideoClock';
import FocusIndicator from './FocusIndicator';
import { IS_IOS } from '../../config/Config';
import ZoomIndicator from './ZoomIndicator';
import createCameraStore from './createCameraStore';
import FlashIcon from './FlashIcon';
import CamIcon from './CamIcon';
import HdrIcon from './HdrIcon';
import FadeFromBottom from '../../common/components/animations/FadeFromBottom';
import ZoomGesture from './ZoomGesture';
import FocusGesture from './FocusGesture';
import { MotiView } from 'moti';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const camAnimTransition = { type: 'timing', duration: 100 };

/**
 * Camera
 * @param {Object} props
 */
export default observer(function (props) {
  const theme = ThemedStyles.style;
  const camera = useRef<Camera>(null);
  const route = useRoute();
  const navigation = useNavigation();
  const zoom = useSharedValue(0);
  const zoomVisible = useSharedValue<boolean>(false);

  const devices = useCameraDevices();

  // local store
  const store = useLocalStore(createCameraStore, { navigation, ...props });

  const device = devices[store.cameraType];
  const supportsCameraFlipping = React.useMemo(
    () => devices.back != null && devices.front != null,
    [devices.back, devices.front],
  );
  const formats = React.useMemo<CameraDeviceFormat[]>(() => {
    if (device?.formats == null) return [];
    return device.formats.sort((a, b) =>
      a.photoWidth < b.photoWidth ? 1 : a.photoWidth > b.photoWidth ? -1 : 0,
    );
  }, [device?.formats]);

  const supportsFlash = device?.hasFlash ?? false;
  const supportsHdr = React.useMemo(
    () => formats.some(f => f.supportsVideoHDR || f.supportsPhotoHDR),
    [formats],
  );

  const insets = useSafeArea();
  const cleanTop = { marginTop: insets.top || 0 };
  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, 3);
  const fps = 30;

  const cameraAnimatedProps = useAnimatedProps(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);

  const format = React.useMemo(() => {
    const result = formats
      .slice()
      .reverse()
      .find(
        f =>
          f.frameRateRanges.some(r => frameRateIncluded(r, fps)) &&
          // any format close to 16/9
          f.photoWidth / f.photoHeight >= 1.7 &&
          f.photoWidth / f.photoHeight <= 1.8 &&
          // full hd resolution
          f.photoWidth >= 1920,
      );

    formats.forEach(f =>
      console.log(
        f.photoWidth,
        f.photoHeight,
        '-',
        f.videoWidth,
        f.videoHeight,
        'PhotoHDR:' + f.supportsPhotoHDR,
        'VideoHDR:' + f.supportsVideoHDR,
      ),
    );

    return result || formats[0];
  }, [formats, fps]);

  useEffect(() => {
    const t = setTimeout(() => {
      store.showCam();
    }, 50);

    let unlisten;

    if (route.params && route.params.start) {
      unlisten = when(
        () => store.ready,
        () => {
          setTimeout(() => {
            onPress && onPress();
            navigation.setParams({ start: false });
          }, 100);
        },
      );
    }

    return () => {
      clearTimeout(t);
      unlisten && unlisten();
    };
  }, [store, onPress, route.params, navigation]);

  // capture press handler
  const onPress = useCallback(async () => {
    if (props.mode === 'photo') {
      store.takePicture(camera);
    } else {
      store.recordVideo(false, format, camera);
    }
  }, [props, store, format, camera]);

  // capture long press handler
  const onLongPress = useCallback(async () => {
    if (!store.recording) {
      props.onForceVideo();
      store.recordVideo(true, format, camera);
    }
  }, [props, store, format, camera]);

  const animateCamPreview = React.useMemo(
    () => (store.ready ? { opacity: 1 } : { opacity: 0 }),
    [store.ready],
  );

  return (
    <View style={theme.flexContainer}>
      <MotiView
        style={theme.flexContainer}
        animate={animateCamPreview}
        transition={camAnimTransition}>
        {device != null && (
          <ZoomGesture
            zoom={zoom}
            zoomVisible={zoomVisible}
            minZoom={minZoom}
            maxZoom={maxZoom}
            store={store}>
            <FocusGesture store={store} device={device} camera={camera}>
              <ReanimatedCamera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                format={format}
                fps={fps}
                hdr={store.hdr}
                // lowLightBoost={
                //   device.supportsLowLightBoost && enableNightMode
                // }
                isActive={store.show}
                onInitialized={store.isReady}
                onError={e => console.log(e)}
                enableZoomGesture={false}
                animatedProps={cameraAnimatedProps}
                photo={true}
                video={true}
                audio={true}
                // frameProcessor={
                //   device.supportsParallelVideoProcessing
                //     ? frameProcessor
                //     : undefined
                // }
                // frameProcessorFps={1}
              />
            </FocusGesture>
          </ZoomGesture>
        )}
        {store.focusPoint && (
          <FocusIndicator x={store.focusPoint.x} y={store.focusPoint.y} />
        )}

        <ZoomIndicator
          zoomVisible={zoomVisible}
          zoom={zoom}
          maxZoom={maxZoom}
          minZoom={minZoom}
          style={styles.zoomIndicator}
        />
      </MotiView>
      {store.recording && (
        <VideoClock
          style={[styles.clock, cleanTop]}
          timer={store.videoLimit}
          onTimer={onPress}
        />
      )}
      <View style={styles.buttonContainer}>
        <View style={styles.leftIconContainer}>
          <FadeFromBottom delay={190}>
            <FIcon
              size={30}
              name="image"
              style={styles.galleryIcon}
              onPress={props.onPressGallery}
            />
          </FadeFromBottom>
          {supportsHdr ? (
            <FadeFromBottom delay={130}>
              <HdrIcon store={store} />
            </FadeFromBottom>
          ) : (
            <View />
          )}
        </View>
        <View style={styles.rightButtonsContainer}>
          {supportsFlash ? (
            <FadeFromBottom delay={130}>
              <FlashIcon store={store} />
            </FadeFromBottom>
          ) : (
            <View />
          )}
          {supportsCameraFlipping && (!store.recording || IS_IOS) ? (
            <FadeFromBottom delay={190}>
              <CamIcon store={store} />
            </FadeFromBottom>
          ) : (
            <View />
          )}
        </View>
        <FadeFromBottom delay={50}>
          <RecordButton
            size={70}
            store={store}
            onLongPress={onLongPress}
            onPressOut={onPress}
            pulse={store.pulse}
            isPhoto={props.mode === 'photo'}
          />
        </FadeFromBottom>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  clock: {
    position: 'absolute',
    width: '100%',
    top: 20,
    left: 0,
    color: 'white',
    textAlign: 'center',
  },
  leftIconContainer: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: '100%',
    width: '50%',
    paddingRight: 40,
    alignItems: 'center',
  },
  rightButtonsContainer: {
    position: 'absolute',
    right: 0,
    width: '50%',
    paddingLeft: 40,
    justifyContent: 'space-around',
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
  },
  galleryIcon: {
    padding: 10,
    color: 'white',
    alignSelf: 'center',
    marginLeft: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2.22,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 25,
    width: '100%',
    alignItems: 'center',
  },
  zoomIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    top: 60,
  },
});
