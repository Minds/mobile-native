import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { MindsVideoStoreType } from './createMindsVideoStore';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import type CommentModel from '../../../comments/CommentModel';
import { Video, ResizeMode, VideoReadyForDisplayEvent } from 'expo-av';
import ThemedStyles from '../../../styles/ThemedStyles';
import { toJS } from 'mobx';
import mindsService from '../../../common/services/minds.service';
import mediaProxyUrl from '../../../common/helpers/media-proxy-url';
import { ImageURISource } from 'react-native';

type PropsType = {
  entity?: ActivityModel | CommentModel;
  localStore: MindsVideoStoreType;
  repeat?: boolean;
  resizeMode?: ResizeMode;
  onReadyForDisplay?: (event: VideoReadyForDisplayEvent) => void;
};

const getVideoThumb = (
  entity?: ActivityModel | CommentModel,
  size?: number,
): ImageURISource | undefined => {
  const source = entity
    ? mindsService.settings.cinemr_url
      ? {
          uri: `${mindsService.settings.cinemr_url}${
            entity.entity_guid || entity.guid
          }/thumbnail-00001.png`,
        }
      : { uri: entity.get('custom_data.thumbnail_src') || entity.thumbnail_src }
    : undefined;

  if (source && size) {
    source.uri = mediaProxyUrl(source.uri, size);
  }

  return source;
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

    // limit the video thumb to a maximum size of 1024
    const thumb_uri = useRef(getVideoThumb(entity, 1024)).current;

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
        onError={localStore.onError}
        source={source}
        usePoster={!!thumb_uri}
        posterSource={thumb_uri}
        isLooping={repeat}
        resizeMode={resizeMode || 'contain'}
        useNativeControls={false}
        style={theme.flexContainer}
        ref={playbackObject}
        volume={localStore.initialVolume || 0}
        onReadyForDisplay={onReadyForDisplay}
      />
    );
  },
);

export default ExpoVideo;
