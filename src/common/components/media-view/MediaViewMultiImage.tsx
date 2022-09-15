import { useDimensions } from '@react-native-community/hooks';
import React, { useMemo } from 'react';
import { ImageURISource, StyleProp, TouchableOpacity } from 'react-native';
import { ImageStyle, ResizeMode } from 'react-native-fast-image';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import api from '../../services/api.service';
import { Column, Row } from '../../ui';
import SmartImage from '../SmartImage';

const PADDING = 8;
const HEIGHT = 110;
const BORDER_RADIUS = 3;

type PropsType = {
  fullWidth?: boolean;
  entity: ActivityModel;
  style?: StyleProp<ImageStyle>;
  ignoreDataSaver?: boolean;
  mode?: ResizeMode;
  onImagePress?: () => void;
  onImageLongPress?: (imageSource: ImageURISource) => void;
};

/**
 * Used for displaying multi images
 */
export default function MediaViewMultiImage({
  entity,
  ignoreDataSaver,
  onImagePress,
  onImageLongPress,
}: PropsType) {
  const { width } = useDimensions().window;
  const imagesLength = entity.custom_data.length;

  // TODO: handle loading failed/error state
  const images = useMemo(
    () =>
      entity.custom_data.map((image, index) => {
        let height = HEIGHT;
        let leftMargin = 0;

        switch (imagesLength) {
          case 2:
            height = HEIGHT * 2;
            if (index === 1) {
              leftMargin = PADDING;
            }
            break;
          case 3:
            if (index === 0) {
              height = HEIGHT * 2;
            }
            if (index === 1 || index === 2) {
              leftMargin = PADDING;
            }
            break;
          case 4:
            if (index === 1 || index === 3) {
              leftMargin = PADDING;
            }
            break;
        }

        return {
          source: {
            uri: image.src,
            headers: api.buildHeaders(),
          },
          commonStyle: {
            width: width / 2 - 2 * PADDING,
            height:
              imagesLength === 3 && index === 0 ? height + PADDING : height,
            borderRadius: BORDER_RADIUS,
            shadowOffset: { width: 0, height: 1 },
            shadowColor: 'rgba(0, 0, 0, 0.4)',
            shadowOpacity: 0.4,
            shadowRadius: 0,
            elevation: 2,
          },
          imageStyle: {},
          containerStyle: {
            marginLeft: leftMargin,
            marginBottom: index === 1 ? PADDING : undefined,
          },
          blurhash: image.blurhash,
        };
      }),
    [entity, imagesLength, width],
  );

  const renderImage = (image, index?) => (
    <TouchableOpacity
      key={index || image.source.uri}
      onPress={onImagePress}
      onLongPress={
        onImageLongPress ? () => onImageLongPress(image.source) : undefined
      }
      style={[image.commonStyle, image.containerStyle]}
      activeOpacity={1}
      testID={'image-' + image.source.uri}>
      <SmartImage
        // TODO: check data saver is working fine
        resizeMode={'cover'}
        style={[image.commonStyle, image.imageStyle]}
        source={image.source}
        blurhash={image.blurhash}
        blurred={entity?.shouldBeBlured()}
        locked={entity?.isLocked()}
        ignoreDataSaver={ignoreDataSaver}
      />
    </TouchableOpacity>
  );

  if (imagesLength === 3) {
    return (
      <Row top="M">
        <Column left="M">{renderImage(images[0])}</Column>
        <Column>
          {renderImage(images[1])}
          {renderImage(images[2])}
        </Column>
      </Row>
    );
  }

  return (
    <Row flexWrap left="M" top="M">
      {images.map(renderImage)}
    </Row>
  );
}
