import React from 'react';

import { StyleSheet } from 'react-native';
import { ResizeMode, Video } from 'expo-av';

type PropsType = {
  source: any;
};

export default function VideoBackground(props: PropsType) {
  return (
    <Video
      source={props.source}
      resizeMode={ResizeMode.COVER}
      isLooping
      isMuted={true}
      shouldPlay={true}
      style={StyleSheet.absoluteFill}
    />
  );
}
