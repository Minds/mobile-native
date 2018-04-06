import React, {
  Component
} from 'react';

import {
  Text,
  View,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';

import {
  inject,
  observer
} from 'mobx-react/native'

import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import Button from '../common/components/Button';

/**
 * Messenger setup
 */
@inject('messengerList', 'user')
@observer
export default class MessengerSetup extends Component {

  /**
   * password
   * (don't use state to prevent render the component when password change)
   */
  password = '';
  confirm  = '';

  unlock = () => {
    this.props.messengerList.getCrytoKeys(this.password)
      .then(resp => {
        this.handleOnDone(resp);
      });
  }

  setup = () => {
    if (this.password !== this.confirm) {
      Alert.alert('password and confirmation do not match!');
      return;
    }
    this.props.messengerList.doSetup(this.password)
      .then(resp => {
        this.handleOnDone(resp);
      });
  }

  handleOnDone(resp) {
    if (this.props.onDone) {
      this.props.onDone(resp);
    }
  }

  renderUnlock() {
    const unlocking = this.props.messengerList.unlocking;

    const button = <Button text='Unlock' loading={unlocking} onPress={ this.unlock } />

    return (
      <View style={[CommonStyle.flexContainer, CommonStyle.padding2x, CommonStyle.backgroundLight]}>
        <View style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <TextInput
            style={ComponentsStyle.passwordinput}
            editable={true}
            underlineColorAndroid='transparent'
            placeholder='password...'
            secureTextEntry={true}
            onChangeText={(password) => this.password = password}
          />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'stretch', marginTop: 8 }}>
          <View style={CommonStyle.flexContainer}></View>
          <View>
            {button}
          </View>
        </View>

        <View style={{ paddingTop: 32 }}>
          <Text style={styles.infoText}>· You only need to enter this encryption password once as long as you stay signed in.</Text>
          <Text style={styles.infoText}>· It is important so that no one other than you and the people you are communicating with can access the content of your messages.</Text>
          <Text style={styles.infoText}>· By default the content of your messages is fully encrypted. For heightened security you may wish to go to your app settings and turn off push notifications in order to disallow metadata from being tracked.</Text>
          <Text style={styles.infoText}>· By default the content of your messages is fully encrypted. For heightened security you may wish to go to your app settings and turn off push notifications in order to disallow metadata from being tracked.</Text>
        </View>
      </View>
    )
  }

  renderOnboarding() {
    const unlocking = this.props.messengerList.unlocking;

    const button = <Button text='Setup' loading={unlocking} onPress={ this.setup } />

    const text = this.props.user.me.chat ? 'Changing your encryption password will cause your previous messages to be unreadable':
      'Hey @'+this.props.user.me.name+'! It looks like you haven\'t setup your encrypted chat password yet. We recommend that you use a different password than your account password for added security.'

    return (
      <View style={[CommonStyle.flexContainer, CommonStyle.padding2x, CommonStyle.backgroundLight]}>
        <View style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <TextInput
            style={ComponentsStyle.passwordinput}
            editable={true}
            underlineColorAndroid='transparent'
            placeholder='password...'
            secureTextEntry={true}
            onChangeText={(password) => this.password = password}
          /> 
          <TextInput
            style={[ComponentsStyle.passwordinput, CommonStyle.marginTop2x]}
            editable={true}
            underlineColorAndroid='transparent'
            placeholder='confirm password...'
            secureTextEntry={true}
            onChangeText={(password) => this.confirm = password}
          />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'stretch', marginTop: 8 }}>
          <View style={CommonStyle.flexContainer}></View>
          <View>
            {button}
          </View>
        </View>

        <View style={{ paddingTop: 32 }}>
          <Text style={styles.infoText}>{text}</Text>
        </View>
      </View>
    );
  }

  /**
   * Render
   */
  render() {

    if (this.props.user.me.chat && !this.props.rekey) {
      return this.renderUnlock();
    } else {
      return this.renderOnboarding();
    }
  }
}

const styles = StyleSheet.create({
	infoText: {
    marginBottom: 16,
    color: '#BBB',
  },
});
