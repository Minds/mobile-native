import { autorun } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';
import { AnimatePresence, MotiTransitionProp, MotiView } from 'moti';
import React, { FC, useEffect } from 'react';
import { Image, Platform, TouchableOpacity, View } from 'react-native';
import { Blurhash } from 'react-native-blurhash';
import FastImage, { ResizeMode, Source } from 'react-native-fast-image';
import ProgressCircle from 'react-native-progress/CircleSnail';
import Icon from 'react-native-vector-icons/Ionicons';
import ActivityModel from '~/newsfeed/ActivityModel';
import settingsStore from '../../settings/SettingsStore';
import ThemedStyles, { useStyle } from '../../styles/ThemedStyles';
import connectivityService from '../services/connectivity.service';
import RetryableImage from './RetryableImage';

interface SmartImageProps {
  thumbnail?: Source;
  ignoreDataSaver?: boolean;
  onError?: (e: any) => void;
  size?: number;
  style?: any;
  source: Source;
  onLoadEnd?: Function;
  resizeMode?: ResizeMode;
  withoutDownloadButton?: boolean;
  imageVisible?: boolean;
  thumbBlurRadius?: number;
  entity?: ActivityModel;
}

const defaultBlur = Platform.select({ android: 1, ios: 4 });

/**
 * Fast-image wrapper with retry and connectivity awareness
 * @param {Object} props
 */
const SmartImage = observer(function (props: SmartImageProps) {
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
      store.onInit();
    } catch (e) {
      console.error(e);
    }
  }, [store]);

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

      <AnimatePresence>
        {store.showOverlay && (
          <ImageOverlay>
            <BlurredThumbnail
              key={`thumbnail:${store.retries}`}
              thumbBlurRadius={props.thumbBlurRadius}
              style={props.style}
              thumbnailSource={props.thumbnail as any}
              entity={props.entity}
            />
            {dataSaverEnabled && !withoutDownloadButton && (
              <DownloadButton store={store} />
            )}
          </ImageOverlay>
        )}
      </AnimatePresence>
    </View>
  );
});

const exitAnimation = {
  opacity: 0,
};
const animate = {
  opacity: 1,
};
const transition: MotiTransitionProp = { type: 'timing', duration: 1000 };

/**
 * this component overlays the image and will disappear with a fade transition when
 * store.showOverlay is turned off
 */
const ImageOverlay: FC = ({ ...props }) => {
  return (
    <MotiView
      {...props}
      animate={animate}
      exit={exitAnimation}
      transition={transition}
      style={absoluteCenter}
    />
  );
};

const BlurredThumbnail = ({
  thumbBlurRadius,
  style,
  thumbnailSource,
  entity,
}) => {
  const blurhash = entity?.custom_data?.[0]?.blurhash || entity?.blurhash;
  if (blurhash) {
    return <Blurhash decodeAsync blurhash={blurhash} style={style} />;
  }

  if (thumbnailSource) {
    return (
      <Image
        blurRadius={thumbBlurRadius || defaultBlur}
        style={style}
        source={thumbnailSource}
      />
    );
  }

  return null;
};

const DownloadButton = ({ store }) => {
  const theme = ThemedStyles.style;
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={store.progress === undefined ? store.onDownload : undefined}
      style={useStyle('positionAbsolute', 'centered')}>
      <View style={styles.downloadButton}>
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
  );
};

const createSmartImageStore = props => {
  const dataSaverEnabled = settingsStore.dataSaverEnabled;
  return {
    error: false,
    retries: 0,
    progress: undefined,
    imageVisible: props.ignoreDataSaver ? true : !dataSaverEnabled,
    /**
     * whether to show the overlay.
     * by default no overlay is shown. the overlay will be shown after we find out
     * whether the image is cached or not. if the iamge wasn't cached, we will show the overlay.
     * when the image fully loads, the overlay will be hidden.
     */
    showOverlay: false,
    showImage(show: boolean = true) {
      this.imageVisible = show;
    },
    setError(error) {
      this.error = true;
      this.progress = undefined;

      if (props.onError) {
        props.onError(error);
      }
    },
    onLoadEnd() {
      // if the entity should be blurred or was locked, don't remove the overlay
      if (!props.entity?.shouldBeBlured() && !props.entity?.isLocked()) {
        this.showOverlay = false;
      }
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
    async isCached() {
      if (!props.source.uri) {
        return false;
      }

      try {
        //@ts-ignore
        const cached = await FastImage.getCachePath({
          uri: props.source.uri,
        });

        return cached;
      } catch (e) {}

      return false;
    },
    // shows image if cache exists and shows overlay if it didn't
    async onInit() {
      // if entity was locked, show overlay and return
      if (props.entity?.isLocked()) {
        this.showOverlay = true;
        return;
      }

      // if it was cached, show the image, otherwise show the overlay
      if (await this.isCached()) {
        this.showImage();
      } else {
        this.showOverlay = true;
      }
    },
  };
};

export type SmartImageStore = ReturnType<typeof createSmartImageStore>;

export default SmartImage;

export type { Source };

const absoluteCenter = ThemedStyles.combine('positionAbsolute', 'centered');
const styles = ThemedStyles.create({
  downloadButton: [
    'centered',
    {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 100,
      width: 50,
      height: 50,
    },
  ],
});
