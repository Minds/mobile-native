import React, { useRef } from 'react';
import { observer } from 'mobx-react';
import { MindsVideoStoreType } from './createMindsVideoStore';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import type CommentModel from '../../../comments/CommentModel';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import ThemedStyles from '../../../styles/ThemedStyles';
import ExplicitImage from '../../../common/components/explicit/ExplicitImage';
import apiService from '../../../common/services/api.service';

type PropsType = {
  entity?: ActivityModel | CommentModel;
  localStore: MindsVideoStoreType;
  repeat?: boolean;
  pause?: boolean;
  resizeMode?: ResizeMode;
};

const ExpoVideo = observer(
  ({ entity, localStore, repeat, resizeMode, pause }: PropsType) => {
    const theme = ThemedStyles.style;
    const playbackObject = useRef<Video>(null);

    const thumb_uri = entity
      ? entity.get('custom_data.thumbnail_src') || entity.thumbnail_src
      : null;

    const updatePlaybackCallback = (status: AVPlaybackStatus) => {
      if (!localStore.player && playbackObject.current) {
        localStore.setPlayer(playbackObject.current);
      }
      if (!status.isLoaded && status.error) {
        localStore.onError(status.error);
      } else {
        if (status.isLoaded) {
          if (status.shouldPlay === localStore.paused) {
            localStore.togglePaused();
          }

          if (status.isPlaying) {
            localStore.onProgress(status.positionMillis || 0);
            localStore.setDuration(status.durationMillis || 0);
          }

          if (status.didJustFinish && !status.isLooping) {
            localStore.onVideoEnd();
          }
        }
      }
    };

    if (localStore.active || !thumb_uri) {
      return (
        <Video
          key={`video${localStore.source}`}
          volume={localStore.volume}
          onPlaybackStatusUpdate={updatePlaybackCallback}
          onLoadStart={localStore.onLoadStart}
          onLoad={localStore.onVideoLoad}
          onError={(msg) => localStore.onError(msg)}
          source={{
            uri: localStore.video.uri,
            headers: apiService.buildHeaders(),
          }}
          shouldPlay={true}
          isLooping={repeat || false}
          resizeMode={resizeMode || 'cover'}
          useNativeControls={false}
          style={theme.flexContainer}
          ref={playbackObject}
        />
      );
    } else {
      const image = { uri: thumb_uri };
      return (
        <ExplicitImage
          onLoadEnd={localStore.onLoadEnd}
          onError={(msg) => localStore.onError(msg)}
          source={image}
          entity={entity}
        />
      );
    }
  },
);

export default ExpoVideo;
