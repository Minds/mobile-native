import React, { useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react';

import {
  TouchableWithoutFeedback,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { ResizeMode } from 'expo-av';
import videoPlayerService from '../../../common/services/video-player.service';
import NavigationService from '../../../navigation/NavigationService';
import type CommentModel from '../../../comments/CommentModel';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import ThemedStyles from '../../../styles/ThemedStyles';
import createMindsVideoStore from './createMindsVideoStore';
import ExpoVideo from './Video';
import Error from './overlays/Error';
import Transcoding from './overlays/Transcoding';
import InProgress from './overlays/InProgress';
import Controls from './overlays/Controls';

type Source = {
  src: string;
  size: number;
};

type PropsType = {
  entity?: ActivityModel | CommentModel;
  pause?: boolean;
  repeat?: boolean;
  resizeMode?: ResizeMode;
  video?: { uri: string };
  containerStyle?: StyleProp<ViewStyle>;
  onStoreCreated: Function;
};

const MindsVideo = observer((props: PropsType) => {
  const theme = ThemedStyles.style;
  const localStore = useLocalStore(createMindsVideoStore);

  const play = (sound: boolean) => {
    localStore.play(sound, props.entity);
  };

  const pause = () => {
    localStore.pause();
  };

  useEffect(() => {
    let onScreenBlur: any;
    if (!localStore.inited) {
      onScreenBlur = NavigationService.addListener('blur', () => {
        localStore.setShouldPlay(false);
      });
      localStore.toggleInited();
      props.onStoreCreated && props.onStoreCreated(localStore);
      if (props.pause !== undefined && props.pause === false) {
        localStore.setShouldPlay(true);
      }
    }

    if (props.video && props.video.uri !== localStore.video.uri) {
      localStore.setVideo(props.video);
    }

    return () => {
      if (onScreenBlur) {
        onScreenBlur();
      }
      if (videoPlayerService.current === MindsVideo) {
        videoPlayerService.clear();
      }

      localStore.toggleInited();
    };
  }, [localStore, props]);

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
      <Controls localStore={localStore} entity={props.entity} />
    );

  return (
    <TouchableWithoutFeedback
      onPress={localStore.openControlOverlay}
      style={theme.flexContainer}>
      <View
        style={[
          theme.flexContainer,
          theme.backgroundBlack,
          props.containerStyle,
        ]}>
        <ExpoVideo
          entity={props.entity}
          localStore={localStore}
          repeat={props.repeat}
          resizeMode={props.resizeMode}
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
