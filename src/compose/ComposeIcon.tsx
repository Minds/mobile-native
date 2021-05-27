import * as React from 'react';
import FastImage, { FastImageProps } from 'react-native-fast-image';

const COMPOSE = require('../assets/compose.png');

function ComposerIcon(props: Partial<FastImageProps>) {
  const { source, ...other } = props;
  return <FastImage source={source || COMPOSE} {...other} />;
}

export default ComposerIcon;
