import { autorun } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import {
  Image,
  ImageURISource,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage, { ResizeMode } from 'react-native-fast-image';
import ProgressCircle from 'react-native-progress/CircleSnail';
import Animated from 'react-native-reanimated';
import { mix, useTimingTransition } from 'react-native-redash';
import Icon from 'react-native-vector-icons/Ionicons';
import settingsStore from '../../settings/SettingsStore';
import ThemedStyles from '../../styles/ThemedStyles';
import connectivityService from '../services/connectivity.service';
import RetryableImage from './RetryableImage';

interface SmartImageProps {
  thumbnail?: ImageURISource;
  ignoreDataSaver?: boolean;
  onError?: (e: any) => void;
  size?: number;
  style?: any;
  source: ImageURISource;
  onLoadEnd?: Function;
  resizeMode?: ResizeMode;
  withoutDownloadButton?: boolean;
  imageVisible?: boolean;
  thumbBlurRadius?: number;
}

const defaultBlur = Platform.select({ android: 1, ios: 4 });

/**
 * Fast-image wrapper with retry and connectivity awareness
 * @param {Object} props
 */
export default observer(function (props: SmartImageProps) {
  const { withoutDownloadButton, ...otherProps } = props;

  const dataSaverEnabled = settingsStore.dataSaverEnabled;

  const store = useLocalStore(createSmartImageStore, props);

  useEffect(() => {
    if (props.imageVisible) {
      store.showImage(props.imageVisible);
    }
  }, [props.imageVisible, store]);

  useEffect(() => {
    try {
      store.showImageIfCacheExists();
    } catch (e) {
      console.error(e);
    }
  }, []);

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
        store.showOverlay && props.thumbnail && (
          <Image
            key={`thumbnail:${store.retries}`}
            blurRadius={props.thumbBlurRadius || defaultBlur}
            style={props.style}
            source={props.thumbnail}
          />
        )
      }
      {dataSaverEnabled && (
        <ImageOverlay
          store={store}
          withoutDownloadButton={withoutDownloadButton}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  downloadButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 100,
    width: 50,
    height: 50,
  },
});

/**
 * ImageOverlay component
 */
const ImageOverlay = ({
  withoutDownloadButton,
  store,
}: {
  withoutDownloadButton?: boolean;
  store: SmartImageStore;
}) => {
  const theme = ThemedStyles.style;
  const showOverlayTransition = useTimingTransition(store.showOverlay, {
    duration: 150,
  });
  const opacity = mix(showOverlayTransition, 0, 1);

  return (
    <Animated.View
      pointerEvents={store.showOverlay ? undefined : 'none'}
      style={[
        theme.positionAbsolute,
        theme.centered,
        {
          opacity,
        },
      ]}>
      {!withoutDownloadButton && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={store.progress === undefined ? store.onDownload : undefined}
          style={[theme.positionAbsolute, theme.centered]}>
          <View style={[styles.downloadButton, theme.centered]}>
            {typeof store.progress === 'number' ? (
              <ProgressCircle
                progress={store.progress}
                color="white"
                indeterminate={store.imageVisible && store.progress === 0}
              />
            ) : (
              <Icon name="arrow-down" style={theme.colorWhite} size={30} />
            )}
          </View>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const createSmartImageStore = (props) => {
  const dataSaverEnabled = settingsStore.dataSaverEnabled;
  return {
    error: false,
    retries: 0,
    progress: undefined,
    imageVisible: props.ignoreDataSaver ? true : !dataSaverEnabled,
    showOverlay: props.ignoreDataSaver ? false : dataSaverEnabled,
    showImage(show: boolean = true) {
      this.imageVisible = show;
      this.showOverlay = !show;
    },
    setError(error) {
      this.error = true;
      this.progress = undefined;

      if (props.onError) {
        props.onError(error);
      }
    },
    onLoadEnd() {
      this.showOverlay = false;
      this.progress = undefined;
      this.retries = 0;

      if (props.onLoadEnd) {
        props.onLoadEnd();
      }
    },
    onProgress(e) {
      const p = e.nativeEvent.loaded / e.nativeEvent.total;
      if (p) {
        // @ts-ignore
        this.progress = p;
      }
    },
    onDownload() {
      this.imageVisible = true;
      if (this.progress === undefined) {
        // @ts-ignore
        this.progress = 0;
      }
    },
    clearError() {
      this.error = false;
    },
    retry() {
      this.error = false;
      this.retries++;
    },
    async showImageIfCacheExists() {
      if (!props.source.uri) {
        return;
      }
      //@ts-ignore
      const cached = await FastImage.getCachePath({
        uri: props.source.uri,
      });

      if (!cached) {
        return;
      }

      this.showImage();
    },
  };
};

export type SmartImageStore = ReturnType<typeof createSmartImageStore>;
