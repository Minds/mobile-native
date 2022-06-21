import { ResizeMode, Video, VideoReadyForDisplayEvent } from 'expo-av';
import { observer } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import type CommentModel from '../../../comments/v2/CommentModel';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import ThemedStyles from '../../../styles/ThemedStyles';
import { MindsVideoStoreType } from './createMindsVideoStore';
import { deactivateKeepAwake } from 'expo-keep-awake';

type PropsType = {
  entity?: ActivityModel | CommentModel;
  localStore: MindsVideoStoreType;
  video?: { uri: string; headers?: any };
  repeat?: boolean;
  resizeMode?: ResizeMode;
  onReadyForDisplay?: (event: VideoReadyForDisplayEvent) => void;
};

const ExpoVideo = observer(
  ({
    localStore,
    repeat = true,
    resizeMode,
    onReadyForDisplay,
    video,
  }: PropsType) => {
    const theme = ThemedStyles.style;
    const playbackObject = useRef<Video>(null);

    useEffect(() => {
      if (!localStore.player && playbackObject.current) {
        localStore.setPlayer(playbackObject.current);
        if (video && video !== localStore.video) {
          localStore.setVideo(video);
        }
      }
    }, [localStore, video]);

    // deactivate keepAwake when this component was unmounted
    useEffect(() => {
      return () => {
        deactivateKeepAwake();
      };
    }, []);

    return (
      <Video
        onPlaybackStatusUpdate={localStore.updatePlaybackCallback}
        onLoadStart={localStore.onLoadStart}
        onLoad={localStore.onVideoLoad}
        onError={localStore.onError}
        isLooping={repeat}
        resizeMode={resizeMode || ResizeMode.CONTAIN}
        useNativeControls={false}
        style={theme.flexContainer}
        ref={playbackObject}
        volume={1}
        onReadyForDisplay={onReadyForDisplay}
      />
    );
  },
);

export default ExpoVideo;
