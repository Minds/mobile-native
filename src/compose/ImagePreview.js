import React from 'react';
import { observer } from 'mobx-react';
import FastImage from 'react-native-fast-image';
import { Platform, Dimensions } from 'react-native';
import ThemedStyles from '../styles/ThemedStyles';

const { width } = Dimensions.get('window');

/**
 * Image preview with max and min aspect ratio support
 * @param {Object} props
 */
export default observer(function (props) {
  // calculate the aspect ratio
  let aspectRatio = Platform.select({
    ios: props.image.width / props.image.height,
    android:
      props.image.pictureOrientation > 2
        ? props.image.width / props.image.height
        : props.image.height / props.image.width,
  });

  if (props.maxRatio && props.maxRatio < aspectRatio) {
    aspectRatio = props.maxRatio;
  }

  if (props.minRatio && props.minRatio > aspectRatio) {
    aspectRatio = props.minRatio;
  }

  let imageHeight = Math.round(width / aspectRatio);

  const imageStyle = {
    height: imageHeight,
    width: '100%',
  };

  return (
    <FastImage
      key={props.image.key || 'imagePreview'}
      source={{ uri: props.image.uri + `?${props.image.key}` }} // // we need to change the uri in order to force the reload of the image
      style={[imageStyle, props.style, ThemedStyles.style.backgroundTertiary]}
      resizeMode={FastImage.resizeMode.contain}
    />
  );
});
