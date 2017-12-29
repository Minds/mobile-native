import React, {Component, PropTypes} from "react";
import {Image, PanResponder,Modal, Platform, StyleSheet,Dimensions, ActivityIndicator, Text,Slider, TouchableOpacity, View} from "react-native";
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
    this.state = {paused: false, loaded: true, volume:0, volumeVisible:false, fullScreen:false};
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
    let current = 0;
    if (this.state.changedModeTime > 0) {
      current = this.state.changedModeTime;
    } else {
      current = e.currentTime;
    }

    this.setState({loaded: false, currentTime: current, duration: e.duration});
    this.player.seek(current)
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
    setTimeout(() => {this.setState({volumeVisible: false})}, 500);
  }

  toggleFullscreen() {
    this.setState({fullScreen: !this.state.fullScreen, changedModeTime: this.state.currentTime});
  }

  getPlayIcon(size, hideOnPause = false, showLoading = false) {
    if (this.state.paused) {
      return <Icon onPress={this.playOrPauseVideo.bind(this, this.state.paused)} style={styles.videoIcon} name="md-play" size={size} color={colors.light} />;
    } else if(!hideOnPause){
      return <Icon onPress={this.playOrPauseVideo.bind(this, this.state.paused)} style={styles.videoIcon} name="md-pause" size={size} color={colors.light} />;
    } else if(showLoading && this.state.loaded){
      return <ActivityIndicator size="small" color="#00ff00" />;
    }
  }

  getVolumeIcon() {
    if (this.state.volume < 0.05) {
      return <Icon onPress={this.toggleVolume.bind(this)} name="md-volume-off" size={20} color={colors.light} />;
    } else if(this.state.volume >= 0.05 && this.state.volume < 0.95){
      return <Icon onPress={this.toggleVolume.bind(this)} name="md-volume-down" size={20} color={colors.light} />;
    } else if(this.state.volume >= 0.95){
      return <Icon onPress={this.toggleVolume.bind(this)} name="md-volume-up" size={20} color={colors.light} />;
    }
  }

  hideModal = () => {
    this.setState({ fullScreen: false });
  }

  onModalHide = () => {
  }

  getFullscreenTopControls() {
    if(this.state.fullScreen) {
      return <View style={styles.controlTopWrapper}>
              <View style={[CommonStyle.centered, CommonStyle.flexContainer]}>
                <Text style={styles.controlTopTexts}>{this.props.entity.message}</Text>
              </View>
              <View style={[CommonStyle.centered, CommonStyle.flexContainer]}>
                <Icon onPress={this.hideModal.bind(this)} name="md-close" size={20} color={colors.light} />
              </View>
            </View>;
    } else {
      return null;
    }
  }

  showVideo(videoElement, isFullscreen){
    if(this.state.fullScreen && isFullscreen) {
      return videoElement;
    } else if(!this.state.fullScreen && !isFullscreen) {
      return videoElement;
    }
  }

  render() {
    let {video, volume} = this.props;
    let {currentTime, duration, paused} = this.state;
    const completedPercentage = this.getCurrentTimePercentage(currentTime, duration) * 100;
    let videoElement = <View style={[CommonStyle.flexContainer , styles.fullScreen]} key={this.state.key}>
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
                            resizeMode={ "contain"}
                            style={[CommonStyle.positionAbsolute]}/>
                            {this.getPlayIcon(50, true, true)}
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
                            {this.getPlayIcon(20)}
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
                            {this.getVolumeIcon()}
                          </View>
                          <View style={[CommonStyle.centered, CommonStyle.flexContainer]}>
                            <Icon onPress={this.toggleFullscreen.bind(this)} name="md-expand" size={20} color={colors.light} />
                          </View>
                        </View>
                      </View>;
    return  <View style={[CommonStyle.flexContainer]}>{this.showVideo(videoElement, false)}
              <Modal
                visible={this.state.fullScreen}
                animationType = {"slide"}
                transparent = {false}
                onBackdropPress={this.hideModal}
                onRequestClose={this.hideModal}
                onModalHide={this.onModalHide}
              >
                {this.getFullscreenTopControls()}
                {this.showVideo(videoElement, true)}
              </Modal>
            </View>;
  }
}

let styles = StyleSheet.create({
  volumeSlider: {
    position: 'absolute',
    width:100,
    bottom:25,
    right:0,
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
  controlTopWrapper: {
    top:0, 
    position:'absolute', 
    width:'100%',
    zIndex:200,
    flexDirection: 'row'
  },
  controlTopTexts: {
    color: 'white'
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
