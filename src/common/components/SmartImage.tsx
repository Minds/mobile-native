import { BlurView } from '@react-native-community/blur';
import { autorun } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { FastImageProperties, FastImageSource } from 'react-native-fast-image';
import ProgressCircle from 'react-native-progress/Circle';
import Animated from 'react-native-reanimated';
import { mix, useTimingTransition } from 'react-native-redash';

import Icon from 'react-native-vector-icons/Ionicons';
import settingsStore from '../../settings/SettingsStore';
import { CommonStyle } from '../../styles/Common';
import ThemedStyles from '../../styles/ThemedStyles';
import connectivityService from '../services/connectivity.service';
import RetryableImage from './RetryableImage';

interface SmartImageProps extends Omit<FastImageProperties, 'onError'> {
  thumbnail?: FastImageSource;
  ignoreDataSaver?: boolean;
  onError?: (e: any) => void;
  size?: number;
}

/**
 * Fast-image wrapper with retry and connectivity awareness
 * @param {Object} props
 */
export default observer(function (props: SmartImageProps) {
  const { ignoreDataSaver, ...otherProps } = props;

  const theme = ThemedStyles.style;
  const dataSaverEnabled = settingsStore.dataSaverEnabled;

  const store = useLocalStore(() => ({
    error: false,
    retries: 0,
    progress: undefined,
    imageVisible: ignoreDataSaver ? true : !dataSaverEnabled,
    showOverlay: ignoreDataSaver ? false : dataSaverEnabled,
    showImage() {
      store.imageVisible = true;
      store.showOverlay = false;
    },
    setError(error) {
      store.error = true;
      store.progress = undefined;

      if (props.onError) {
        props.onError(error);
      }
    },
    onLoadEnd() {
      store.showOverlay = false;
      store.retries = 0;

      if (props.onLoadEnd) {
        props.onLoadEnd();
      }
    },
    onProgress(e) {
      const p = e.nativeEvent.loaded / e.nativeEvent.total;
      if (p) {
        // @ts-ignore
        store.progress = p;
      }
    },
    onDownload() {
      store.imageVisible = true;
      setTimeout(() => {
        if (store.progress === undefined) {
          // @ts-ignore
          store.progress = 0;
        }
      }, 500);
    },
    clearError() {
      store.error = false;
    },
    retry() {
      store.error = false;
      store.retries++;
    },
  }));

  const showOverlayTransition = useTimingTransition(store.showOverlay, {
    duration: 150,
  });
  const opacity = mix(showOverlayTransition, 0, 1);

  useEffect(
    () =>
      autorun(() => {
        if (connectivityService.isConnected && store.error) {
          store.retry();
        }

        if (store.showOverlay && !settingsStore.dataSaverEnabled) {
          store.showImage();
        }
      }),
    [store],
  );

  if (store.error) {
    return (
      <View style={[props.style, ThemedStyles.style.centered]}>
        <Icon
          name="wifi-off"
          size={props.size || 24}
          style={ThemedStyles.style.colorTertiaryText}
        />
      </View>
    );
  }

  const imageOverlay = (
    <Animated.View
      pointerEvents={store.showOverlay ? undefined : 'none'}
      style={[
        CommonStyle.positionAbsolute,
        CommonStyle.centered,
        {
          opacity,
        },
      ]}>
      <TouchableWithoutFeedback
        onPress={store.progress === undefined ? store.onDownload : undefined}
        style={[CommonStyle.positionAbsolute, CommonStyle.centered]}>
        <BlurView
          blurType={ThemedStyles.theme ? 'dark' : 'xlight'}
          style={[CommonStyle.positionAbsolute, CommonStyle.centered]}>
          {typeof store.progress === 'number' ? (
            <ProgressCircle
              progress={store.progress}
              indeterminate={store.imageVisible && store.progress === 0}
            />
          ) : (
            <Icon name="md-download" style={theme.colorIcon} size={40} />
          )}
        </BlurView>
      </TouchableWithoutFeedback>
    </Animated.View>
  );

  return (
    <View style={props.style}>
      {store.imageVisible && (
        <RetryableImage
          {...otherProps}
          retry={2}
          key={store.retries}
          onError={store.setError}
          source={props.source}
          onLoadEnd={store.onLoadEnd}
          onProgress={store.onProgress}
        />
      )}
      {
        /**
         * Thumbnail
         * */
        store.showOverlay && (
          <RetryableImage
            {...otherProps}
            retry={2}
            key={`thumbnail:${store.retries}`}
            onError={store.setError}
            source={props.thumbnail}
          />
        )
      }
      {dataSaverEnabled && imageOverlay}
    </View>
  );
});
