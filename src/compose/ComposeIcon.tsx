import * as React from 'react';
import { Image, ImageProps } from 'react-native';
// import FastImage, { FastImageProps } from 'react-native-fast-image';

const COMPOSE = require('../assets/compose.png');

function ComposerIcon(props: Partial<ImageProps>) {
  const { source, ...other } = props;
  return <Image source={source || COMPOSE} {...other} />;
}

export default ComposerIcon;
