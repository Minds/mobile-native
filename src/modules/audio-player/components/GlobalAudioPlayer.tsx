import { View } from 'react-native';
import { Slider } from 'react-native-elements';
import TrackPlayer, {
  State,
  useActiveTrack,
  useIsPlaying,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import MText from '~/common/components/MText';
import { IconButtonNext, Row } from '~/common/ui';
import Icon from '@expo/vector-icons/MaterialIcons';
import sp from '~/services/serviceProvider';
import SmartImage from '~/common/components/SmartImage';
import { pushBottomSheet } from '~/common/components/bottom-sheet';
import { FullscreenAudioPlayer } from './FullscreenAudioPlayer';
import { formatDuration } from '../utils/duration-format';

export type GlobalAudioPlayerProps = {
  fullscreen?: boolean;
};

export default function GlobalAudioPlayer(props: GlobalAudioPlayerProps) {
  const playBackState = usePlaybackState();
  const { playing, bufferingDuringPlay } = useIsPlaying();
  const progress = useProgress();
  const activeTrack = useActiveTrack();
  const fullscreen = !!props.fullscreen;

  const toggleAudio = async () => {
    if (
      playBackState.state == State.Paused ||
      playBackState.state == State.Ready ||
      playBackState.state == State.Ended
    ) {
      if (playBackState.state == State.Ended) {
        await TrackPlayer.seekTo(0); // Play from start again
      }
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  };

  const openFullscreenPlayer = () => {
    pushBottomSheet({
      component: (bottomSheetRef, handleContentLayout) => (
        <View
          onLayout={handleContentLayout}
          style={{ flexDirection: 'column' }}>
          <FullscreenAudioPlayer bottomSheetRef={bottomSheetRef} />
        </View>
      ),
    });
  };

  const onNonControlTap = async () => {
    if (!fullscreen) {
      openFullscreenPlayer();
    } else {
      // Remove from the playlist
      const activeTrackIndex =
        (await TrackPlayer.getActiveTrackIndex()) as number;
      await TrackPlayer.remove(activeTrackIndex);
    }
  };

  const artworkSize = fullscreen ? 128 : 46;

  const trackMeta = (
    <View style={sp.styles.style.paddingHorizontal4x}>
      <MText
        style={[
          sp.styles.style.fontXS,
          fullscreen ? sp.styles.style.textCenter : undefined,
        ]}>
        {activeTrack?.artist || '...'}
      </MText>
      <MText
        style={[
          sp.styles.style.fontBold,
          fullscreen ? sp.styles.style.textCenter : undefined,
        ]}>
        {activeTrack?.title || '...'}
      </MText>
    </View>
  );

  const playerControls = (
    <Row
      align="centerBetween"
      containerStyle={{
        width: 146,
        alignSelf: fullscreen ? 'center' : 'flex-end',
      }}>
      <IconButtonNext
        scale
        name="replay-10"
        size={32}
        color="PrimaryText"
        onPress={async () => {
          await TrackPlayer.seekBy(-10);
          await TrackPlayer.play(); // After seek, always play
        }}
      />
      <IconButtonNext
        scale
        name={playing ? 'pause-circle' : 'play-circle'}
        size={64}
        color="PrimaryText"
        onPress={toggleAudio}
      />
      <IconButtonNext
        scale
        name="forward-10"
        size={32}
        color="PrimaryText"
        onPress={async () => {
          await TrackPlayer.seekBy(10);
          await TrackPlayer.play(); // After seek, always play
        }}
      />
    </Row>
  );

  return activeTrack && playBackState !== undefined ? (
    <View>
      <View>
        <Row align="centerBetween">
          <Row align="centerBetween">
            <View onTouchStart={onNonControlTap}>
              <SmartImage
                contentFit="cover"
                style={[
                  { width: artworkSize, height: artworkSize },
                  sp.styles.style.borderRadius4x,
                ]}
                source={activeTrack.artwork}
              />
              {!fullscreen ? (
                <Icon
                  name={fullscreen ? 'playlist-remove' : 'playlist-play'}
                  size={fullscreen ? 32 : 24}
                  style={[
                    sp.styles.style.colorPrimaryText,
                    { position: 'absolute', bottom: 0 },
                  ]}
                />
              ) : undefined}
            </View>
            {!fullscreen ? trackMeta : null}
          </Row>
          <View style={{ flex: 1, alignSelf: 'center' }}>
            {fullscreen ? (
              <View style={sp.styles.style.paddingVertical2x}>{trackMeta}</View>
            ) : null}
            {playerControls}
          </View>
        </Row>
      </View>

      <View>
        <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 8 }]}>
          <MText style={sp.styles.style.fontXS}>
            {formatDuration(progress.position * 1000)}
          </MText>
          <Slider
            style={[{ flex: 1 }]}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            thumbStyle={{
              height: 12,
              width: 12,
              backgroundColor: sp.styles.getColor('PrimaryText'),
            }}
            trackStyle={fullscreen ? { height: 6 } : undefined}
            onSlidingComplete={async value => {
              await TrackPlayer.seekTo(value);
              await TrackPlayer.play(); // After seek, always play
            }}
            allowTouchTrack></Slider>
          <MText style={sp.styles.style.fontXS}>
            {formatDuration(
              (progress.duration || activeTrack.duration || 0) * 1000,
            )}
          </MText>
        </View>
      </View>
    </View>
  ) : undefined;
}
