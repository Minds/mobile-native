import { ResizeMode, Video, VideoReadyForDisplayEvent } from 'expo-av';
import { toJS } from 'mobx';
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
  repeat?: boolean;
  resizeMode?: ResizeMode;
  onReadyForDisplay?: (event: VideoReadyForDisplayEvent) => void;
};

const ExpoVideo = observer(
  ({ localStore, repeat = true, resizeMode, onReadyForDisplay }: PropsType) => {
    const theme = ThemedStyles.style;
    const playbackObject = useRef<Video>(null);

    const source = localStore.video.uri ? toJS(localStore.video) : undefined;

    useEffect(() => {
      if (!localStore.player && playbackObject.current) {
        localStore.setPlayer(playbackObject.current);
      }
    }, [localStore]);

    // deactivate keepAwake when this component was unmounted
    useEffect(() => {
      return () => {
        deactivateKeepAwake();
      };
    }, []);

    const readyForDisplay = React.useCallback(
      (event: VideoReadyForDisplayEvent) => {
        onReadyForDisplay && onReadyForDisplay(event);

        localStore.setShowThumbnail(false);
      },
      [localStore, onReadyForDisplay],
    );

    return (
      <Video
        onPlaybackStatusUpdate={localStore.updatePlaybackCallback}
        onLoadStart={localStore.onLoadStart}
        onLoad={localStore.onVideoLoad}
        shouldPlay={!localStore.paused}
        onError={localStore.onError}
        source={source}
        isLooping={repeat}
        resizeMode={resizeMode || ResizeMode.CONTAIN}
        useNativeControls={false}
        style={theme.flexContainer}
        ref={playbackObject}
        volume={1}
        onReadyForDisplay={readyForDisplay}
      />
    );
  },
);

export default ExpoVideo;
