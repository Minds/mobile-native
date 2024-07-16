import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import type ActivityModel from '../../../newsfeed/ActivityModel';

import domain from '../../helpers/domain';
import MText from '../MText';
import SmartImage from '../SmartImage';
import MediaViewImage from './MediaViewImage';
import { FeedStreamPlayer } from '~/modules/livepeer';
import sp from '~/services/serviceProvider';

type PropsType = {
  entity: ActivityModel;
  small?: boolean;
  onImagePress?: () => void;
  onImageLongPress?: () => void;
  openLink?: () => void;
};
const IMG_SIZE = 75;
const MAX_TITLE_SIZE = 200;

const LIVEPEER_PLAYER_URLS = [
  'https://minds-player.vercel.app?v=',
  'https://minds-player.withlivepeer.com?v=',
];

export default function EmbedLink({
  entity,
  small,
  onImagePress,
  onImageLongPress,
  openLink,
}: PropsType) {
  let title =
    entity.link_title ||
    (entity.title && entity.title.length > MAX_TITLE_SIZE
      ? entity.title.substring(0, MAX_TITLE_SIZE) + '...'
      : entity.title);

  const source = entity.getThumbSource('xlarge');

  const livePeerURL = LIVEPEER_PLAYER_URLS.find(url =>
    entity.perma_url?.startsWith(url),
  );

  if (livePeerURL && entity.perma_url) {
    const videoId = entity.perma_url.replace(livePeerURL, '');
    return (
      <FeedStreamPlayer
        id={videoId}
        entity={entity}
        key={`${entity.guid}_player`}
      />
    );
  }

  if (!small) {
    return (
      <View style={styles.smallContainerStyle}>
        {source.uri ? (
          <MediaViewImage
            entity={entity}
            onImagePress={onImagePress}
            onImageLongPress={onImageLongPress}
            style={sp.styles.style.bgSecondaryBackground}
          />
        ) : null}
        <TouchableOpacity style={sp.styles.style.padding4x} onPress={openLink}>
          <MText style={titleStyle}>{title}</MText>
          <MText style={domainStyle}>{domain(entity.perma_url)}</MText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        onPress={onImagePress}
        onLongPress={onImageLongPress}
        activeOpacity={1}
        testID="Posted Image">
        <SmartImage style={imageStyle} source={source} contentFit="cover" />
      </TouchableOpacity>
      <TouchableOpacity style={titleContainerStyle} onPress={openLink}>
        <MText numberOfLines={2} style={titleStyle}>
          {title}
        </MText>
        <MText style={domainStyle}>{domain(entity.perma_url)}</MText>
      </TouchableOpacity>
    </View>
  );
}

const containerStyle = sp.styles.combine(
  'rowJustifyStart',
  'borderHair',
  'bcolorPrimaryBorder',
  'borderRadius',
);

const styles = StyleSheet.create({
  smallContainerStyle: { minHeight: 20 },
  thumbnail: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    borderRadius: 2,
  },
});

const titleStyle = sp.styles.combine('fontL', 'bold');
const titleContainerStyle = sp.styles.combine('padding2x', 'flexContainer');
const domainStyle = sp.styles.combine('fontM', 'colorSecondaryText');
const imageStyle = sp.styles.combine(styles.thumbnail, 'bgTertiaryBackground');
