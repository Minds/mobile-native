import { Image, ImageProps } from 'react-native';
import * as React from 'react';

function ComposeIcon(props: Partial<ImageProps>) {
  return <Image source={require('../assets/compose.png')} {...props} />;
}

export default ComposeIcon;
