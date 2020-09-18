//@ts-nocheck
import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { FastImageProperties } from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import ProgressCircle from 'react-native-progress/Circle';
import Animated from 'react-native-reanimated';
import { mix, useTimingTransition } from 'react-native-redash';
import Icon from 'react-native-vector-icons/Ionicons';
import settingsStore from '../../../settings/SettingsStore';
import { CommonStyle } from '../../../styles/Common';
import ThemedStyles from '../../../styles/ThemedStyles';
import ConnectivityAwareSmartImage from '../ConnectivityAwareSmartImage';
import type { Source } from 'react-native-fast-image';
import type BaseModel from '../../BaseModel';

interface PropsType extends FastImageProperties {
  onError?: (error: any) => void;
  entity?: BaseModel;
  thumbnail?: Source;
}

export default observer(function ExplicitImage(props: PropsType) {
  const {
    onError,
    entity,
    source,
    thumbnail,
    onLoad,
    onLoadEnd,
    ...otherProps
  } = props;

  const dataSaverEnabled = settingsStore.dataSaverEnabled;
  const [showOverlay, setShowOverlay] = useState<boolean>(
    entity && entity.paywall ? false : dataSaverEnabled,
  );
  const [imageVisible, setImageVisible] = useState<boolean>(
    entity && entity.paywall ? true : !dataSaverEnabled,
  );
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
    onLoadEnd && onLoadEnd();
  }, [imageVisible, onLoadEnd]);

  const _onProgress = useCallback((e) => {
    const p = e.nativeEvent.loaded / e.nativeEvent.total;
    if (p) {
      setProgress(p);
    }
  }, []);

  // do not show image if it is mature
  if (entity && entity.shouldBeBlured() && !entity.mature_visibility) {
    return <View style={[CommonStyle.blackOverlay, otherProps.style]} />;
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
    <View style={otherProps.style}>
      {imageVisible && (
        <ConnectivityAwareSmartImage
          source={source}
          onLoadEnd={_onLoadEnd}
          onLoad={onLoad}
          onError={_imageError}
          onProgress={_onProgress}
          {...otherProps}
        />
      )}
      {showOverlay && (
        <ConnectivityAwareSmartImage
          source={thumbnail}
          onLoadEnd={_onLoadEnd}
          onLoad={onLoad}
          onError={_imageError}
          {...otherProps}
        />
      )}
      {imageOverlay}
    </View>
  );
});
