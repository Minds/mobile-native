import { View } from 'react-native';
import TrackPlayer, {
  useActiveTrack,
  useIsPlaying,
} from 'react-native-track-player';
import MText from '~/common/components/MText';
import { IconButtonNext, Row } from '~/common/ui';
import sp from '~/services/serviceProvider';
import ActivityModel from '~/newsfeed/ActivityModel';
import { useEffect, useState } from 'react';
import SmartImage from '~/common/components/SmartImage';
import { formatDuration } from '../utils/duration-format';
import { showNotification } from 'AppMessages';

export type InlineAudioPlayerProps = {
  entity: ActivityModel;
};

export default function InlineAudioPlayer(props: InlineAudioPlayerProps) {
  const service = sp.resolve('audioPlayer');

  const entity = props.entity;

  const [isPlaying, setPlaying] = useState(false);

  const { playing } = useIsPlaying();

  const activeTrack = useActiveTrack();

  useEffect(() => {
    setPlaying(!!playing && activeTrack?.id === entity.guid);
  }, [activeTrack, entity, playing]);

  const onPlayToggle = async () => {
    if (isPlaying) {
      // Pause actively playing track
      await TrackPlayer.pause();
    } else {
      // Load this track if not already active
      if (activeTrack?.id !== entity.guid) {
        await TrackPlayer.load(await service.buildHybridTrack(entity));
      }
      // And play
      await TrackPlayer.play();
    }
  };

  const onQueueTrack = async () => {
    showNotification('Added to queue');
    await TrackPlayer.add(await service.buildHybridTrack(entity));
  };

  return (
    <View
      style={[
        sp.styles.style.paddingVertical2x,
        sp.styles.style.paddingHorizontal4x,
        { height: 172 }, // Stop jump on load
      ]}>
      <View
        style={[
          sp.styles.style.border,
          sp.styles.style.borderRadius12x,
          sp.styles.style.padding4x,
          { borderColor: sp.styles.getColor('PrimaryBorder') },
        ]}>
        <Row align="centerStart">
          <View style={[sp.styles.style.bcolorAction]}>
            <SmartImage
              contentFit="cover"
              style={[
                { width: 128, height: 128 },
                sp.styles.style.borderRadius10x,
                { backgroundColor: '#333' },
              ]}
              source={{
                uri: entity.custom_data.thumbnail_src,
                headers: sp.api.buildHeaders(),
              }}
              recyclingKey={entity.urn}
            />
          </View>
          <View
            style={[
              sp.styles.style.paddingLeft4x,
              sp.styles.style.gap4x,
              { flex: 1 },
            ]}>
            <View>
              <MText
                style={[
                  sp.styles.style.fontXS,
                  sp.styles.style.colorSecondaryText,
                ]}>
                {entity.ownerObj.name}
              </MText>
              <MText style={[sp.styles.style.fontBold]}>{entity.title}</MText>
            </View>
            <View
              style={[
                sp.styles.style.rowJustifySpaceBetween,
                sp.styles.style.alignCenter,
                sp.styles.style.gap2x,
              ]}>
              <View
                style={[
                  sp.styles.style.rowJustifyStart,
                  sp.styles.style.alignCenter,
                  sp.styles.style.gap2x,
                ]}>
                <IconButtonNext
                  testID="play-track"
                  scale
                  name={isPlaying ? 'pause-circle' : 'play-circle'}
                  size={48}
                  color="PrimaryText"
                  onPress={onPlayToggle}
                />
                <MText
                  style={[
                    sp.styles.style.fontXS,
                    sp.styles.style.colorSecondaryText,
                  ]}>
                  {formatDuration(
                    entity.custom_data.duration_secs * 1000,
                    true,
                  )}{' '}
                </MText>
              </View>
              <IconButtonNext
                testID="queue-track"
                scale
                name="playlist-add"
                size="small"
                style={sp.styles.style.colorPrimaryText}
                onPress={onQueueTrack}
              />
            </View>
          </View>
        </Row>
      </View>
    </View>
  );
}
