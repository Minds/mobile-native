import React, { useRef } from 'react';
import { observer } from 'mobx-react';
import settingsStore from '../../../settings/SettingsStore';
import { MindsVideoStoreType } from './createMindsVideoStore';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import type CommentModel from '../../../comments/CommentModel';
import { Video, ResizeMode } from 'expo-av';
import ThemedStyles from '../../../styles/ThemedStyles';
import { toJS } from 'mobx';

type PropsType = {
  entity?: ActivityModel | CommentModel;
  localStore: MindsVideoStoreType;
  repeat?: boolean;
  pause?: boolean;
  resizeMode?: ResizeMode;
  ignoreDataSaver?: boolean;
};

const ExpoVideo = observer(
  ({
    entity,
    localStore,
    repeat = true,
    resizeMode,
    ignoreDataSaver,
  }: PropsType) => {
    const theme = ThemedStyles.style;
    const playbackObject = useRef<Video>(null);
    const dataSaverEnabled = !ignoreDataSaver && settingsStore.dataSaverEnabled;

    const thumb_uri = entity
      ? entity.get('custom_data.thumbnail_src') || entity.thumbnail_src
      : null;

    const source = localStore.video.uri ? toJS(localStore.video) : undefined;

    if (!localStore.player && playbackObject.current) {
      localStore.setPlayer(playbackObject.current);
    }

    return (
      <Video
        key={`video${localStore.source}`}
        onPlaybackStatusUpdate={localStore.updatePlaybackCallback}
        onLoadStart={localStore.onLoadStart}
        onLoad={localStore.onVideoLoad}
        onError={localStore.onError}
        source={source}
        usePoster={true}
        posterSource={dataSaverEnabled ? undefined : { uri: thumb_uri }}
        isLooping={repeat}
        resizeMode={resizeMode || 'contain'}
        useNativeControls={false}
        style={theme.flexContainer}
        ref={playbackObject}
        volume={localStore.initialVolume || 0}
      />
    );
  },
);

export default ExpoVideo;
