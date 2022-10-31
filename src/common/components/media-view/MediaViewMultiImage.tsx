import React, { useMemo } from 'react';
import {
  ImageURISource,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { ImageStyle, ResizeMode } from 'react-native-fast-image';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import ThemedStyles from '../../../styles/ThemedStyles';
import api from '../../services/api.service';
import { Column, Row, Spacer } from '../../ui';
import SmartImage, { SmartImageProps } from '../SmartImage';

const FIXED_HEIGHT = 220;
const BORDER_RADIUS = 3;

type PropsType = {
  fullWidth?: boolean;
  entity: ActivityModel;
  style?: StyleProp<ImageStyle>;
  ignoreDataSaver?: boolean;
  mode?: ResizeMode;
  /**
   * @param {number} index - the index of the image
   */
  onImagePress: (index: number) => void;
  onImageLongPress: (imageSource: ImageURISource) => void;
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
  let images: SmartImageProps[] = useMemo(
    () =>
      entity.custom_data.map((image, index) => {
        const source = {
          uri: image.src,
          headers: api.buildHeaders(),
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
    <Row flex top="M" horizontal="M" containerStyle={styles.container}>
      <Column flex right="XS">
        <ImageItem {...images[0]} />
        {images.length === 4 && (
          <>
            <Spacer top="S" />
            <ImageItem {...images[2]} />
          </>
        )}
      </Column>
      <Column flex left="XS">
        <ImageItem {...images[1]} />
        {images.length > 2 && (
          <>
            <Spacer top="S" />
            <ImageItem {...images[images.length - 1]} />
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
}: SmartImageProps & TouchableOpacityProps) => (
  <TouchableOpacity
    onPress={onPress}
    onLongPress={onLongPress}
    style={styles.image}
    activeOpacity={1}
    testID={'image-' + smartImageProps.source.uri}>
    <SmartImage
      {...smartImageProps}
      resizeMode={'cover'}
      style={styles.image}
    />
  </TouchableOpacity>
);

const styles = ThemedStyles.create({
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
