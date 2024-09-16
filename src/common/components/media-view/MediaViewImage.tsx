import { ImageProps, ImageStyle } from 'expo-image';
import React from 'react';
import { View, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import Pinchable from 'react-native-pinchable';

import { APP_API_URI, DATA_SAVER_THUMB_RES, IS_IPAD } from '~/config/Config';
import type ActivityModel from '~/newsfeed/ActivityModel';
import domain from '../../helpers/domain';
import mediaProxyUrl from '../../helpers/media-proxy-url';
import MText from '../MText';
import useRecycledState from '~/common/hooks/useRecycledState';
import SmartImage from '../SmartImage';
import { getMaxFeedWidth } from '~/styles/Style';
import sp from '~/services/serviceProvider';
import { useMemoStyle } from '~/styles/hooks';
import { PlayButton } from '~/media/v2/mindsVideo/overlays/Controls';

type PropsType = {
  showPlayIcon?: boolean;
  entity: ActivityModel;
  style?: ImageProps['style'];
  autoHeight?: boolean;
  ignoreDataSaver?: boolean;
  mode?: ImageProps['contentFit'];
  onImageDoublePress?: () => void;
  onImagePress?: () => void;
  onImageLongPress?: () => void;
};

const { width: winWidth, height } = Dimensions.get('window');
const width = IS_IPAD ? Math.min(getMaxFeedWidth(), winWidth) : winWidth;

export default function MediaViewImage({
  showPlayIcon,
  entity,
  style,
  autoHeight,
  ignoreDataSaver,
  mode = 'contain',
  onImagePress,
  onImageLongPress,
}: PropsType) {
  const [imageLoadFailed, setImageLoadFailed] = useRecycledState(false, entity);
  const [size, setSize] = useRecycledState({ height: 0, width: 0 }, entity);
  const source = React.useMemo(
    () => {
      return entity.hasSiteMembershipPaywallThumbnail
        ? `${APP_API_URI}api/v3/payments/site-memberships/paywalled-entities/thumbnail/${entity.guid}`
        : entity.site_membership && entity.custom_data?.[0]?.blurhash
        ? entity.custom_data?.[0]?.blurhash
        : entity.thumbnail_src
        ? entity.thumbnail_src
        : entity.getThumbSource('xlarge');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      entity,
      //@ts-ignore
      entity.attachment_guid,
    ],
  );
  const thumbnail = React.useMemo(
    () =>
      entity.isGif()
        ? undefined
        : {
            ...source,
            uri: mediaProxyUrl(
              entity.getThumbSource('medium').uri, // convert from medium size to save some backend resources
              DATA_SAVER_THUMB_RES,
            ),
          },
    [entity, source],
  );

  let aspectRatio = 1.5;

  const MIN_ASPECT_RATIO_FIXED = width / height; // the same as screen height
  const MIN_ASPECT_RATIO_AUTO_WIDTH = width / (height * 4); // four times screen height

  if (
    entity.hasSiteMembershipPaywallThumbnail &&
    entity.paywall_thumbnail?.height &&
    entity.paywall_thumbnail?.width
  ) {
    aspectRatio =
      entity.paywall_thumbnail.width / entity.paywall_thumbnail.height;
  } else if (
    entity.custom_data &&
    entity.custom_data[0] &&
    entity.custom_data[0].height &&
    entity.custom_data[0].height !== '0'
  ) {
    aspectRatio = entity.custom_data[0].width / entity.custom_data[0].height;
  } else if (size.height > 0) {
    aspectRatio = size.width / size.height;
  }

  if (autoHeight) {
    if (aspectRatio < MIN_ASPECT_RATIO_AUTO_WIDTH) {
      aspectRatio = MIN_ASPECT_RATIO_AUTO_WIDTH;
      mode = 'cover';
    }
  } else {
    if (aspectRatio < MIN_ASPECT_RATIO_FIXED) {
      aspectRatio = MIN_ASPECT_RATIO_FIXED;
      mode = 'cover';
    }
  }

  const imageStyle = useMemoStyle(
    ['fullWidth', { aspectRatio }, style as ImageStyle],
    [aspectRatio, style],
  );

  const imageError = () => {
    setImageLoadFailed(true);
  };

  /**
   * On image load handler
   */
  const onLoadImage = e => {
    if (autoHeight) {
      setSize({
        height: e.height,
        width: e.width,
      });
    }
  };

  if (imageLoadFailed) {
    let text = <MText style={errorTextStyle}>{sp.i18n.t('errorMedia')}</MText>;

    if (entity.perma_url) {
      text = (
        <MText style={errorTextStyle}>
          The media from{' '}
          <MText style={sp.styles.style.fontMedium}>
            {domain(entity.perma_url)}
          </MText>{' '}
          could not be loaded.
        </MText>
      );
    }

    return <View style={errorContainerStyle}>{text}</View>;
  }
  const blurhash = entity?.custom_data?.[0]?.blurhash || entity?.blurhash;

  const placeholder = blurhash ? { blurhash, width: 9, height: 9 } : thumbnail;

  // Wrapped in a pressable to avoid the press event after zooming on android (Pinchable bug)
  return (
    <Pressable>
      <Pinchable key={entity.guid}>
        <TouchableOpacity
          onPress={onImagePress}
          onLongPress={onImageLongPress}
          style={imageStyle}
          activeOpacity={1}
          testID="Posted Image">
          <SmartImage
            contentFit={mode}
            style={imageStyle}
            source={source}
            onLoad={onLoadImage}
            onError={imageError}
            ignoreDataSaver={ignoreDataSaver || Boolean(entity?.paywall)}
            placeholder={placeholder}
            locked={entity?.isLocked()}
            recyclingKey={entity.urn}
          />
          {showPlayIcon && (
            <View style={playIconStyle}>
              <PlayButton paused />
            </View>
          )}
        </TouchableOpacity>
      </Pinchable>
    </Pressable>
  );
}

const errorTextStyle = sp.styles.combine('fontS', 'colorTertiaryText');
const errorContainerStyle = sp.styles.combine(
  'padding4x',
  'bgSecondaryBackground',
  'centered',
  { height: 200 },
);
const playIconStyle = sp.styles.combine(
  'absoluteFill',
  'centered',
  'marginTop2x',
  {
    alignSelf: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
);
