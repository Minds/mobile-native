import React, {
    Component,
} from 'react';
import {
  TabNavigator
} from 'react-navigation';

import {
  StyleSheet,
  CameraRoll,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';

import {
  inject
} from 'mobx-react/native'

import { Button } from 'react-native-elements';

import Icon from 'react-native-vector-icons/Ionicons';

import Topbar from '../topbar/Topbar';
import CaptureScreen from './CaptureScreen';
import CaptureVideo from './CaptureVideo';
import GalleryScreen from './GalleryScreen';
import Poster from '../newsfeed/Poster';

import { uploadAttachment } from '../newsfeed/NewsfeedService';
import { CommonStyle } from '../styles/Common';

/**
 * Capture tab
 */
@inject('tabs')
export default class CaptureTab extends Component {
  state = {
    active: false,
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

  /**
   * On component will mount
   */
  componentWillMount() {
    // Set to active when is the selected tab
    this.disposeTab = this.props.tabs.onTab(tab => {
      let active = false;
      if (tab == 'Capture') active = true;
      if (this.state.active != active) {
        this.setState({ active });
      }
    });
  }

  /**
   * On component will unmount
   */
  componentWillUnmount() {
    this.disposeTab();
  }

  /**
   * Render
   */
  render() {
    // if tab is not active we return a blank view
    if (!this.state.active) {
      return <View style={CommonStyle.flexContainer}/>
    }

    return (
      <View style={CommonStyle.flexContainer}>
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
              <TouchableHighlight underlayColor='gray' onPress={() => this.setState({screen:'captureVideo'})} style={this.state.screen === 'captureVideo'? styles.selectedButton: styles.buttons}>
                <Text>Video</Text>
              </TouchableHighlight>
            </View>
          </View> :
          <View></View>
        }
      </View>
    );
  }

  /**
   * Submit to poster
   */
  submitToPoster = (imageUri, type) => {
    this.setState({
      isPosting : true,
    });
    uploadAttachment('api/v1/archive/image', {
      uri: imageUri,
      type: type,
      name: imageUri.substring(imageUri.lastIndexOf('/') + 1)
    }).then((res) => {
      this.setState({
        imageUri,
        screen: 'poster',
        attachmentGuid: res.guid,
        attachmentDone: true,
        isPosting : false,
      });
    });

  }

  /**
   * Return tab style
   * @param {string} value
   */
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

  /**
   * Load selected screen
   */
  loadScreen() {
    switch (this.state.screen) {
      case 'gallery':
        return <GalleryScreen moveToCapture={() => this.moveToCaptureScreen()} submitToPoster={this.submitToPoster} style={styles.wrapper}/>;
        break;
      case 'captureImage':
        return <CaptureScreen isPosting={this.state.isPosting} submitToPoster={this.submitToPoster} style={styles.wrapper}/>;
        break;
      case 'captureVideo':
        return <CaptureVideo isPosting={this.state.isPosting} submitToPoster={this.submitToPoster} style={styles.wrapper}/>;
        break;
      case 'poster':
        return <Poster reset={() => this.resetState()} attachmentGuid={this.state.attachmentGuid} imageUri={this.state.imageUri}  />;
        break;
    }

  }

  /**
   * Reset state to default
   */
  resetState() {
    this.setState({
      screen: 'gallery',
      imageUri: '',
      attachmentGuid: '',
      attachmentDone: false,
    });
  }

  /**
   * Move to capture screen
   */
  moveToCaptureScreen() {
    this.setState({screen:'captureImage'});
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