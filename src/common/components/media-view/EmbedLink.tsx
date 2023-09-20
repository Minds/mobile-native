import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import type ActivityModel from '../../../newsfeed/ActivityModel';
import ThemedStyles from '../../../styles/ThemedStyles';
import domain from '../../helpers/domain';
import MText from '../MText';
import SmartImage from '../SmartImage';
import MediaViewImage from './MediaViewImage';
import { FeedStreamPlayer } from '~/modules/livepeer';

type PropsType = {
  entity: ActivityModel;
  small?: boolean;
  onImagePress?: () => void;
  onImageLongPress?: () => void;
  openLink?: () => void;
};
const IMG_SIZE = 75;
const MAX_TITLE_SIZE = 200;

export default function EmbedLink({
  entity,
  small,
  onImagePress,
  onImageLongPress,
  openLink,
}: PropsType) {
  let title =
    entity.title && entity.title.length > MAX_TITLE_SIZE
      ? entity.title.substring(0, MAX_TITLE_SIZE) + '...'
      : entity.title;

  const source = entity.getThumbSource('xlarge');

  if (
    entity.perma_url?.startsWith('https://minds-player.withlivepeer.com?v=')
  ) {
    const videoId = entity.perma_url?.replace(
      'https://minds-player.withlivepeer.com?v=',
      '',
    );
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
            style={ThemedStyles.style.bgSecondaryBackground}
          />
        ) : null}
        <TouchableOpacity
          style={ThemedStyles.style.padding4x}
          onPress={openLink}>
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

const containerStyle = ThemedStyles.combine(
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

const titleStyle = ThemedStyles.combine('fontL', 'bold');
const titleContainerStyle = ThemedStyles.combine('padding2x', 'flexContainer');
const domainStyle = ThemedStyles.combine('fontM', 'colorSecondaryText');
const imageStyle = ThemedStyles.combine(
  styles.thumbnail,
  'bgTertiaryBackground',
);
