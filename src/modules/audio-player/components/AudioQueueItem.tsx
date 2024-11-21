import TrackPlayer, {
  Track,
  useActiveTrack,
  useIsPlaying,
} from 'react-native-track-player';
import sp from '~/services/serviceProvider';
import { IconButtonNext } from '~/common/ui';
import React, { useEffect, useState } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import AudioTrackComp from './AudioTrackComp';
import useIsTrackDownloaded from '../hooks/useIsTrackDownloaded';

export type AudioQueueItemProps = {
  track: Track;
  trackIndex: number;
  onRemoveTrack: (track: Track) => void;
};

const ANGLE = 10;
const TIME = 150;
const EASING = Easing.bezier(0.25, -0.5, 0.25, 1);

export const AudioQueueItem = (props: AudioQueueItemProps) => {
  const service = sp.resolve('audioPlayer');

  const track = props.track;
  const trackIndex = props.trackIndex;

  const sv = useSharedValue<number>(0);
  const { playing } = useIsPlaying();
  const activeTrack = useActiveTrack();
  const [activeTrackIndex, setActiveTrackIndex] = useState<number>();
  const [isPlaying, setPlaying] = useState(false);
  const [isDownloading, setDownloading] = useState(false);
  const isDownloaded = useIsTrackDownloaded(track);

  useEffect(() => {
    TrackPlayer.getActiveTrackIndex().then(index => setActiveTrackIndex(index));
  }, [activeTrack]);

  useEffect(() => {
    setPlaying(!!playing && trackIndex === activeTrackIndex);
  }, [playing, activeTrackIndex]);

  React.useEffect(() => {
    sv.value = withRepeat(
      withSequence(
        withTiming(ANGLE * -1, {
          duration: TIME,
          easing: EASING,
        }),
        withTiming(ANGLE, {
          duration: TIME,
          easing: EASING,
        }),
      ),
      -1,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${sv.value}deg` }],
  }));

  const rightButtons = (
    <>
      <IconButtonNext
        testID="remove-track"
        scale
        name="playlist-remove"
        size={32}
        onPress={async () => {
          await TrackPlayer.remove(trackIndex);
          props.onRemoveTrack(track);
        }}
      />
      <Animated.View style={[isDownloading ? animatedStyle : undefined]}>
        <IconButtonNext
          testID="download-track"
          scale
          name={
            isDownloading
              ? 'downloading'
              : isDownloaded
              ? 'offline-pin'
              : 'download-for-offline'
          }
          size={32}
          color={isDownloaded ? 'Done' : 'SecondaryText'}
          onPress={async () => {
            if (isDownloaded) {
              await service.deleteTrack(track);
            } else {
              setDownloading(true);
              // Download logic
              await service.downloadTrack(track);
              setDownloading(false);
            }
          }}
        />
      </Animated.View>
      <IconButtonNext
        testID="play-track"
        scale
        name={isPlaying ? 'pause-circle' : 'play-circle'}
        size={32}
        onPress={async () => {
          if (isPlaying) {
            await TrackPlayer.pause();
          } else {
            await TrackPlayer.skip(trackIndex);
            await TrackPlayer.play(); // And then play
          }
        }}
      />
    </>
  );

  return <AudioTrackComp track={track} rightButtons={rightButtons} />;
};
