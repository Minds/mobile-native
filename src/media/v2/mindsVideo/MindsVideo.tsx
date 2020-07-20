import React, { useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react';

// workaround to fix tooltips on android
import Tooltip from 'rne-modal-tooltip';

import {
  PanResponder,
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
};

const MindsVideo = observer((props: PropsType) => {
  const theme = ThemedStyles.style;
  const localStore = useLocalStore(createMindsVideoStore);

  useEffect(() => {
    let onScreenBlur: any;
    if (!localStore.inited) {
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
      });
      onScreenBlur = NavigationService.addListener('blur', () => {
        localStore.setShouldPlay(false);
      });
    }

    return () => {
      if (onScreenBlur) {
        onScreenBlur();
      }
      if (videoPlayerService.current === MindsVideo) {
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
      <Controls localStore={localStore} entity={props.entity} />
    );

  return (
    <View
      style={[
        theme.flexContainer,
        theme.backgroundBlack,
        props.containerStyle,
      ]}>
      <TouchableWithoutFeedback
        style={theme.flexContainer}
        onPress={localStore.openControlOverlay}>
        <ExpoVideo
          entity={props.entity}
          localStore={localStore}
          repeat={props.repeat}
          resizeMode={props.resizeMode}
        />
      </TouchableWithoutFeedback>
      {inProgressOverlay}
      {errorOverlay}
      {transCodingOverlay}
      {controlsOverlay}
    </View>
  );
});

export default MindsVideo;
