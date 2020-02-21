  import React, {
    Component,
} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Platform,
} from 'react-native';

import ActionSheet from 'react-native-actionsheet';
import Icon from 'react-native-vector-icons/Ionicons';

import { CommonStyle } from '../styles/Common';
import colors from '../styles/Colors';
import attachmentService from '../common/services/attachment.service';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';

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
        options={[i18n.t('cancel'), i18n.t('images'), i18n.t('videos')]}
        onPress={this._selectMediaType}
        cancelButtonIndex={0}
      />
    }

    return (
      <View style={CommonStyle.flexContainer}>

        { this.state.screen != 'poster' ?
          <View style={{height:125}}>
            <View style={{flex:1, flexDirection:'row', paddingLeft: 1, paddingRight: 1 }}>
              <TouchableHighlight onPress={ this.gallery } style={ [styles.buttons, ThemedStyles.style.backgroundPrimary] }>
                <View style={ styles.buttonsWrapper }>
                  <Icon name="md-photos" size={36} style={ ThemedStyles.style.colorIcon }/>
                  <Text style={ [styles.labels, ThemedStyles.style.colorIcon] }>{i18n.t('capture.gallery')}</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight onPress={ this.photo } style={ [styles.buttons, ThemedStyles.style.backgroundPrimary] }>
                <View style={ styles.buttonsWrapper }>
                  <Icon name="md-camera" size={36} style={ ThemedStyles.style.colorIcon }/>
                  <Text style={ [styles.labels, ThemedStyles.style.colorIcon] }>{i18n.t('capture.photo')}</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight onPress={ this.video } style={ [styles.buttons, ThemedStyles.style.backgroundPrimary] }>
                <View style={ styles.buttonsWrapper }>
                  <Icon name="md-videocam" size={36} style={ ThemedStyles.style.colorIcon }/>
                  <Text style={ [styles.labels, ThemedStyles.style.colorIcon] }>{i18n.t('capture.video')}</Text>
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

  video = async () => {
    try {
      const response = await attachmentService.video();
      if (response) this.props.onSelectedMedia(response);
    } catch(e) {
      alert(e);
    }
  }

  photo = async () => {
    try {
      const response = await attachmentService.photo();
      if (response) this.props.onSelectedMedia(response);
    } catch(e) {
      alert(e);
    }
  }

  /**
   * Open gallery
   */
  gallery = async () => {
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
