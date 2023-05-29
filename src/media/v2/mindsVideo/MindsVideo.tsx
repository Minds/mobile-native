import { useFocusEffect } from '@react-navigation/native';

import { ResizeMode, VideoReadyForDisplayEvent } from 'expo-av';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import {
  StyleProp,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import RetryableImage from '~/common/components/RetryableImage';
import type CommentModel from '../../../comments/v2/CommentModel';
import getVideoThumb from '../../../common/helpers/get-video-thumbnail';
import videoPlayerService from '../../../common/services/video-player.service';
import { DATA_SAVER_THUMB_RES } from '../../../config/Config';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import settingsStore from '../../../settings/SettingsStore';
import ThemedStyles from '../../../styles/ThemedStyles';
import createMindsVideoStore from './createMindsVideoStore';
import Controls from './overlays/Controls';
import Error from './overlays/Error';
import InProgress from './overlays/InProgress';
import Transcoding from './overlays/Transcoding';
import ExpoVideo from './Video';

type PropsType = {
  entity?: ActivityModel | CommentModel;
  autoplay?: boolean;
  repeat?: boolean;
  resizeMode?: ResizeMode;
  video?: { uri: string; headers?: any };
  containerStyle?: StyleProp<ViewStyle>;
  onStoreCreated?: Function;
  onReadyForDisplay?: (event: VideoReadyForDisplayEvent) => void;
  hideOverlay?: boolean;
  ignoreDataSaver?: boolean;
  onProgress?: (progress: number) => void;
  /**
   * overrides the onPress of the video overlay
   */
  onOverlayPress?: () => void;
};

const MindsVideo = observer((props: PropsType) => {
  const theme = ThemedStyles.style;
  const dataSaverEnabled =
    !props.ignoreDataSaver && settingsStore.dataSaverEnabled;
  const localStore = useLocalStore(createMindsVideoStore, {
    autoplay: props.autoplay,
    repeat: props.repeat,
    dataSaverEnabled,
    onProgress: props.onProgress,
    onOverlayPress: props.onOverlayPress,
  });

  const onStoreCreated = props.onStoreCreated;

  const [posterSource, setPosterSource] = useState(
    props.entity
      ? dataSaverEnabled
        ? getVideoThumb(props.entity, DATA_SAVER_THUMB_RES)
        : getVideoThumb(props.entity)
      : null,
  );

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (!localStore.paused) {
          localStore.pause();
        }
      };
    }, [localStore]),
  );

  useEffect(() => {
    onStoreCreated && onStoreCreated(localStore);
  }, [onStoreCreated, localStore]);

  // remove instance of video player service
  useEffect(() => {
    return () => {
      if (videoPlayerService.current === localStore) {
        videoPlayerService.clear();
      }
    };
  }, [localStore]);

  useEffect(() => {
    if (props.entity) {
      localStore.clear();
      localStore.setEntity(props.entity);
      localStore.preload();
      setPosterSource(
        dataSaverEnabled
          ? getVideoThumb(props.entity, DATA_SAVER_THUMB_RES)
          : getVideoThumb(props.entity),
      );
    }
  }, [localStore, props.entity]);

  const onReadyForDisplay = React.useCallback(
    e => {
      localStore.setShowThumbnail(false);
      if (props.onReadyForDisplay) {
        props.onReadyForDisplay(e);
      }
    },
    [localStore, props.onReadyForDisplay],
  );

  // Show inProgress overlay if load has started
  const inProgressOverlay = localStore.inProgress && <InProgress />;

  // Show Error overlay if not in progress and error
  const errorOverlay = !localStore.inProgress && localStore.error && (
    <Error localStore={localStore} />
  );

  // Show Transcoding overlay if onError and isTranscoding Service -> true
  const transCodingOverlay = localStore.transcoding && <Transcoding />;

  // ^...else, show controls
  const controlsOverlay = !localStore.inProgress && !localStore.error && (
    <Controls
      localStore={localStore}
      entity={props.entity}
      hideOverlay={props.hideOverlay}
    />
  );

  return (
    <TouchableWithoutFeedback
      onPress={localStore.openControlOverlay}
      style={[theme.flexContainer, props.containerStyle]}>
      <View style={containerStyle}>
        {localStore.showThumbnail && (
          <RetryableImage
            style={theme.positionAbsolute}
            source={posterSource}
          />
        )}
        <ExpoVideo
          entity={props.entity}
          localStore={localStore}
          video={props.video}
          repeat={props.repeat}
          resizeMode={props.resizeMode}
          onReadyForDisplay={onReadyForDisplay}
        />
        {inProgressOverlay}
        {errorOverlay}
        {transCodingOverlay}
        {controlsOverlay}
      </View>
    </TouchableWithoutFeedback>
  );
});

const containerStyle = ThemedStyles.combine('flexContainer', 'bgBlack');

export default MindsVideo;
