import { useIsFocused } from '@react-navigation/native';

import { ResizeMode, VideoReadyForDisplayEvent } from 'expo-av';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect, useMemo, useRef } from 'react';
import {
  StyleProp,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import type CommentModel from '../../../comments/CommentModel';
import SmartImage from '../../../common/components/SmartImage';
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
  video?: { uri: string };
  containerStyle?: StyleProp<ViewStyle>;
  onStoreCreated?: Function;
  onReadyForDisplay?: (event: VideoReadyForDisplayEvent) => void;
  hideOverlay?: boolean;
  ignoreDataSaver?: boolean;
};

const MindsVideo = observer((props: PropsType) => {
  const theme = ThemedStyles.style;
  const dataSaverEnabled =
    !props.ignoreDataSaver && settingsStore.dataSaverEnabled;
  const localStore = useLocalStore(createMindsVideoStore, {
    entity: props.entity,
    autoplay: props.autoplay,
    dataSaverEnabled,
  });

  if (props.video && props.video.uri !== localStore.video.uri) {
    localStore.setVideo(props.video);
  }

  const onStoreCreated = props.onStoreCreated;

  // limit the video thumb to a maximum size of 1024
  const posterSource = useRef(getVideoThumb(props.entity, 1024)).current;
  const thumbnailSource = useRef(
    props.entity && dataSaverEnabled
      ? getVideoThumb(props.entity, DATA_SAVER_THUMB_RES)
      : undefined,
  ).current;

  const isFocused = useIsFocused();

  if (!isFocused && !localStore.paused) {
    localStore.pause();
  }

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

  // Show inProgress overlay if load has started
  const inProgressOverlay = localStore.inProgress && <InProgress />;

  // Show Error overlay if not in progress and error
  const errorOverlay = !localStore.inProgress && localStore.error && <Error />;

  // Show Transcoding overlay if onError and isTranscoding Service -> true
  const transCodingOverlay = localStore.transcoding && <Transcoding />;

  // ^...else, show controls
  const controlsOverlay = !localStore.inProgress &&
    !localStore.error &&
    !localStore.transcoding && (
      <Controls
        localStore={localStore}
        entity={props.entity}
        hideOverlay={props.hideOverlay}
      />
    );

  const imageStyle = useMemo(
    () => ({ opacity: localStore.showThumbnail ? 1 : 0 }),
    [localStore.showThumbnail],
  );

  return (
    <TouchableWithoutFeedback
      onPress={localStore.openControlOverlay}
      style={[theme.flexContainer, props.containerStyle]}>
      <View style={[theme.flexContainer, theme.backgroundBlack]}>
        <SmartImage
          imageVisible={!localStore.showThumbnail}
          style={[theme.positionAbsolute, imageStyle]}
          source={posterSource!}
          thumbnail={thumbnailSource}
          withoutDownloadButton
        />
        <ExpoVideo
          entity={props.entity}
          localStore={localStore}
          repeat={props.repeat}
          resizeMode={props.resizeMode}
          onReadyForDisplay={props.onReadyForDisplay}
        />
        {inProgressOverlay}
        {errorOverlay}
        {transCodingOverlay}
        {controlsOverlay}
      </View>
    </TouchableWithoutFeedback>
  );
});

export default MindsVideo;
