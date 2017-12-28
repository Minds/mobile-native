import React, {Component, PropTypes} from "react";
import {Image, PanResponder, Platform, StyleSheet,Dimensions, Text,Slider, TouchableOpacity, View} from "react-native";
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
    this.state = {paused: false, volume:1, volumeVisible:false, fullScreen:false};
  }

  //Handle vertical sliding
  componentWillMount () {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true
    })
}

  onVideoEnd() {
    this.player.seek(0);
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
    this.player.seek(newTime);
    this.setState({currentTime: newTime})
  }

  onForward(currentTime, duration) {
    if (currentTime + FORWARD_DURATION > duration) {
      this.onVideoEnd();
    } else {
      let newTime = currentTime + FORWARD_DURATION;
      this.player.seek(newTime);
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
    this.player.seek(newTime);
  }

  onVolumeChanged(value) {
    this.setState({volume: value});
  }

  toggleVolume() {
    this.setState({volumeVisible: !this.state.volumeVisible});
  }

  closeVolume() {
    this.setState({volumeVisible: false});
  }

  toggleFullscreen() {
    this.setState({fullScreen: this.state.fullScreen});
  }

  getFullscreen() {
    let {height, width} = Dimensions.get('window');
    if(width > height){

    }
    return {width: width, height: height, zIndex:1000}
  }

  render() {
    let {video, volume} = this.props;
    let {currentTime, duration, paused} = this.state;
    const completedPercentage = this.getCurrentTimePercentage(currentTime, duration) * 100;

    return  <View style={[CommonStyle.flexContainer , styles.fullScreen]} key={this.state.key}>
              <TouchableOpacity style={styles.videoView}
                onPress={this.playOrPauseVideo.bind(this, paused)}>
                <Video        
                  ref={(ref) => {
                    this.player = ref
                  }}  
                  onEnd={this.onVideoEnd.bind(this)}
                  onLoad={this.onVideoLoad.bind(this)}
                  onProgress={this.onProgress.bind(this)}
                  source={{uri:video.uri}}
                  paused={paused}
                  volume={parseFloat(this.state.volume)}
                  resizeMode="contain"
                  style={[CommonStyle.positionAbsolute, this.state.fullScreen ? this.getFullscreen():{}]}/>
                  {paused ?
                    <Icon style={styles.videoIcon} name="md-play" size={50} color={colors.light} /> :null
                  }
                  { this.state.volumeVisible ?
                    <Slider
                      {...this._panResponder.panHandlers}
                      minimumValue={0}
                      maximumValue={1}
                      step={0.05}
                      style={styles.volumeSlider}
                      value={parseFloat(this.state.volume)}
                      thumbTintColor='white'
                      maximumTrackTintColor='white'
                      minimumTrackTintColor='white'
                      onSlidingComplete={this.closeVolume.bind(this)}
                      onValueChange={(value) => this.onVolumeChanged(value)}
                    /> :null
                  }
              </TouchableOpacity>
              <View style={styles.controlWrapper}>
                <View style={[CommonStyle.centered, CommonStyle.flexContainer]}>
                  <Icon onPress={this.playOrPauseVideo.bind(this, paused)} name="md-play" size={20} color={colors.light} />
                </View>
                <View style={styles.progressWrapper}>
                  <View style={[styles.barWrapper]}>
                    <View style={[styles.progressBar]}>
                      <ProgressBar duration={duration}
                        currentTime={currentTime}
                        percent={completedPercentage}
                        onNewPercent={this.onProgressChanged.bind(this)}/>
                    </View>
                  </View>
                </View>
                <View style={[CommonStyle.centered, CommonStyle.flexContainer]}>
                  <Icon onPress={this.toggleVolume.bind(this)} name="md-volume-mute" size={20} color={colors.light} />
                </View>
                <View style={[CommonStyle.centered, CommonStyle.flexContainer]}>
                  <Icon onPress={this.toggleFullscreen.bind(this)} name="md-expand" size={20} color={colors.light} />
                </View>
              </View>
            </View>;
  }
}

let styles = StyleSheet.create({
  volumeSlider: {
    position: 'absolute',
    width:100,
    bottom:60,
    right:0,
    borderRadius: 4,
    transform: [
      { rotateZ : '-90deg' },
    ],
    zIndex: 1600,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  playerButtonWrapper: {
    flex:1,
    alignSelf:'center'
  },
  controlWrapper: {
    bottom:0, 
    position:'absolute', 
    width:'100%',
    zIndex:200,
    flexDirection: 'row'
  },
  progressWrapper: {
    flex:9
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
