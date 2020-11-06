import React, { useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react';

import {
  TouchableWithoutFeedback,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { ResizeMode, VideoReadyForDisplayEvent } from 'expo-av';
import videoPlayerService from '../../../common/services/video-player.service';
import type CommentModel from '../../../comments/CommentModel';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import ThemedStyles from '../../../styles/ThemedStyles';
import createMindsVideoStore from './createMindsVideoStore';
import ExpoVideo from './Video';
import Error from './overlays/Error';
import Transcoding from './overlays/Transcoding';
import InProgress from './overlays/InProgress';
import Controls from './overlays/Controls';
import { useIsFocused } from '@react-navigation/native';

type Source = {
  src: string;
  size: number;
};

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
};

const MindsVideo = observer((props: PropsType) => {
  const theme = ThemedStyles.style;
  const localStore = useLocalStore(createMindsVideoStore, {
    entity: props.entity,
    autoplay: props.autoplay,
  });

  if (props.video && props.video.uri !== localStore.video.uri) {
    localStore.setVideo(props.video);
  }

  const onStoreCreated = props.onStoreCreated;

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

  return (
    <TouchableWithoutFeedback
      onPress={localStore.openControlOverlay}
      style={[theme.flexContainer, props.containerStyle]}>
      <View style={[theme.flexContainer, theme.backgroundBlack]}>
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
