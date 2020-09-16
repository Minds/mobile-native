//@ts-nocheck
import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { createImageProgress } from 'react-native-image-progress';
import ProgressCircle from 'react-native-progress/Circle';
import { mix, useTimingTransition } from 'react-native-redash';
import Icon from 'react-native-vector-icons/Ionicons';
import settingsStore from '../../../settings/SettingsStore';
import { CommonStyle } from '../../../styles/Common';
import ThemedStyles from '../../../styles/ThemedStyles';
import ConnectivityAwareSmartImage from '../ConnectivityAwareSmartImage';
import Animated from 'react-native-reanimated';
import type { Source } from 'react-native-fast-image';
import type BaseModel from '../../BaseModel';

type PropsType = {
  onLoadEnd: () => void;
  source: Source;
  onError: (error: any) => void;
  entity?: BaseModel;
  thumbnail?: Source;
  onLoad?: any;
  imageStyle?: any;
};

export default observer(function ExplicitImage(props: PropsType) {
  const {
    onError,
    entity,
    source,
    thumbnail,
    onLoad,
    onLoadEnd,
    imageStyle,
  } = props;

  const dataSaverEnabled = settingsStore.dataSaverEnabled;
  const [showOverlay, setShowOverlay] = useState<boolean>(dataSaverEnabled);
  const [imageVisible, setImageVisible] = useState<boolean>(!dataSaverEnabled);
  const [progress, setProgress] = useState<number | undefined>();
  const theme = ThemedStyles.style;
  const overlayTransition = useTimingTransition(showOverlay, { duration: 150 });

  const opacity = mix(overlayTransition, 0, 1);

  useEffect(() => {
    /**
     * If overlay was visible and Data Saver was turned off, remove overlay
     * */
    if (showOverlay && !dataSaverEnabled) {
      setShowOverlay(false);
      setImageVisible(true);
    }
  }, [dataSaverEnabled]);

  const _imageError = useCallback(
    (event) => {
      // bubble event up
      onError && onError(event.nativeEvent.error);
      setProgress(undefined);
    },
    [onError],
  );

  const _onShowImage = useCallback(() => {
    setImageVisible(true);
    setProgress(0);
  }, []);

  const _onLoadEnd = useCallback(() => {
    if (imageVisible) {
      setShowOverlay(false);
    }
    if (onLoadEnd) {
      onLoadEnd();
    }
  }, [imageVisible, onLoadEnd]);

  const onProgress = useCallback(
    (e) => setProgress(e.nativeEvent.loaded / e.nativeEvent.total),
    [],
  );

  // do not show image if it is mature
  if (entity && entity.shouldBeBlured() && !entity.mature_visibility) {
    return (
      <View
        style={[
          CommonStyle.positionAbsolute,
          imageStyle,
          CommonStyle.blackOverlay,
        ]}
      />
    );
  }

  if (!source || !source.uri || source.uri.indexOf('//') < 0) {
    return <View />;
  }

  const imageOverlay = (
    <Animated.View
      pointerEvents={showOverlay ? undefined : 'none'}
      style={[
        CommonStyle.positionAbsolute,
        CommonStyle.centered,
        {
          opacity,
        },
      ]}>
      <TouchableWithoutFeedback
        onPress={progress === undefined ? _onShowImage : undefined}
        style={[CommonStyle.positionAbsolute, CommonStyle.centered]}>
        <BlurView
          blurType={ThemedStyles.theme ? 'dark' : 'xlight'}
          style={[CommonStyle.positionAbsolute, CommonStyle.centered]}>
          {typeof progress === 'number' ? (
            <ProgressCircle
              progress={progress}
              indeterminate={imageVisible && progress === 0}
            />
          ) : (
            <Icon name="md-download" style={theme.colorIcon} size={40} />
          )}
        </BlurView>
      </TouchableWithoutFeedback>
    </Animated.View>
  );

  return (
    <>
      {imageVisible && (
        <ConnectivityAwareSmartImage
          source={source}
          onLoadEnd={_onLoadEnd}
          onLoad={onLoad}
          onError={_imageError}
          onProgress={onProgress}
          style={[CommonStyle.positionAbsolute, imageStyle]}
        />
      )}
      {showOverlay && thumbnail && (
        <ConnectivityAwareSmartImage
          source={thumbnail}
          onLoadEnd={_onLoadEnd}
          onLoad={onLoad}
          onError={_imageError}
          style={[CommonStyle.positionAbsolute, imageStyle]}
        />
      )}
      {imageOverlay}
    </>
  );
});
