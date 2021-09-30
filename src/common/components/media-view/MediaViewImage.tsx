import React from 'react';
import { View, TouchableOpacity, StyleProp } from 'react-native';
import { ImageStyle, ResizeMode, Source } from 'react-native-fast-image';
import { SharedElement } from 'react-navigation-shared-element';
import { DATA_SAVER_THUMB_RES } from '../../../config/Config';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import ThemedStyles, { useStyle } from '../../../styles/ThemedStyles';
import domain from '../../helpers/domain';
import mediaProxyUrl from '../../helpers/media-proxy-url';
import i18n from '../../services/i18n.service';
import DoubleTap from '../DoubleTap';
import ExplicitImage from '../explicit/ExplicitImage';
import MText from '../MText';

const DoubleTapTouchable = DoubleTap(TouchableOpacity);

type PropsType = {
  entity: ActivityModel;
  style?: StyleProp<ImageStyle>;
  autoHeight?: boolean;
  ignoreDataSaver?: boolean;
  mode?: ResizeMode;
  onImageDoublePress?: () => void;
  onImagePress?: () => void;
  onImageLongPress?: () => void;
};

export default function MediaViewImage({
  entity,
  style,
  autoHeight,
  ignoreDataSaver,
  mode = 'cover',
  onImageDoublePress,
  onImagePress,
  onImageLongPress,
}: PropsType) {
  const [imageLoadFailed, setImageLoadFailed] = React.useState(false);
  const [size, setSize] = React.useState({ height: 0, width: 0 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const source = React.useMemo(
    () => entity.getThumbSource('xlarge'),
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
        : ({
            ...source,
            uri: mediaProxyUrl(
              entity.getThumbSource('medium').uri, // convert from medium size to save some backend resources
              DATA_SAVER_THUMB_RES,
            ),
          } as Source),
    [entity, source],
  );

  let aspectRatio = 1.5;

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

  const containerStyle = React.useMemo(
    () => [ThemedStyles.style.fullWidth, { aspectRatio }],
    [aspectRatio],
  );

  const imageError = React.useCallback(() => {
    setImageLoadFailed(true);
  }, []);

  /**
   * On image load handler
   */
  const onLoadImage = React.useCallback(
    e => {
      if (autoHeight) {
        setSize({
          height: e.nativeEvent.height,
          width: e.nativeEvent.width,
        });
      }
    },
    [autoHeight],
  );

  const imageStyle = useStyle('positionAbsolute', style as Object);

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
    <SharedElement id={`${entity.urn}.image`}>
      <DoubleTapTouchable
        onDoubleTap={onImageDoublePress}
        onPress={onImagePress}
        onLongPress={onImageLongPress}
        style={containerStyle}
        activeOpacity={1}
        testID="Posted Image"
      >
        <ExplicitImage
          resizeMode={mode}
          style={imageStyle}
          source={source}
          thumbnail={thumbnail}
          entity={entity}
          onLoad={onLoadImage}
          onError={imageError}
          ignoreDataSaver={ignoreDataSaver}
        />
      </DoubleTapTouchable>
    </SharedElement>
  );
}

const errorTextStyle = ThemedStyles.combine('fontS', 'colorTertiaryText');
const errorContainerStyle = ThemedStyles.combine(
  'padding4x',
  'bgSecondaryBackground',
  'centered',
  { height: 200 },
);
