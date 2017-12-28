import React, {Component, PropTypes} from "react";
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import ProgressBar from "./ProgressBar";
import Video from "react-native-video";
import {
  MINDS_URI
} from '../config/Config';
let FORWARD_DURATION = 7;

import Icon from 'react-native-vector-icons/Ionicons';
import { CommonStyle } from '../styles/Common';
import colors from '../styles/Colors';

export default class MindsVideo extends Component {

  constructor(props, context, ...args) {
      super(props, context, ...args);
    this.state = {paused: false};
  }

  onVideoEnd() {
    this.videoPlayer.seek(0);
    this.setState({key: new Date(), currentTime: 0, paused: true});
  }

  onVideoLoad(e) {
    this.setState({currentTime: e.currentTime, duration: e.duration});
  }

  onProgress(e) {
    this.setState({currentTime: e.currentTime});
  }

  playOrPauseVideo(paused) {
    this.setState({paused: !paused});
  }

  onBackward(currentTime) {
    let newTime = Math.max(currentTime - FORWARD_DURATION, 0);
    this.videoPlayer.seek(newTime);
    this.setState({currentTime: newTime})
  }

  onForward(currentTime, duration) {
    if (currentTime + FORWARD_DURATION > duration) {
      this.onVideoEnd();
    } else {
      let newTime = currentTime + FORWARD_DURATION;
      this.videoPlayer.seek(newTime);
      this.setState({currentTime: newTime});
    }
  }

  getCurrentTimePercentage(currentTime, duration) {
    if (currentTime > 0) {
      return parseFloat(currentTime) / parseFloat(duration);
    } else {
      return 0;
    }
  }

  onProgressChanged(newPercent, paused) {
    let {duration} = this.state;
    let newTime = newPercent * duration / 100;
    this.setState({currentTime: newTime, paused: paused});
    this.videoPlayer.seek(newTime);
  }

  render() {
    let {video, volume} = this.props;
    let {currentTime, duration, paused} = this.state;
    const completedPercentage = this.getCurrentTimePercentage(currentTime, duration) * 100;

    return  <View style={[CommonStyle.flexContainer , styles.fullScreen]} key={this.state.key}>
              <TouchableOpacity style={styles.videoView}
                onPress={this.playOrPauseVideo.bind(this, paused)}>
                <Video ref={videoPlayer => this.videoPlayer = videoPlayer}
                  onEnd={this.onVideoEnd.bind(this)}
                  onLoad={this.onVideoLoad.bind(this)}
                  onProgress={this.onProgress.bind(this)}
                  source={{uri:video.uri}}
                  paused={paused}
                  volume={Math.max(Math.min(1, volume), 0)}
                  resizeMode="contain"
                  style={CommonStyle.positionAbsolute}/>
                  {paused ?
                    <Icon style={styles.videoIcon} name="md-play" size={50} color={colors.light} /> :null
                  }
              </TouchableOpacity>
              <View style={styles.controlWrapper}>
                <View style={[styles.barWrapper]}>
                  <View style={[styles.progressBar]}>
                    <ProgressBar duration={duration}
                      currentTime={currentTime}
                      percent={completedPercentage}
                      onNewPercent={this.onProgressChanged.bind(this)}/>
                  </View>
                </View>
              </View>
            </View>;
  }
}

let styles = StyleSheet.create({
  controlWrapper: {
    flex:1, 
    bottom:0, 
    position:'absolute', 
    width:'100%'
  },
  fullScreen: {backgroundColor: "black"},
  barWrapper: {
    zIndex:200,
    position: 'relative',
    bottom:0,
    height: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  controllerButton: {height: 20, width: 20},
  videoView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  progressBar: {
    alignSelf: "stretch",
    margin: 20
  },
  videoIcon: {
    position: "relative",
    alignSelf: "center",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0
  }
});
