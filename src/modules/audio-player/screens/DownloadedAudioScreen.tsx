import { useWindowDimensions } from 'react-native';
import useGetDownloadedList from '../hooks/useGetDownloadedList';
import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { DownloadedTrack } from '../services/audio-download.service';
import AudioTrackComp from '../components/AudioTrackComp';
import { IconButtonNext, Screen, ScreenHeader } from '~/common/ui';
import TrackPlayer, {
  Track,
  useActiveTrack,
  useIsPlaying,
} from 'react-native-track-player';
import sp from '~/services/serviceProvider';

export default function DownloadedAudioScreen() {
  const { list } = useGetDownloadedList();

  const activeTrack = useActiveTrack();
  const { playing } = useIsPlaying();

  const { height } = useWindowDimensions();

  const renderItem = useCallback(
    (row: { index: number; item: DownloadedTrack; target: string }) => {
      const track: Track = { ...row.item, url: row.item.localFilePath };
      delete track.headers; // Causes a crash when trying to load
      const isPlaying = playing && track.id === activeTrack?.id;
      return (
        <AudioTrackComp
          track={track}
          rightButtons={
            <>
              <IconButtonNext
                scale
                name="playlist-add"
                size={32}
                onPress={async () => {
                  await TrackPlayer.add(track);
                }}
              />
              <IconButtonNext
                scale
                name={'offline-pin'}
                size={32}
                color={'Done'}
                onPress={async () => {
                  await sp.resolve('audioPlayer').deleteTrack(track);
                }}
              />
              <IconButtonNext
                scale
                name={isPlaying ? 'pause-circle' : 'play-circle'}
                size={32}
                style={sp.styles.style.colorPrimaryText}
                onPress={async () => {
                  if (isPlaying) {
                    await TrackPlayer.pause();
                  } else {
                    await TrackPlayer.load(track);
                    const progress = sp
                      .resolve('audioPlayer')
                      .getTrackProgress(track.id);
                    if (progress < (track.duration || 0)) {
                      await TrackPlayer.seekTo(progress);
                    }
                    await TrackPlayer.play();
                  }
                }}
              />
            </>
          }
        />
      );
    },
    [playing, activeTrack],
  );

  return (
    <Screen safe onlyTopEdge>
      <ScreenHeader title={sp.i18n.t('moreScreen.downloadedAudio')} back />
      <FlashList
        estimatedItemSize={12}
        data={Object.values(list || {})}
        renderItem={renderItem}
        drawDistance={height}
        testID="audio-list"
      />
    </Screen>
  );
}
