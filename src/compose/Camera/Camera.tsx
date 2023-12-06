import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { when } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';
import { MotiView } from 'moti';
import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import Reanimated, {
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FIcon from '@expo/vector-icons/Feather';
import Icon from '@expo/vector-icons/Ionicons';
import { Camera } from 'react-native-vision-camera';
import FadeFrom from '../../common/components/animations/FadeFrom';
import { IS_IOS } from '../../config/Config';
import { RootStackParamList } from '../../navigation/NavigationTypes';
import ThemedStyles, { useStyle } from '../../styles/ThemedStyles';
import { PermissionsContext } from '../PermissionsCheck';
import VideoClock from '../VideoClock';
import CamIcon from './CamIcon';
import createCameraStore from './createCameraStore';
import FlashIcon from './FlashIcon';
import FocusGesture from './FocusGesture';
import FocusIndicator from './FocusIndicator';
import HdrIcon from './HdrIcon';
import RecordButton from './RecordButton';
import useBestCameraAndFormat from './useBestCameraAndFormat';
import useCameraStyle from './useCameraStyle';
import ZoomGesture from './ZoomGesture';
import ZoomIndicator from './ZoomIndicator';
import PressableScale from '~/common/components/PressableScale';
import PermissionsService from '~/common/services/permissions.service';
import { showNotification } from 'AppMessages';
import i18n from '~/common/services/i18n.service';

type CaptureScreenRouteProp = RouteProp<RootStackParamList, 'Capture'>;

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const camAnimTransition: any = { type: 'timing', duration: 0 };
const MAX_ZOOM_FACTOR = 20;

type PropsType = {
  onMedia: (media) => void;
  mode: 'photo' | 'video';
  onForceVideo?: () => void;
  onSetPhotoPress?: () => void;
  onSetVideoPress?: () => void;
  onPressGallery: () => void;
  portraitMode?: boolean;
  /**
   * whether the camera should be disabled or not
   */
  disabled?: boolean;
};

const PRESENTATION_ORDER = {
  first: 30,
  second: 110,
  third: 150,
};

/**
 * Camera
 * @param {Object} props
 */
export default observer(function (props: PropsType) {
  const permissions = React.useContext(PermissionsContext);
  const theme = ThemedStyles.style;
  const camera = useRef<Camera>(null);
  const route = useRoute<CaptureScreenRouteProp>();
  const navigation = useNavigation();
  const zoom = useSharedValue(0);
  const zoomVisible = useSharedValue<boolean>(false);

  // local store
  const store = useLocalStore(createCameraStore, { navigation, ...props });

  const [devices, device, formats, format] = useBestCameraAndFormat(
    store,
    props.mode,
  );

  const supportsCameraFlipping = React.useMemo(
    () => devices.back != null && devices.front != null,
    [devices.back, devices.front],
  );

  const supportsFlash = device?.hasFlash ?? false;
  const supportsHdr = React.useMemo(
    () => formats.some(f => f.supportsVideoHDR || f.supportsPhotoHDR),
    [formats],
  );

  const insets = useSafeAreaInsets();
  const cleanTop = { marginTop: insets.top || 0 };
  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

  const cameraAnimatedProps = useAnimatedProps(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);

  // capture press handler
  const onPress = useCallback(async () => {
    if (props.mode === 'photo') {
      store.takePicture(camera);
    } else {
      store.recordVideo(false, format, camera);
    }
  }, [props, store, format, camera]);

  const neutralZoom = device?.neutralZoom ?? 1;
  useEffect(() => {
    zoom.value = neutralZoom;
  }, [neutralZoom, zoom]);

  useEffect(() => {
    const t = setTimeout(() => {
      store.showCam();
    }, 50);

    let unlisten;

    if (route.params?.start) {
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

  // Keep device awake while camera is mounted
  useEffect(() => {
    activateKeepAwakeAsync();
    return () => {
      deactivateKeepAwake();
    };
  }, []);

  // capture long press handler
  const onLongPress = useCallback(async () => {
    if (!store.recording) {
      if (!PermissionsService.canUploadVideo()) {
        showNotification(i18n.t('composer.create.mediaVideoError'));
        return;
      }

      if (props.onForceVideo) {
        props.onForceVideo();
      }
      store.recordVideo(true, format, camera);
    }
  }, [props, store, format, camera]);

  const animateCamPreview = React.useMemo(
    () => (store.ready ? { opacity: 1 } : { opacity: 0 }),
    [store.ready],
  );

  const orientationStyle = useCameraStyle(insets);

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
                fps={30}
                lowLightBoost={
                  device.supportsLowLightBoost && store.lowLightBoost
                }
                hdr={store.hdr}
                isActive={props.disabled ? false : store.show}
                onInitialized={store.isReady}
                onError={e => console.log(e)}
                enableZoomGesture={false}
                animatedProps={cameraAnimatedProps}
                photo={true}
                video={true}
                audio={permissions !== null && permissions[0] === 'authorized'}
              />
            </FocusGesture>
          </ZoomGesture>
        )}
        {store.ready && <Shade />}
        {store.focusPoint && (
          <FocusIndicator x={store.focusPoint.x} y={store.focusPoint.y} />
        )}
        <ZoomIndicator
          zoomVisible={zoomVisible}
          zoom={zoom}
          maxZoom={maxZoom}
          minZoom={minZoom}
          style={orientationStyle.zoomIndicator}
        />
        <FadeFrom
          direction="right"
          delay={PRESENTATION_ORDER.third}
          style={orientationStyle.lowLight}>
          <PressableScale onPress={() => store.toggleLowLightBoost()}>
            <Icon
              size={30}
              name={store.lowLightBoost ? 'moon-sharp' : 'moon-outline'}
              style={orientationStyle.galleryIcon}
            />
          </PressableScale>
        </FadeFrom>
      </MotiView>
      {store.recording && (
        <VideoClock
          style={[orientationStyle.clock, cleanTop]}
          timer={store.videoLimit}
          onTimer={onPress}
          paused={!store.recordingPaused}
        />
      )}
      {device && store.ready && (
        <View style={orientationStyle.buttonContainer}>
          <View style={orientationStyle.leftIconContainer}>
            {!store.recording && (
              <FadeFrom delay={PRESENTATION_ORDER.third}>
                <PressableScale onPress={props.onPressGallery}>
                  <FIcon
                    size={30}
                    name="image"
                    style={orientationStyle.galleryIcon}
                  />
                </PressableScale>
              </FadeFrom>
            )}
            {supportsHdr && !store.recording ? (
              <FadeFrom delay={PRESENTATION_ORDER.second}>
                <HdrIcon store={store} style={orientationStyle.icon} />
              </FadeFrom>
            ) : (
              <View />
            )}
            {store.recording && (
              <FadeFrom delay={PRESENTATION_ORDER.second}>
                <PressableScale onPress={() => store.toggleRecording(camera)}>
                  <Icon
                    size={45}
                    name={
                      store.recordingPaused
                        ? 'play-circle-outline'
                        : 'ios-pause-circle-outline'
                    }
                    style={orientationStyle.galleryIcon}
                  />
                </PressableScale>
              </FadeFrom>
            )}
          </View>
          <View style={orientationStyle.rightButtonsContainer}>
            {supportsFlash && !store.recording ? (
              <FadeFrom delay={PRESENTATION_ORDER.second}>
                <FlashIcon store={store} style={orientationStyle.icon} />
              </FadeFrom>
            ) : (
              <View />
            )}
            {supportsCameraFlipping && (!store.recording || IS_IOS) ? (
              <FadeFrom delay={PRESENTATION_ORDER.third}>
                <CamIcon store={store} style={orientationStyle.icon} />
              </FadeFrom>
            ) : (
              <View />
            )}
          </View>
          <FadeFrom delay={PRESENTATION_ORDER.first}>
            <RecordButton
              size={70}
              store={store}
              onLongPress={onLongPress}
              onPressOut={onPress}
              pulse={store.pulse}
              isPhoto={props.mode === 'photo'}
            />
          </FadeFrom>
        </View>
      )}
    </View>
  );
});

/**
 * A black view that disappears with some delay. Used to smoothen camera appearance
 */
const Shade = () => (
  <MotiView
    from={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    // delay={400}
    transition={{ type: 'timing', duration: 1000 }}
    style={useStyle('positionAbsolute', 'bgBlack')}
  />
);
