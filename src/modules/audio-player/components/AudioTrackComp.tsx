import moment from 'moment';
import { View } from 'react-native';
import { Track } from 'react-native-track-player';
import MText from '~/common/components/MText';
import SmartImage from '~/common/components/SmartImage';
import sp from '~/services/serviceProvider';
import { formatDuration } from '../utils/duration-format';
import React, { ReactNode } from 'react';

export type AudioTrackCompProps = {
  track: Track;
  rightButtons: ReactNode;
};

export default function AudioTrackComp(props: AudioTrackCompProps) {
  const track = props.track;
  const rightButtons = props.rightButtons;

  return (
    <View
      style={[
        sp.styles.style.paddingVertical2x,
        sp.styles.style.paddingHorizontal4x,
        sp.styles.style.rowJustifySpaceBetween,
        sp.styles.style.alignCenter,
      ]}>
      <View
        style={[
          sp.styles.style.rowJustifySpaceBetween,
          sp.styles.style.alignCenter,
          sp.styles.style.gap4x,
        ]}>
        <View>
          <SmartImage
            contentFit="cover"
            style={[{ width: 48, height: 48 }, sp.styles.style.borderRadius4x]}
            source={track.artwork}
          />
        </View>
        <View>
          <MText
            style={[
              sp.styles.style.fontXS,
              sp.styles.style.colorSecondaryText,
            ]}>
            {track.artist}
          </MText>
          <MText style={[sp.styles.style.fontBold]}>
            {track.title || '...'}
          </MText>
          <MText
            style={[
              sp.styles.style.fontXS,
              sp.styles.style.colorSecondaryText,
            ]}>
            {moment(track.date).fromNow()} &middot;{' '}
            {formatDuration((track.duration || 0) * 1000, true)}
          </MText>
        </View>
      </View>

      <View
        style={[
          sp.styles.style.rowJustifySpaceBetween,
          sp.styles.style.alignCenter,
          sp.styles.style.gap3x,
        ]}>
        {rightButtons}
      </View>
    </View>
  );
}
