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

import ImagePicker from 'react-native-image-picker';

import { Button } from 'react-native-elements';

import Icon from 'react-native-vector-icons/Ionicons';

import Topbar from '../topbar/Topbar';
import CaptureVideo from './CaptureVideo';
import Poster from '../newsfeed/Poster';

import { uploadAttachment } from '../newsfeed/NewsfeedService';
import { CommonStyle } from '../styles/Common';
import colors from '../styles/Colors';

/**
 * Capture tab
 */
@inject('navigatorStore')
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
    // load data on enter
    this.disposeEnter = this.props.navigatorStore.onEnterScreen('Capture', (s) => {
      this.setState({ active: true });
    });

    // clear data on leave
    this.disposeLeave = this.props.navigatorStore.onLeaveScreen('Capture', (s) => {
      this.setState({ active: false });
    });
  }

  /**
   * Dispose reactions of navigation store on unmount
   */
  componentWillUnmount() {
    this.disposeEnter();
    this.disposeLeave();
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
      
        { this.state.screen != 'poster' ?
          <View style={{height:125}}>
            <View style={{flex:1, flexDirection:'row', paddingLeft: 1, paddingRight: 1 }}>
              <TouchableHighlight underlayColor='#FFF' onPress={() => this.gallery() } style={ styles.buttons}>
                <View style={ styles.buttonsWrapper }>
                  <Icon name="md-photos" size={36} style={ styles.icons }/>
                  <Text style={ styles.labels }>Gallery</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight underlayColor='#FFF' onPress={() => this.photo() } style={ styles.buttons }>
                <View style={ styles.buttonsWrapper }>
                  <Icon name="md-camera" size={36} style={ styles.icons }/>
                  <Text style={ styles.labels }>Photo</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight underlayColor='#FFF' onPress={() => this.video() } style={ styles.buttons }>
                <View style={ styles.buttonsWrapper }>
                  <Icon name="md-videocam" size={36} style={ styles.icons }/>
                  <Text style={ styles.labels }>Video</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View> :
          <View></View>
        }

      </View>
    );
  }

  video() {
    ImagePicker.launchCamera({
      mediaType: 'video',
    },
    (response) => {

      if (response.didCancel) {
        return;
      }
      else if (response.error) {
        alert('ImagePicker Error: '+ response.error);
      }
      else if (response.customButton) {
        return;
      }

      let item = {
        uri: response.uri,
        type: 'video/mp4',
        fileName: 'image.mp4'
      }
      this.props.onSelectedMedia(item);
    });
  }

  photo() {
    ImagePicker.launchCamera({
      mediaType: 'photo',
    },
    (response) => {

      if (response.didCancel) {
        return;
      }
      else if (response.error) {
        alert('ImagePicker Error: '+ response.error);
      }
      else if (response.customButton) {
        return;
      }

      let item = {
        uri: response.uri,
        type: 'image/jpeg',
        fileName: 'image.jpg'
      }
      this.props.onSelectedMedia(item);
    });
  }

  gallery() {
    ImagePicker.launchImageLibrary({
    },
    (response) => {
      this.props.onSelectedMedia(response);
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
  icons: {
    color: '#444',
  },
  labels: {
    letterSpacing: 1.25,
    color: '#444',
  },
  buttons: {
    flex:1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    margin: 1,
  },
  buttonsWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  selectedButton: {
    flex:1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth:3,
    backgroundColor: '#FFF',
    borderColor: colors.primary,
  }
});