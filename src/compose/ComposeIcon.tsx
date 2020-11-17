import * as React from 'react';
import { Image, ImageProps } from 'react-native';

function ComposerIcon(props: Partial<ImageProps>) {
  const { source, ...other } = props;
  return (
    <Image source={source || require('../assets/compose.png')} {...other} />
  );
}

export default ComposerIcon;
