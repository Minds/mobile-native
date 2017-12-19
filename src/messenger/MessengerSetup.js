import React, {
  Component
} from 'react';

import {
  Text,
  View,
  TextInput,
  Button
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

    const button = (unlocking) ? <CenteredLoading /> : <Button title="UNLOCK" onPress={this.unlock} />

    return (
      <View style={[CommonStyle.flexContainer, CommonStyle.padding2x, CommonStyle.backgroundLight]}>
        <TextInput
          ref='password'
          style={ComponentsStyle.passwordinput}
          editable={true}
          underlineColorAndroid='transparent'
          placeholder='password...'
          secureTextEntry={true}
          onChangeText={(password) => this.password = password}
        />
        <View style={CommonStyle.marginTop2x}>
          {button}
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
