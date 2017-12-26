import React, { 
    Component 
} from 'react';
import {
    Text,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    View,
    FlatList,
    ListView
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import Camera from 'react-native-camera';

import Poster from '../newsfeed/Poster';

export default class CaptureScreen extends Component<{}> {

  state = {
    activities: [],
    isImageTaken: false,
    isPosting: false,
    imageUri: ''
  }

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="md-radio-button-on" size={24} color={tintColor} />
    )
  }

  render() {
    return (
      <View style={styles.screenWrapper}>
        { this.state.isImageTaken ?
          <View style={styles.selectedImage}>
            <View style={styles.submitButton}>
              { this.props.isPosting || this.state.isPosting ?
                <ActivityIndicator size="small" color="#00ff00" /> : 
                <Icon onPress={() => this.upload()} color="white" name="md-send" size={28}></Icon>
              }
            </View>
            <Image
              source={{ uri : this.state.imageUri }}
              style={styles.preview}
            /> 
          </View> : 
          <Camera
            ref={(cam) => {
              this.camera = cam;
            }}
            style={styles.preview}
            aspect={Camera.constants.Aspect.fill}>
            <Icon style={styles.capture} onPress={() => this.takePicture()} name="md-camera" size={24}></Icon>
          </Camera>
        }
      </View>
    );
  }

  upload() {
    this.setState({
      isPosting: true,
    });
    this.props.submitToPoster(this.state.imageUri);
  }

  takePicture() {
    const options = {};
    this.setState({
      isPosting: true,
    });
    this.camera.capture({metadata: options})
      .then((data) => {
        this.setState({
          isPosting: false,
          imageUri : data.mediaUri,
          isImageTaken: true
        });
      })
      .catch(err => console.error(err));
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
    alignItems: 'center'
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