import { useWindowDimensions, View } from 'react-native';
import { Slider } from 'react-native-elements';
import TrackPlayer, {
  State,
  useActiveTrack,
  useIsPlaying,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import MText from '~/common/components/MText';
import { IconButtonNext, IconNext, Row } from '~/common/ui';
import Icon from '@expo/vector-icons/MaterialIcons';
import sp from '~/services/serviceProvider';
import SmartImage from '~/common/components/SmartImage';
import { pushBottomSheet } from '~/common/components/bottom-sheet';
import { FullscreenAudioPlayer } from './FullscreenAudioPlayer';
import { formatDuration } from '../utils/duration-format';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PlaybackSpeedPicker } from './PlaybackSpeedPicker';
import { usePlaybackRate } from '../hooks/usePlaybackRate';

export type GlobalAudioPlayerProps = {
  fullscreen?: boolean;
};

export default function GlobalAudioPlayer(props: GlobalAudioPlayerProps) {
  const playBackState = usePlaybackState();
  const { playing } = useIsPlaying();
  const progress = useProgress();
  const activeTrack = useActiveTrack();
  const { rate, refreshRateState } = usePlaybackRate();
  const fullscreen = !!props.fullscreen;

  const { height: wHeight } = useWindowDimensions();

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

  const openPlaybackSpeedPicker = () => {
    pushBottomSheet({
      component: (bottomSheetRef, handleContentLayout) => (
        <View
          onLayout={handleContentLayout}
          style={{ flexDirection: 'column' }}>
          <PlaybackSpeedPicker
            bottomSheetRef={bottomSheetRef}
            onSelected={refreshRateState}
          />
        </View>
      ),
      onClose: () => refreshRateState,
    });
  };

  const onNonControlTap = () => {
    if (!fullscreen) {
      openFullscreenPlayer();
    }
  };

  const artworkSize = fullscreen ? '100%' : 46;

  const trackMeta = (
    <View
      style={[
        !fullscreen
          ? sp.styles.style.paddingHorizontal3x
          : sp.styles.style.paddingTop4x,
        { flexShrink: 1 },
      ]}>
      <TouchableOpacity onPress={onNonControlTap} testID="audio-player-meta">
        <MText style={[sp.styles.style.fontXS]}>
          {activeTrack?.artist || '...'}
        </MText>
        <MText
          ellipsizeMode="tail"
          style={[sp.styles.style.fontBold]}
          numberOfLines={fullscreen ? 3 : 2}>
          {activeTrack?.title || '...'}
        </MText>
      </TouchableOpacity>
    </View>
  );

  const playerControls = (
    <Row
      align="centerBetween"
      containerStyle={{
        width: fullscreen ? '100%' : 146,
        alignSelf: fullscreen ? 'center' : 'flex-end',
      }}>
      {fullscreen ? (
        <>
          <TouchableOpacity
            onPress={openPlaybackSpeedPicker}
            testID="audio-player-speed"
            style={[
              sp.styles.style.flexColumn,
              sp.styles.style.alignCenter,
              sp.styles.style.flexColumnCentered,
            ]}>
            <IconNext
              testID="speed-button"
              name="speed"
              size={24}
              color={rate != 1 ? 'Link' : 'PrimaryText'}
            />
            <MText
              style={[
                sp.styles.style.fontXS,
                sp.styles.style.fontMedium,
                rate != 1
                  ? sp.styles.style.colorLink
                  : sp.styles.style.colorPrimaryText,
              ]}>
              {rate}x
            </MText>
          </TouchableOpacity>
        </>
      ) : undefined}

      <IconButtonNext
        testID="replay-button"
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
        testID="play-button"
        scale
        name={playing ? 'pause-circle' : 'play-circle'}
        size={64}
        color="PrimaryText"
        onPress={toggleAudio}
      />
      <IconButtonNext
        testID="forward-button"
        scale
        name="forward-10"
        size={32}
        color="PrimaryText"
        onPress={async () => {
          await TrackPlayer.seekBy(10);
          await TrackPlayer.play(); // After seek, always play
        }}
      />

      {fullscreen ? (
        <IconButtonNext
          testID="stop-button"
          scale
          name="stop-circle"
          size={32}
          color="PrimaryText"
          onPress={async () => {
            sp.navigation.goBack();
            await TrackPlayer.reset();
          }}
        />
      ) : undefined}
    </Row>
  );

  const progressBar = (
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
            (progress.duration || activeTrack?.duration || 0) * 1000,
          )}
        </MText>
      </View>
    </View>
  );

  return activeTrack && playBackState !== undefined ? (
    <View>
      <View>
        <View style={{ flexDirection: fullscreen ? 'column' : 'row' }}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              flexShrink: 1,
              justifyContent: 'center',
            }}>
            {wHeight > 500 || !fullscreen ? (
              <TouchableOpacity
                onPress={onNonControlTap}
                testID="audio-player-artwork">
                <SmartImage
                  contentFit="cover"
                  style={[
                    {
                      width: artworkSize,
                      maxWidth: '100%',
                      aspectRatio: 1,
                      flexShrink: 1,
                      maxHeight: wHeight / 3,
                    },
                    sp.styles.style.borderRadius4x,
                  ]}
                  source={{
                    uri: activeTrack.artwork,
                    headers: sp.api.buildHeaders(),
                  }}
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
              </TouchableOpacity>
            ) : undefined}
            {!fullscreen ? trackMeta : null}
          </View>
          <View style={{ flex: 1, alignSelf: 'center', minWidth: 148 }}>
            {fullscreen ? (
              <View style={sp.styles.style.paddingVertical2x}>{trackMeta}</View>
            ) : undefined}

            {fullscreen ? progressBar : undefined}

            {playerControls}
          </View>
        </View>
      </View>

      {!fullscreen ? progressBar : undefined}
    </View>
  ) : undefined;
}
