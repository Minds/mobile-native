import React, {
    Component,
} from 'react';
import {
  TabNavigator
} from 'react-navigation';

import {
  StyleSheet,
  Image,
  CameraRoll,
  View,
  Text,
  FlatList,
  TouchableHighlight,
} from 'react-native';

import { Button } from 'react-native-elements';

import Icon from 'react-native-vector-icons/Ionicons';

import Topbar from '../topbar/Topbar';
import CaptureScreen from './CaptureScreen';
import GalleryScreen from './GalleryScreen';
import Poster from '../newsfeed/Poster';

import { uploadAttachment } from '../newsfeed/NewsfeedService';

export default class CaptureTab extends Component {  
  state = {
    screen: 'gallery',
    imageUri: '',
    attachmentGuid: '',
    attachmentDone: false,
  }

  static navigationOptions = {
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Icon name="md-radio-button-on" size={24} color={tintColor} />
    )
  }

  render() {
    return (
      <View style={{flex:1}}>
        {this.loadScreen()}
        { this.state.screen != 'poster' ?
          <View style={{height:35}}>
            <View style={{flex:1, flexDirection:'row'}}>
              <TouchableHighlight underlayColor='gray' onPress={() => this.setState({screen:'gallery'})} style={this.state.screen === 'gallery'? styles.selectedButton: styles.buttons}>
                <Text>Gallery</Text>
              </TouchableHighlight>
              <TouchableHighlight underlayColor='gray' onPress={() => this.setState({screen:'captureImage'})} style={this.state.screen === 'captureImage'? styles.selectedButton: styles.buttons}>
                <Text>Photo</Text>
              </TouchableHighlight>
              <TouchableHighlight underlayColor='gray' onPress={() => this.setState({screen:'captureVideo'})}  style={this.state.screen === 'captureVideo'? styles.selectedButton: styles.buttons}>
                <Text>Video</Text>
              </TouchableHighlight>
            </View>
          </View> : 
          <View></View>
        }
      </View>
    );
  }

  submitToPoster = (imageUri) => {
    uploadAttachment('api/v1/archive/image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: imageUri.substring(imageUri.lastIndexOf('/') + 1)
    }).then((res) => {
      this.setState({
        imageUri,
        screen: 'poster',
        attachmentGuid: res.guid,
        attachmentDone: true
      });
    });
    
  }

  tabButtonStyle(value) {
    if(value === this.state.screen) {
      return { 
        flex: 1,
        borderRadius:0
      }
    } else {
      return { 
        flex: 1,
        borderRadius:0
      }
    }
  }

  loadScreen() {
    switch (this.state.screen) {
      case 'gallery':
        return <GalleryScreen submitToPoster={this.submitToPoster} style={styles.wrapper}/>;
        break;
      case 'captureImage':
        return <CaptureScreen submitToPoster={this.submitToPoster} style={styles.wrapper}/>;
        break;
      case 'captureVideo':
        return <CaptureScreen submitToPoster={this.submitToPoster} style={styles.wrapper}/>;
        break;
      case 'poster':
        return <Poster attachmentGuid={this.state.attachmentGuid} />;
        break;
    }
    
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  buttons: {
    flex:1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  selectedButton: {
    flex:1, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderBottomWidth:3,
    borderColor: 'yellow'
  }
});