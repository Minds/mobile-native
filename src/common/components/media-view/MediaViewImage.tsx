import { ImageProps, ImageStyle } from 'expo-image';
import React from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';

import { DATA_SAVER_THUMB_RES } from '../../../config/Config';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import ThemedStyles, { useMemoStyle } from '../../../styles/ThemedStyles';
import domain from '../../helpers/domain';
import mediaProxyUrl from '../../helpers/media-proxy-url';
import i18n from '../../services/i18n.service';
import DoubleTap from '../DoubleTap';

import MText from '../MText';
import useRecycledState from '~/common/hooks/useRecycledState';
import SmartImage from '../SmartImage';

const DoubleTapTouchable = DoubleTap(TouchableOpacity);

type PropsType = {
  entity: ActivityModel;
  style?: ImageProps['style'];
  autoHeight?: boolean;
  ignoreDataSaver?: boolean;
  mode?: ImageProps['contentFit'];
  onImageDoublePress?: () => void;
  onImagePress?: () => void;
  onImageLongPress?: () => void;
};

const { width, height } = Dimensions.get('window');

export default function MediaViewImage({
  entity,
  style,
  autoHeight,
  ignoreDataSaver,
  mode = 'contain',
  onImageDoublePress,
  onImagePress,
  onImageLongPress,
}: PropsType) {
  const [imageLoadFailed, setImageLoadFailed] = useRecycledState(false, entity);
  const [size, setSize] = useRecycledState({ height: 0, width: 0 }, entity);
  const source = React.useMemo(
    () => entity.getThumbSource('xlarge'),
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
    let text = <MText style={errorTextStyle}>{i18n.t('errorMedia')}</MText>;

    if (entity.perma_url) {
      text = (
        <MText style={errorTextStyle}>
          The media from{' '}
          <MText style={ThemedStyles.style.fontMedium}>
            {domain(entity.perma_url)}
          </MText>{' '}
          could not be loaded.
        </MText>
      );
    }

    return <View style={errorContainerStyle}>{text}</View>;
  }

  return (
    <DoubleTapTouchable
      onDoubleTap={onImageDoublePress}
      onPress={onImagePress}
      onLongPress={onImageLongPress}
      style={imageStyle}
      activeOpacity={1}
      testID="Posted Image">
      <SmartImage
        contentFit={mode}
        transition={100}
        style={imageStyle}
        source={source}
        onLoad={onLoadImage}
        onError={imageError}
        ignoreDataSaver={ignoreDataSaver || Boolean(entity?.paywall)}
        placeholder={
          entity?.custom_data?.[0]?.blurhash || entity?.blurhash || thumbnail
        }
        locked={entity?.isLocked()}
        recyclingKey={entity.urn}
      />
    </DoubleTapTouchable>
  );
}

const errorTextStyle = ThemedStyles.combine('fontS', 'colorTertiaryText');
const errorContainerStyle = ThemedStyles.combine(
  'padding4x',
  'bgSecondaryBackground',
  'centered',
  { height: 200 },
);
