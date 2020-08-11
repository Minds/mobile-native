import React, { useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import FIcon from 'react-native-vector-icons/Feather';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTransition } from 'react-native-redash';
import Animated from 'react-native-reanimated';
import { when } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';

import ThemedStyles from '../styles/ThemedStyles';
import RecordButton from './RecordButton';
import { useSafeArea } from 'react-native-safe-area-context';
import mindsService from '../common/services/minds.service';
import VideoClock from './VideoClock';

/**
 * Camera
 * @param {Object} props
 */
export default observer(function (props) {
  const theme = ThemedStyles.style;
  const ref = useRef();
  const route = useRoute();
  const navigation = useNavigation();

  const insets = useSafeArea();
  const cleanTop = { marginTop: insets.top || 0 };

  // local store
  const store = useLocalStore(
    (p) => ({
      cameraType: RNCamera.Constants.Type.front,
      flashMode: RNCamera.Constants.FlashMode.off,
      recording: false,
      show: false,
      pulse: false,
      ready: false,
      showCam() {
        store.show = true;
      },
      isReady() {
        store.ready = true;
      },
      toggleFlash: () => {
        if (store.flashMode === RNCamera.Constants.FlashMode.on) {
          store.flashMode = RNCamera.Constants.FlashMode.off;
        } else if (store.flashMode === RNCamera.Constants.FlashMode.off) {
          store.flashMode = RNCamera.Constants.FlashMode.auto;
        } else {
          store.flashMode = RNCamera.Constants.FlashMode.on;
        }
      },
      toggleCamera: () => {
        store.cameraType =
          store.cameraType === RNCamera.Constants.Type.back
            ? RNCamera.Constants.Type.front
            : RNCamera.Constants.Type.back;
      },
      setRecording: (value, pulse = false) => {
        store.recording = value;
        store.pulse = pulse;
      },
      async recordVideo(pulse = false) {
        if (store.recording) {
          store.setRecording(false);
          return ref.current.stopRecording();
        }
        const settings = await mindsService.getSettings();

        store.setRecording(true, pulse);

        return await ref.current.recordAsync({
          quality: 0.9,
          maxDuration: settings.max_video_length,
        });
      },
      takePicture() {
        return ref.current.takePictureAsync({
          base64: false,
          quality: 0.9,
          pauseAfterCapture: true,
        });
      },
    }),
    props,
  );

  useEffect(() => {
    const t = setTimeout(() => {
      store.showCam();
    }, 150);

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

  const opacity = useTransition(store.ready);

  // capture press handler
  const onPress = useCallback(async () => {
    if (props.mode === 'photo') {
      const result = await store.takePicture();
      if (result && props.onMedia) {
        props.onMedia({ type: 'image/jpeg', ...result });
      }
    } else {
      const result = await store.recordVideo();

      if (result && props.onMedia) {
        props.onMedia({ type: 'video/mp4', ...result });
      }
    }
  }, [props, store]);

  // capture long press handler
  const onLongPress = useCallback(async () => {
    if (!store.recording) {
      props.onForceVideo();
      const result = await store.recordVideo(true);

      if (result && props.onMedia) {
        props.onMedia({ type: 'video/mp4', ...result });
      }
    }
  }, [props, store]);

  let flashIconName;
  switch (store.flashMode) {
    case RNCamera.Constants.FlashMode.on:
      flashIconName = 'md-flash-outline';
      break;
    case RNCamera.Constants.FlashMode.off:
      flashIconName = 'md-flash-off-outline';
      break;
    case RNCamera.Constants.FlashMode.auto:
      flashIconName = 'md-flash-outline';
      break;
  }

  return (
    <View style={theme.flexContainer}>
      <Animated.View style={[theme.flexContainer, { opacity }]}>
        {store.show && (
          <RNCamera
            ref={ref}
            style={theme.flexContainer}
            type={store.cameraType}
            flashMode={store.flashMode}
            ratio="16:9"
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            androidRecordAudioPermissionOptions={{
              title: 'Permission to use audio recording',
              message: 'We need your permission to use your audio',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            onCameraReady={store.isReady}
          />
        )}
      </Animated.View>
      {store.recording && <VideoClock style={[styles.clock, cleanTop]} />}
      <View style={styles.buttonContainer}>
        <View style={styles.galleryIconContainer}>
          <FIcon
            size={30}
            name="image"
            style={styles.galleryIcon}
            onPress={props.onPressGallery}
          />
        </View>
        <View style={styles.rightButtonsContainer}>
          <View>
            <Icon
              name={flashIconName}
              size={30}
              style={styles.icon}
              onPress={store.toggleFlash}
            />
            {store.flashMode === RNCamera.Constants.FlashMode.auto && (
              <MIcon
                name="format-text-variant"
                size={12}
                style={[styles.icon, styles.autoIcon]}
                onPress={store.toggleFlash}
              />
            )}
          </View>
          {!store.recording && (
            <Icon
              name="md-camera-reverse-outline"
              size={30}
              style={styles.icon}
              onPress={store.toggleCamera}
            />
          )}
        </View>
        <RecordButton
          size={70}
          store={store}
          onLongPress={onLongPress}
          onPressOut={onPress}
          pulse={store.pulse}
          isPhoto={props.mode === 'photo'}
        />
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
  icon: {
    padding: 10,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2.22,
  },
  autoIcon: {
    position: 'absolute',
  },
  galleryIconContainer: {
    position: 'absolute',
    left: 0,
    height: '100%',
    justifyContent: 'center',
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
});
