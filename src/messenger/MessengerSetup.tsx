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
} from 'mobx-react'

import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import Colors from '../styles/Colors';
import Button from '../common/components/Button';
import NavNextButton from '../common/components/NavNextButton';
import logService from '../common/services/log.service';
import i18n from '../common/services/i18n.service';

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
    const { setOptions } = this.props.navigation;
    let button;

    if (this.props.user.me.chat && !this.props.rekey) {
      button = (
        <NavNextButton
          onPress={this.unlock}
          title={i18n.t('unlock').toUpperCase()}
          color={Colors.primary}
        />
      );
    } else {
      button = (
        <NavNextButton
          onPress={this.setup}
          title={i18n.t('setup').toUpperCase()}
          color={Colors.primary}
        />
      );
    }

    const headerRight = () => (
      <Observer>
        {() => this.props.messengerList.unlocking ? <ActivityIndicator style={CommonStyle.marginRight2x}/> : button }
      </Observer>
    )

    setOptions({ headerRight: headerRight, title:'' });
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
      Alert.alert(i18n.t('auth.confirmPasswordError'));
      return;
    }
    try {
      const response = await this.props.messengerList.doSetup(this.password);
      this.handleOnDone(response);
    } catch (err) {
      logService.exception('[MessengerSetup]', err);
      alert(i18n.t('errorMessage'));
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
      <View style={[CommonStyle.flexContainer, CommonStyle.padding2x]}>
        <View style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <TextInput
            style={ComponentsStyle.passwordinput}
            editable={true}
            underlineColorAndroid='transparent'
            placeholder={i18n.t('passwordPlaceholder')}
            secureTextEntry={true}
            onChangeText={(password) => this.password = password}
            testID="MessengerSetupText"
          />
        </View>

        <View style={{ paddingTop: 32 }}>
          <Text style={styles.infoText}>· {i18n.t('messenger.setupMessage1')}</Text>
          <Text style={styles.infoText}>· {i18n.t('messenger.setupMessage2')}</Text>
          <Text style={styles.infoText}>· {i18n.t('messenger.setupMessage3')}</Text>
        </View>
      </View>
    )
  }

  renderOnboarding() {
    const unlocking = this.props.messengerList.unlocking;

    const text = this.props.user.me.chat ? i18n.t('messenger.changeKeyMessage') :
      i18n.t('messenger.notEncryptedMessage', {user: this.props.user.me.name});

    return (
      <View style={[CommonStyle.flexContainer, CommonStyle.padding2x]}>
        <View style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <TextInput
            style={ComponentsStyle.passwordinput}
            editable={true}
            underlineColorAndroid='transparent'
            placeholder={i18n.t('passwordPlaceholder')}
            secureTextEntry={true}
            onChangeText={(password) => this.password = password}
          />
          <TextInput
            style={[ComponentsStyle.passwordinput, CommonStyle.marginTop2x]}
            editable={true}
            underlineColorAndroid='transparent'
            placeholder={i18n.t('passwordConmfirmPlaceholder')}
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
