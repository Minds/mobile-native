import { Image, ImageProps } from 'expo-image';
import * as React from 'react';

function ComposeIcon(props: Partial<ImageProps>) {
  const { source, ...other } = props;
  return (
    <Image source={source || require('../assets/compose.png')} {...other} />
  );
}

export default ComposeIcon;
