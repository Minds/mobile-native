import React from 'react';
import { Player } from '@livepeer/react-native';
import { usePlaybackInfo } from '@livepeer/react-native/hooks';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Foundation';

import { B2, H2 } from '~/common/ui';

export type StreamPlayerProps = {
  id: string;
  enabled?: boolean;
};

/**
 * Livepeer live streaming player
 */
export const StreamPlayer = ({ id, enabled }: StreamPlayerProps) => {
  const playbackInfo = usePlaybackInfo({
    playbackId: id,
    refetchInterval: 20000,
    enabled,
  });

  if (!playbackInfo.data) {
    return <View style={styles.box16to9} />;
  }

  if (
    playbackInfo.data.type === 'live' &&
    playbackInfo.data.meta?.live === false
  ) {
    return <StreamOffline />;
  }

  // Wrapped in a pressable in order to avoid navigating to the post when the user taps on the video player
  return (
    <Pressable>
      <Player
        src={playbackInfo.data.meta.source[0].url}
        muted={true}
        aspectRatio="16to9"
        _isCurrentlyShown={enabled}
        autoPlay={true}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  box16to9: {
    width: '100%',
    justifyContent: 'center',
    padding: 16,
    alignItems: 'center',
    aspectRatio: 16 / 9,
    backgroundColor: 'black',
  },
});

const StreamOffline = () => (
  <View style={styles.box16to9}>
    <Icon name="play-video" color="white" size={53} />
    <H2>Stream is offline</H2>
    <B2 align="center">
      Playback will start automatically once the stream has started
    </B2>
  </View>
);
