import React, {
    Component
} from 'react';

import {
    StyleSheet,
    ActivityIndicator,
    Text,
    View,
} from 'react-native';



import Video from "react-native-video";
import Icon from 'react-native-vector-icons/Ionicons';
import Camera from 'react-native-camera';
import Poster from '../newsfeed/Poster';

/**
 * Capture screen
 */
export default class CaptureVideo extends Component {

  state = {
    isRecordingEnded: false,
    isPosting: false,
    isRecording: false,
    videoPath: '',
  }

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="md-radio-button-on" size={24} color={tintColor} />
    )
  }

  /**
   * Render
   */
  render() {
    return (
      <View style={styles.screenWrapper}>
        { this.state.isRecordingEnded ?
          <View style={styles.selectedImage}>
            <View style={styles.submitButton}>
              { this.props.isPosting || this.state.isPosting ?
                <ActivityIndicator size="small" color="#00ff00" /> :
                <Icon onPress={() => this.upload()} color="white" name="md-send" size={28}></Icon>
              }
            </View>
            <Video
              source={{ uri : this.state.path }}
              style={styles.preview}
            />
          </View> :
          <Camera
            ref={(cam) => {
              this.camera = cam;
            }}
            style={styles.preview}
            aspect={Camera.constants.Aspect.fill}>
            { !this.state.isRecording ?
              <Icon style={styles.capture} onPress={() => this.takeVid()} name="md-videocam" size={24}></Icon>:
              <Icon style={styles.capture} onPress={() => this.stopVid()} name="ios-square" size={24}></Icon>
            }
          </Camera>
        }
      </View>
    );
  }

  takeVid = () => {
    if (this.camera) {
      this.camera.capture({mode: Camera.constants.CaptureMode.video, captureQuality: 'low'})
          .then((data) => {
            this.setState({
              isPosting: true,
              videoPath : data.path,
              isRecordingEnded: true,
              isRecording: false,
            });
            this.props.submitToPoster(this.state.videoPath, 'video/mp4');
          }).catch(err => console.error(err));
      this.setState({
        isRecording: true
      });
    }
  }

  stopVid = () => {
    if (this.camera) {
      this.camera.stopCapture();
    }
  }
}

const styles = StyleSheet.create({
	screenWrapper: {
    flex: 1,
    flexDirection: 'column'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#ccc'
  },
  selectedImage: {
    flex: 1
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  submitButton: {
    position: 'absolute',
    top:15,
    right:30,
    zIndex:100
  }
});