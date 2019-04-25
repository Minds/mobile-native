import React, {
  Component
} from 'react';

import {
  Text,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import {
  inject,
  observer,
  Observer
} from 'mobx-react/native'

import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import Colors from '../styles/Colors';
import Button from '../common/components/Button';
import NavNextButton from '../common/components/NavNextButton';
import logService from '../common/services/log.service';

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

  componentWillMount() {
    const { setParams } = this.props.navigation;
    let button;

    if (this.props.user.me.chat && !this.props.rekey) {
      button = (
        <NavNextButton
          onPress={this.unlock}
          title="UNLOCK"
          color={Colors.primary}
        />
      );
    } else {
      button = (
        <NavNextButton
          onPress={this.setup}
          title="SETUP"
          color={Colors.primary}
        />
      );
    }

    const headerRight = (
      <Observer>
        {() => this.props.messengerList.unlocking ? <ActivityIndicator style={CommonStyle.marginRight2x}/> : button }
      </Observer>
    )

    setParams({ headerRight: headerRight });
  }

  unlock = async () => {
    try {
      const response = await this.props.messengerList.getCryptoKeys(this.password)
      this.handleOnDone(response);
    } catch (err) {
      logService.exception('[MessengerSetup]', err)
    };
  }

  setup = async() => {
    if (this.password !== this.confirm) {
      Alert.alert('password and confirmation do not match!');
      return;
    }
    try {
      const response = await this.props.messengerList.doSetup(this.password);
      this.handleOnDone(response);
    } catch (err) {
      logService.exception('[MessengerSetup]', err);
      alert('Oops something went wrong');
    }
  }

  handleOnDone(resp) {
    if (this.props.onDone) {
      this.props.onDone(resp);
    }
  }

  renderUnlock() {
    const unlocking = this.props.messengerList.unlocking;

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

        <View style={{ paddingTop: 16 }}>
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
