import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { MindsVideoStoreType } from './createMindsVideoStore';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import type CommentModel from '../../../comments/CommentModel';
import { Video, ResizeMode, VideoReadyForDisplayEvent } from 'expo-av';
import ThemedStyles from '../../../styles/ThemedStyles';
import { toJS } from 'mobx';

type PropsType = {
  entity?: ActivityModel | CommentModel;
  localStore: MindsVideoStoreType;
  repeat?: boolean;
  resizeMode?: ResizeMode;
  onReadyForDisplay?: (event: VideoReadyForDisplayEvent) => void;
};

const ExpoVideo = observer(
  ({
    entity,
    localStore,
    repeat = true,
    resizeMode,
    onReadyForDisplay,
  }: PropsType) => {
    const theme = ThemedStyles.style;
    const playbackObject = useRef<Video>(null);

    const thumb_uri = entity
      ? entity.get('custom_data.thumbnail_src') || entity.thumbnail_src
      : null;

    const source = localStore.video.uri ? toJS(localStore.video) : undefined;

    useEffect(() => {
      if (!localStore.player && playbackObject.current) {
        localStore.setPlayer(playbackObject.current);
      }
    }, [localStore]);

    return (
      <Video
        key={`video${localStore.source}`}
        onPlaybackStatusUpdate={localStore.updatePlaybackCallback}
        onLoadStart={localStore.onLoadStart}
        onLoad={localStore.onVideoLoad}
        shouldPlay={!localStore.paused}
        onError={localStore.onError}
        source={source}
        usePoster={!!thumb_uri}
        posterSource={{ uri: thumb_uri }}
        isLooping={repeat}
        resizeMode={resizeMode || 'contain'}
        useNativeControls={false}
        style={theme.flexContainer}
        ref={playbackObject}
        volume={localStore.volume}
        onReadyForDisplay={onReadyForDisplay}
      />
    );
  },
);

export default ExpoVideo;
