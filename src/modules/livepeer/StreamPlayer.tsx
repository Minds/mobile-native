import React from 'react';
import { usePlaybackInfo } from '@livepeer/react-native/hooks';
import { StyleSheet, View } from 'react-native';
import Icon from '@expo/vector-icons/Foundation';

import { B2, H2 } from '~/common/ui';
import { RecordPlayer } from './ReacordPlayer';
import useRecordedVideo from './hooks/useRecordedVideo';

export type StreamPlayerProps = {
  id: string;
  enabled?: boolean;
  testID?: string;
};

/**
 * Livepeer live streaming player
 */
export const StreamPlayer = ({ id, enabled, testID }: StreamPlayerProps) => {
  const playbackInfo = usePlaybackInfo({
    playbackId: id,
    refetchInterval: 20000,
    enabled,
  });

  if (!playbackInfo.data) {
    return <View style={playerStyle.box16to9} testID="box16to9" />;
  }

  if (
    playbackInfo.data.type === 'live' &&
    playbackInfo.data.meta?.live === false
  ) {
    return <StreamOffline id={id} enabled={enabled} />;
  }

  // Wrapped in a pressable in order to avoid navigating to the post when the user taps on the video player
  return (
    <RecordPlayer
      src={playbackInfo.data.meta.source[0].url}
      enabled={enabled}
      testID={testID}
    />
  );
};

const StreamOffline = ({ id, enabled }: StreamPlayerProps) => {
  const record = useRecordedVideo(id, enabled);

  if (record.isLoading || !record.data) {
    return <View style={playerStyle.box16to9} />;
  }

  if (!record.data || record.data.status !== 'ready') {
    return <StreamOfflineMessage />;
  } else {
    return <RecordPlayer src={record.data?.playbackId} enabled={enabled} />;
  }
};

const StreamOfflineMessage = () => (
  <View style={playerStyle.box16to9} testID="offlineMessage">
    <Icon name="play-video" color="white" size={53} />
    <H2>Stream is offline</H2>
    <B2 align="center">
      Playback will start automatically once the stream has started
    </B2>
  </View>
);

export const playerStyle = StyleSheet.create({
  box16to9: {
    width: '100%',
    justifyContent: 'center',
    padding: 16,
    alignItems: 'center',
    aspectRatio: 16 / 9,
    backgroundColor: 'black',
  },
});
