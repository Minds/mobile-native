//@ts-nocheck
import React, { Component } from 'react';

import {
  View,
  TouchableHighlight,
  Text,
  StyleSheet
} from 'react-native';
import Video from 'react-native-video';

export default class VideoBackground extends Component {
    
  render() {
  
    return (
      <View style={styles.container}>
        <Video
          source={require('../../assets/videos/what-1.mp4')}
          ref={(ref) => {
            this.player = ref;
          }}
          resizeMode="cover"
          repeat={true}
          muted={true}
          paused={false}
          style={styles.backgroundVideo}
        />
        <View style={styles.overlay}></View>
      </View>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
});