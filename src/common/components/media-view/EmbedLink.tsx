import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

import type ActivityModel from '../../../newsfeed/ActivityModel';
import ThemedStyles from '../../../styles/ThemedStyles';
import domain from '../../helpers/domain';
import DoubleTap from '../DoubleTap';
import SmartImage from '../SmartImage';
import MediaViewImage from './MediaViewImage';

type PropsType = {
  entity: ActivityModel;
  small?: boolean;
  onImageDoublePress?: () => void;
  onImagePress?: () => void;
  onImageLongPress?: () => void;
  openLink?: () => void;
};
const IMG_SIZE = 75;
const MAX_TITLE_SIZE = 200;
const DoubleTapTouchable = DoubleTap(TouchableOpacity);

export default function EmbedLink({
  entity,
  small,
  onImageDoublePress,
  onImagePress,
  onImageLongPress,
  openLink,
}: PropsType) {
  let title =
    entity.title && entity.title.length > MAX_TITLE_SIZE
      ? entity.title.substring(0, MAX_TITLE_SIZE) + '...'
      : entity.title;

  const source = entity.getThumbSource('xlarge');

  if (!small) {
    return (
      <View style={styles.smallContainerStyle}>
        {source.uri ? (
          <MediaViewImage
            entity={entity}
            onImageDoublePress={onImageDoublePress}
            onImagePress={onImagePress}
            onImageLongPress={onImageLongPress}
          />
        ) : null}
        <TouchableOpacity
          style={ThemedStyles.style.padding4x}
          onPress={openLink}>
          <Text style={titleStyle}>{title}</Text>
          <Text style={domainStyle}>{domain(entity.perma_url)}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <DoubleTapTouchable
        onDoubleTap={onImageDoublePress}
        onPress={onImagePress}
        onLongPress={onImageLongPress}
        activeOpacity={1}
        testID="Posted Image">
        <SmartImage
          style={imageStyle}
          source={source}
          resizeMode={FastImage.resizeMode.cover}
        />
      </DoubleTapTouchable>
      <TouchableOpacity style={titleContainerStyle} onPress={openLink}>
        <Text numberOfLines={2} style={titleStyle}>
          {title}
        </Text>
        <Text style={domainStyle}>{domain(entity.perma_url)}</Text>
      </TouchableOpacity>
    </View>
  );
}

const containerStyle = ThemedStyles.combine(
  'rowJustifyStart',
  'borderHair',
  'borderPrimary',
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
const imageStyle = ThemedStyles.combine(styles.thumbnail, 'backgroundTertiary');
