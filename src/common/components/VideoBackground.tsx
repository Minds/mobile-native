import React from 'react';

import { StyleSheet } from 'react-native';
import { Video } from 'expo-av';

type PropsType = {
  source: any;
};

export default function VideoBackground(props: PropsType) {
  return (
    <Video
      source={props.source}
      resizeMode={Video.RESIZE_MODE_COVER}
      isLooping
      isMuted={true}
      shouldPlay={true}
      style={StyleSheet.absoluteFill}
    />
  );
}
