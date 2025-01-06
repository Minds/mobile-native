import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import type ActivityModel from '~/newsfeed/ActivityModel';

import domain from '../../helpers/domain';
import MText from '../MText';
import MediaViewImage from './MediaViewImage';
import { FeedStreamPlayer } from '~/modules/livepeer';
import sp from '~/services/serviceProvider';
import type { WebViewProps } from 'react-native-webview';

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

  let showPlayIcon = false;
  let onTap: (() => void) | undefined = undefined;
  const [showEmbeddedPlayer, setShowEmbeddedPlayer] = useState<any>();
  let embeddedPlayer: any = undefined;

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

  let youtubeVideoId;

  // check if it's a youtube video
  if (entity.perma_url) {
    let matches,
      youtube =
        /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/i;

    if ((matches = youtube.exec(entity.perma_url)) !== null) {
      if (matches[1]) {
        youtubeVideoId = matches[1];
        showPlayIcon = true;
        onTap = () =>
          navigation.push('YoutubePlayer', {
            videoId: youtubeVideoId,
            title: entity.link_title,
          });
      }
    }

    // Vimeo
    const vimeo =
      /^(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)(?:\/([\da-f]+))?(?:\?.*|$)/i;
    if ((matches = vimeo.exec(entity.perma_url)) !== null) {
      if (matches[1]) {
        showPlayIcon = true;
        onTap = () => {
          setShowEmbeddedPlayer(true);
        };

        const WebView = require('react-native-webview').WebView;
        const source: WebViewProps['source'] = {
          html: `
            <html>
              <head>
                <meta name="viewport" content="initial-scale=1.0"/>
                <style>
                  html, body, iframe {
                    margin: 0;
                    padding: 0;
                  }
                  iframe {  
                    width: 100%;
                    height: 100%;
                  }
                </style>
              </head>
              <body>
              <iframe
                src="https://player.vimeo.com/video/${matches[1]}?h=${matches[2]}&title=0&byline=0&portrait=0&autoplay=1"
                frameborder="0"
                webkitallowfullscreen mozallowfullscreen allowfullscreen allow="autoplay; fullscreen"></iframe>
              </body>
            </html>
            `,
          baseUrl: 'http://localhost',
        };

        embeddedPlayer = (
          <WebView
            source={source}
            mixedContentMode="compatibility"
            style={[
              sp.styles.style.bgSecondaryBackground,
              { width: '100%', aspectRatio: 16 / 9 },
            ]}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            allowsFullscreenVideo={true}
            startInLoadingState={true}
          />
        );
      }
    }
  }

  if (!small) {
    return (
      <View style={styles.smallContainerStyle}>
        {showEmbeddedPlayer ? (
          embeddedPlayer
        ) : (
          <>
            {source.uri ? (
              <MediaViewImage
                showPlayIcon={showPlayIcon}
                entity={entity}
                onImagePress={onTap ? onTap : onImagePress}
                onImageLongPress={onImageLongPress}
                style={sp.styles.style.bgSecondaryBackground}
              />
            ) : null}
            <TouchableOpacity
              style={sp.styles.style.padding4x}
              onPress={onTap ? onTap : openLink}>
              <MText style={titleStyle}>{title}</MText>
              <MText style={domainStyle}>{domain(entity.perma_url)}</MText>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      {showEmbeddedPlayer ? (
        embeddedPlayer
      ) : (
        <>
          <TouchableOpacity activeOpacity={1} testID="Posted Image">
            <MediaViewImage
              style={imageStyle}
              entity={entity}
              onImagePress={onTap ? onTap : onImagePress}
              onImageLongPress={onImageLongPress}
              mode="cover"
              showPlayIcon={showPlayIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={titleContainerStyle}
            onPress={onTap ? onTap : openLink}>
            <MText numberOfLines={2} style={titleStyle}>
              {title}
            </MText>
            <MText style={domainStyle}>{domain(entity.perma_url)}</MText>
          </TouchableOpacity>
        </>
      )}
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
