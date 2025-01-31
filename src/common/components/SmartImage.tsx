import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Image, ImageProps } from 'expo-image';
import { autorun } from 'mobx';
import ProgressCircle from 'react-native-progress/CircleSnail';
import Icon from '@expo/vector-icons/Ionicons';

import sp from '~/services/serviceProvider';
import { useStyle } from '~/styles/hooks';

export type SmartImageProps = {
  ignoreDataSaver?: boolean;
  onError?: (e: any) => void;
  iconSize?: number;
  withoutDownloadButton?: boolean;
  imageVisible?: boolean;
  thumbBlurRadius?: number;
  locked?: boolean;
} & ImageProps;

/**
 * Expo image wrapper with retry and connectivity awareness
 * @param {Object} props
 */
const SmartImage = observer(function (props: SmartImageProps) {
  const settings = sp.resolve('settings');
  const { withoutDownloadButton, ...otherProps } = props;
  const dataSaverEnabled = settings.dataSaverEnabled;
  const store = useLocalStore(createSmartImageStore, props);

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
        if (store.showOverlay && !settings.dataSaverEnabled) {
          store.showImage();
        }
      }),
    [settings, store],
  );

  if (store.error) {
    return (
      <View style={[props.style, sp.styles.style.centered]}>
        <Icon
          name="cloud-offline-outline"
          size={props.iconSize || 24}
          style={sp.styles.style.colorTertiaryText}
        />
      </View>
    );
  }

  return (
    <View style={props.style}>
      <Image
        {...otherProps}
        onError={store.setError}
        source={store.imageVisible ? props.source : undefined}
        onLoadEnd={store.onLoadEnd}
        onProgress={store.onProgress}
      />

      {store.showOverlay && (
        <View style={absoluteCenter}>
          {dataSaverEnabled && !withoutDownloadButton && (
            <DownloadButton store={store} />
          )}
        </View>
      )}
    </View>
  );
});

const DownloadButton = ({ store }) => {
  const theme = sp.styles.style;
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
  const dataSaverEnabled = sp.resolve('settings').dataSaverEnabled;
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
    setError({ error }) {
      // workaround for the SDWebImage error with caching (the image is loaded correctly so we ignore)
      if (error === 'Operation cancelled by user during querying the cache') {
        return;
      }
      this.error = true;
      this.progress = undefined;

      if (props.onError) {
        props.onError(error);
      }
    },
    onLoadEnd() {
      // if the entity should be blurred or was locked, don't remove the overlay
      if (!props.blurred && !props.locked) {
        this.showOverlay = false;
      }
      this.progress = undefined;
      if (props.onLoadEnd) {
        props.onLoadEnd();
      }
    },
    onProgress(e) {
      const p = e.loaded / e.total;
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
    // shows image if cache exists and shows overlay if it didn't
    async onInit() {
      // if entity was locked, show overlay and return
      if (props.locked || dataSaverEnabled) {
        this.showOverlay = true;
        return;
      }
    },
  };
};

export type SmartImageStore = ReturnType<typeof createSmartImageStore>;

export default SmartImage;

const styles = sp.styles.create({
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
const absoluteCenter = sp.styles.combine('positionAbsolute', 'centered');
