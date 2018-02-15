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
  Platform
} from 'react-native';

import ActionSheet from 'react-native-actionsheet';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

import Topbar from '../topbar/Topbar';
import Poster from '../newsfeed/Poster';
import { CommonStyle } from '../styles/Common';
import colors from '../styles/Colors';
import attachmentService from '../common/services/attachment.service';

/**
 * Capture tab
 */
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

  /**
   * Render
   */
  render() {
    let actionsheet = null;

    if (Platform.OS != 'ios') {
      actionsheet = <ActionSheet
        ref={o => this.actionSheet = o}
        options={['Cancel', 'Images', 'Videos']}
        onPress={this._selectMediaType}
        cancelButtonIndex={0}
      />
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
        {actionsheet}
      </View>
    );
  }

  async video() {
    try {
      const response = await attachmentService.photo();
      if (response) this.props.onSelectedMedia(response);
    } catch(e) {
      alert(e);
    }
  }

  async photo() {
    try {
      const response = await attachmentService.gallery('mixed');
      if (response) this.props.onSelectedMedia(response);
    } catch(e) {
      alert(e);
    }
  }

  /**
   * Open gallery
   */
  async gallery() {
    if (Platform.OS == 'ios') {
      try {
        const response = await attachmentService.gallery('mixed');
        if (response) this.props.onSelectedMedia(response);
      } catch (e) {
        alert(e);
      }
    } else {
      this.actionSheet.show()
    }
  }

  /**
   * On media type select
   */
  _selectMediaType = async (i) => {
    try {
      let response;
      switch (i) {
        case 1:
          response = await attachmentService.gallery('photo');
          break;
        case 2:
          response = await attachmentService.gallery('video');
          break;
      }

      if (response) this.props.onSelectedMedia(response);
    } catch(e) {
      alert(e);
    }
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