import React, { useCallback, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { MindsVideoStoreType } from './createMindsVideoStore';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import type CommentModel from '../../../comments/CommentModel';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';

type PropsType = {
  entity?: ActivityModel | CommentModel;
  localStore: MindsVideoStoreType;
};

const Video = observer(({ entity, localStore }: PropsType) => {
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
        onLoad={this.onVideoLoad}
        onError={this.onError}
        source={this.state.video}
        shouldPlay={!paused}
        isLooping={this.props.repeat || false}
        resizeMode={this.props.resizeMode || 'contain'}
        useNativeControls={false}
        style={CS.flexContainer}
      />
    );
  } else {
    const image = { uri: thumb_uri };
    return (
      <ExplicitImage
        onLoadEnd={this.onLoadEnd}
        onError={this.onError}
        source={image}
        entity={entity}
      />
    );
  }
})

export default Video;