import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation<any>();
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

  let youtubeVideoId,
    navigateToYoutube,
    isYoutubeVideo = false;

  // check if it's a youtube video
  if (entity.perma_url) {
    let matches,
      youtube =
        /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/i;

    if ((matches = youtube.exec(entity.perma_url)) !== null) {
      if (matches[1]) {
        youtubeVideoId = matches[1];
        isYoutubeVideo = true;
        navigateToYoutube = () =>
          navigation.push('YoutubePlayer', {
            videoId: youtubeVideoId,
            title: entity.link_title,
          });
      }
    }
  }

  if (!small) {
    return (
      <View style={styles.smallContainerStyle}>
        {source.uri ? (
          <MediaViewImage
            showPlayIcon={isYoutubeVideo}
            entity={entity}
            onImagePress={isYoutubeVideo ? navigateToYoutube : onImagePress}
            onImageLongPress={onImageLongPress}
            style={ThemedStyles.style.bgSecondaryBackground}
          />
        ) : null}
        <TouchableOpacity
          style={ThemedStyles.style.padding4x}
          onPress={isYoutubeVideo ? navigateToYoutube : openLink}>
          <MText style={titleStyle}>{title}</MText>
          <MText style={domainStyle}>{domain(entity.perma_url)}</MText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={containerStyle} pointerEvents="box-only">
      <TouchableOpacity
        onPress={isYoutubeVideo ? navigateToYoutube : onImagePress}
        onLongPress={onImageLongPress}
        activeOpacity={1}
        testID="Posted Image">
        <SmartImage style={imageStyle} source={source} contentFit="cover" />
      </TouchableOpacity>
      <TouchableOpacity
        style={titleContainerStyle}
        onPress={
          isYoutubeVideo
            ? () =>
                navigation.push('YoutubePlayer', {
                  videoId: youtubeVideoId,
                  title: entity.link_title,
                })
            : openLink
        }>
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
