import React, { useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemedStyles from '../styles/ThemedStyles';
import RecordButton from './RecordButton';
import { observer, useLocalStore } from 'mobx-react';
import { useSafeArea } from 'react-native-safe-area-context';
import mindsService from '../common/services/minds.service';
import attachmentService from '../common/services/attachment.service';
import { useTransition } from 'react-native-redash';
import Animated from 'react-native-reanimated';

/**
 * Camera
 * @param {Object} props
 */
export default observer(function (props) {
  const theme = ThemedStyles.style;
  const ref = useRef();

  const insets = useSafeArea();
  const cleanTop = { marginTop: insets.top || 0 };

  // local store
  const store = useLocalStore(() => ({
    cameraType: RNCamera.Constants.Type.back,
    flashMode: RNCamera.Constants.FlashMode.off,
    recording: false,
    show: false,
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
    setRecording: (value) => {
      store.recording = value;
    },
    async recordVideo() {
      if (store.recording) {
        store.setRecording(false);
        return ref.current.stopRecording();
      }
      const settings = await mindsService.getSettings();

      store.setRecording(true);

      return await ref.current.recordAsync({
        quality: 0.9,
        maxDuration: settings.max_video_length,
      });
    },
    async selectFromGallery() {
      const response = await attachmentService.gallery('mixed');
      if (response && props.onMediaFromGallery) {
        props.onMediaFromGallery(response);
      }
    },
    takePicture() {
      return ref.current.takePictureAsync({
        base64: false,
        quality: 0.9,
        pauseAfterCapture: true,
      });
    },
  }));

  useEffect(() => {
    const t = setTimeout(() => {
      store.showCam();
    }, 150);
    return () => clearTimeout(t);
  }, [store]);

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
      console.log(result);
      if (result && props.onMedia) {
        props.onMedia({ type: 'video/mp4', ...result });
      }
    }
  }, [props, store]);

  let flashIconName;
  switch (store.flashMode) {
    case RNCamera.Constants.FlashMode.on:
      flashIconName = 'flash-on';
      break;
    case RNCamera.Constants.FlashMode.off:
      flashIconName = 'flash-off';
      break;
    case RNCamera.Constants.FlashMode.auto:
      flashIconName = 'flash-auto';
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
      <View style={styles.buttonContainer}>
        <View style={styles.galleryIconContainer}>
          <MCIcon
            size={40}
            name="image-outline"
            style={[styles.galleryIcon]}
            onPress={store.selectFromGallery}
          />
        </View>
        <RecordButton size={70} store={store} onPress={onPress} />
      </View>
      <View style={[styles.buttonTopContainer, cleanTop]}>
        <Icon
          name="ios-reverse-camera"
          size={40}
          style={styles.cameraReverseIcon}
          onPress={store.toggleCamera}
        />
        <MIcon
          name={flashIconName}
          size={35}
          style={styles.flashIcon}
          onPress={store.toggleFlash}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  buttonTopContainer: {
    position: 'absolute',
    right: 15,
    flexDirection: 'column',
    alignItems: 'center',
    top: 5,
  },
  cameraReverseIcon: {
    color: 'white',
    shadowOpacity: 0.3,
    textShadowRadius: 2,
    textShadowOffset: { width: 0, height: 0 },
    shadowRadius: 2.22,
    elevation: 4,
  },
  flashIcon: {
    color: 'white',
    marginTop: 10,
    shadowOpacity: 0.3,
    textShadowRadius: 2,
    textShadowOffset: { width: 0, height: 0 },
    elevation: 1,
  },
  galleryIconContainer: {
    position: 'absolute',
    left: 0,
    height: '100%',
    justifyContent: 'center',
  },
  galleryIcon: {
    color: 'white',
    alignSelf: 'center',
    marginLeft: 12,
    shadowOpacity: 0.4,
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 25,
    width: '100%',
    alignItems: 'center',
  },
});
