import React from 'react';
import { observer } from 'mobx-react';
import { MindsVideoStoreType } from './createMindsVideoStore';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import type CommentModel from '../../../comments/CommentModel';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import ThemedStyles from '../../../styles/ThemedStyles';
import ExplicitImage from '../../../common/components/explicit/ExplicitImage';

type PropsType = {
  entity?: ActivityModel | CommentModel;
  localStore: MindsVideoStoreType;
  repeat?: boolean;
  resizeMode?: ResizeMode;
};

const ExpoVideo = observer(
  ({ entity, localStore, repeat, resizeMode }: PropsType) => {
    const theme = ThemedStyles.style;

    const thumb_uri = entity
      ? entity.get('custom_data.thumbnail_src') || entity.thumbnail_src
      : null;

    const updatePlaybackCallback = (status: AVPlaybackStatus) => {
      if (!status.isLoaded && status.error) {
        localStore.onError(status.error);
      } else {
        if ('shouldPlay' in status) {
          localStore.onProgress(status.positionMillis || 0);
          localStore.setDuration(status.durationMillis || 0);

          if (status.shouldPlay && !localStore.shouldPlay) {
            localStore.setShouldPlay(true);
          }

          if (!status.shouldPlay && localStore.shouldPlay) {
            localStore.setShouldPlay(false);
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
          onError={localStore.onError}
          source={localStore.video}
          shouldPlay={localStore.shouldPlay}
          isLooping={repeat || false}
          resizeMode={resizeMode || 'contain'}
          useNativeControls={false}
          style={theme.flexContainer}
          ref={(component) => {
            localStore.setPlayer(component);
          }}
        />
      );
    } else {
      const image = { uri: thumb_uri };
      return (
        <ExplicitImage
          onLoadEnd={localStore.onLoadEnd}
          onError={localStore.onError}
          source={image}
          entity={entity}
        />
      );
    }
  },
);

export default ExpoVideo;
