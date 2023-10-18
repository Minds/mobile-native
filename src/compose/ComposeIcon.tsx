import { Image, ImageProps } from 'react-native';
import * as React from 'react';
import assets from '@assets';

export default function ComposeIcon(props: Partial<ImageProps>) {
  return <Image source={assets.COMPOSE} {...props} />;
}
