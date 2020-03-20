import React from 'react';
import FastImage from 'react-native-fast-image';
import { Platform } from 'react-native';

/**
 * Image preview with max and min aspect ratio support
 * @param {Object} props
 */
export default function(props) {
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

  const imageStyle = {
    aspectRatio,
    width: '100%',
  };

  return (
    <FastImage
      source={{ uri: props.image.uri }}
      style={imageStyle}
      resizeMode={FastImage.resizeMode.cover}
    />
  );
}
