import React, {
  Component
} from 'react';

import {
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
} from 'react-native';

import {
  inject,
  observer
} from 'mobx-react/native'

import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import CenteredLoading from '../common/components/CenteredLoading';
/**
 * Messenger setup
 */
@inject('messengerList')
@observer
export default class MessengerSetup extends Component {

  /**
   * password
   * (don't use state to prevent render the component when password change)
   */
  password = '';

  unlock = () => {
    this.props.messengerList.getCrytoKeys(this.password);
  }

  /**
   * Render
   */
  render() {
    const unlocking = this.props.messengerList.unlocking;

    const button = (unlocking) ? <View style={{height:40}}><CenteredLoading /></View> : 
      <TouchableHighlight 
        underlayColor='transparent' 
        onPress={ this.unlock } 
        style={[
          ComponentsStyle.button,
          ComponentsStyle.buttonAction,
          { backgroundColor: 'transparent' },
        ]}>
        <Text style={[CommonStyle.paddingLeft, CommonStyle.paddingRight, CommonStyle.colorPrimary]}>Unlock</Text>
      </TouchableHighlight>

    return (
      <View style={[CommonStyle.flexContainer, CommonStyle.padding2x, CommonStyle.backgroundLight]}>
        <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
          <TextInput
            ref='password'
            style={ [ ComponentsStyle.passwordinput, { flex: 1 } ]}
            editable={true}
            underlineColorAndroid='transparent'
            placeholder='password...'
            secureTextEntry={true}
            onChangeText={(password) => this.password = password}
          />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'stretch', marginTop: 8 }}>
          <View style={{ flex: 1 }}></View>
          <View>
            {button}
          </View>
        </View>

        <View style={CommonStyle.marginTop2x}>
          <Text style={CommonStyle.fontS}>· You only need to enter this encryption password once as long as you stay signed in.</Text>
          <Text style={CommonStyle.fontS}>· It is important so that no one other than you and the people you are communicating with can access the content of your messages.</Text>
          <Text style={CommonStyle.fontS}>· By default the content of your messages is fully encrypted. For heightened security you may wish to go to your app settings and turn off push notifications in order to disallow metadata from being tracked.</Text>
          <Text style={CommonStyle.fontS}>· By default the content of your messages is fully encrypted. For heightened security you may wish to go to your app settings and turn off push notifications in order to disallow metadata from being tracked.</Text>
        </View>
      </View>
    )
  }
}
