import { ImageSource } from 'expo-image';
import React, { useMemo } from 'react';
import {
  ImageURISource,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import type ActivityModel from '~/newsfeed/ActivityModel';

import { Column, Row, Spacer } from '../../ui';
import SmartImage, { SmartImageProps } from '../SmartImage';
import { IS_TENANT } from '~/config/Config';
import sp from '~/services/serviceProvider';

const FIXED_HEIGHT = 220;
const BORDER_RADIUS = 3;

type PropsType = {
  fullWidth?: boolean;
  entity: ActivityModel;
  style?: any;
  ignoreDataSaver?: boolean;
  mode?: ImageProps['contentFit'];
  /**
   * @param {number} index - the index of the image
   */
  onImagePress: (index: number) => void;
  onImageLongPress: (imageSource: ImageURISource) => void;
};

type ImageProps = SmartImageProps & { source: ImageSource };

/**
 * Used for displaying multi images
 */
export default function MediaViewMultiImage({
  entity,
  ignoreDataSaver,
  onImagePress,
  onImageLongPress,
}: PropsType) {
  let images: ImageProps[] = useMemo(
    () =>
      entity.custom_data.map((image, index) => {
        if (IS_TENANT) {
          const source = entity.site_membership
            ? image.blurhash
            : {
                uri: image.src,
                headers: sp.api.buildHeaders(),
              };
          return {
            source,
            onPress: () => onImagePress(index),
            onLongPress: () => onImageLongPress(source),
            ignoreDataSaver,
            blurhash: entity.site_membership ? undefined : image.blurhash,
          };
        }
        const source = {
          uri: image.src,
          headers: sp.api.buildHeaders(),
        };
        return {
          source,
          locked: entity?.isLocked(),
          blurred: entity?.shouldBeBlured(),
          onPress: () => onImagePress(index),
          onLongPress: () => onImageLongPress(source),
          ignoreDataSaver,
          blurhash: image.blurhash,
        };
      }),
    [entity, ignoreDataSaver, onImageLongPress, onImagePress],
  );

  return (
    <Row top="M" horizontal="M" containerStyle={styles.container}>
      <Column flex right="XS">
        <ImageItem {...(images[0] as any)} />
        {images.length === 4 && (
          <>
            <Spacer top="S" />
            <ImageItem {...(images[2] as any)} />
          </>
        )}
      </Column>
      <Column flex left="XS">
        <ImageItem {...(images[1] as any)} />
        {images.length > 2 && (
          <>
            <Spacer top="S" />
            <ImageItem {...(images[images.length - 1] as any)} />
          </>
        )}
      </Column>
    </Row>
  );
}

const ImageItem = ({
  onPress,
  onLongPress,
  ...smartImageProps
}: TouchableOpacityProps & ImageProps) => (
  <TouchableOpacity
    onPress={onPress}
    onLongPress={onLongPress}
    style={styles.image}
    activeOpacity={1}
    testID={'image-' + smartImageProps.source?.uri}>
    <SmartImage {...smartImageProps} contentFit="cover" style={styles.image} />
  </TouchableOpacity>
);

const styles = sp.styles.create({
  container: {
    height: FIXED_HEIGHT,
  },
  image: {
    flex: 1,
    height: '100%',
    borderRadius: BORDER_RADIUS,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 2,
  },
});
