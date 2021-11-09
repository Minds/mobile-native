//@ts-nocheck
import React, { Component } from 'react';

import { View, Alert, StyleSheet } from 'react-native';

import { inject, observer, Observer } from 'mobx-react';

import { ComponentsStyle } from '../styles/Components';
import NavNextButton from '../common/components/NavNextButton';
import logService from '../common/services/log.service';
import i18n from '../common/services/i18n.service';
import ActivityIndicator from '../common/components/ActivityIndicator';
import ThemedStyles from '../styles/ThemedStyles';
import { showNotification } from '../../AppMessages';
import TextInput from '../common/components/TextInput';
import MText from '../common/components/MText';
import { Button, Screen, ScreenSection, B2, Spacer } from '~ui';

type PropsType = {
  rekey?: boolean;
  onDone?: Function;
  navigation: any;
};

/**
 * Messenger setup
 */
@inject('messengerList', 'user')
@observer
export default class MessengerSetup extends Component<PropsType> {
  /**
   * password
   * (don't use state to prevent render the component when password change)
   */
  password = '';
  confirm = '';

  constructor(props) {
    super(props);
    const { setOptions } = this.props.navigation;
    let button;

    if (this.props.user.me.chat && !this.props.rekey) {
      button = (
        <Button type="action" mode="flat" size="small" onPress={this.unlock}>
          {i18n.t('unlock')}
        </Button>
      );
    } else {
      button = (
        <Button type="action" mode="flat" size="small" onPress={this.setup}>
          {i18n.t('setup').toUpperCase()}
        </Button>
      );
    }

    const headerRight = () => (
      <Observer>
        {() =>
          this.props.messengerList.unlocking ? (
            <ActivityIndicator style={ThemedStyles.style.marginRight2x} />
          ) : (
            button
          )
        }
      </Observer>
    );

    setOptions({ headerRight: headerRight, title: '' });
  }

  unlock = async () => {
    try {
      const response = await this.props.messengerList.getCryptoKeys(
        this.password,
      );
      this.handleOnDone(response);
    } catch (err) {
      logService.exception('[MessengerSetup]', err);
    }
  };

  setup = async () => {
    if (this.password !== this.confirm) {
      Alert.alert(i18n.t('auth.confirmPasswordError'));
      return;
    }
    try {
      const response = await this.props.messengerList.doSetup(this.password);
      this.handleOnDone(response);
    } catch (err) {
      logService.exception('[MessengerSetup]', err);
      showNotification(i18n.t('errorMessage'), 'danger');
    }
  };

  handleOnDone(resp) {
    if (this.props.onDone) {
      this.props.onDone(resp);
    }
  }

  renderUnlock() {
    return (
      <ScreenSection flex top="L">
        <View style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <TextInput
            style={ComponentsStyle.passwordinput}
            editable={true}
            underlineColorAndroid="transparent"
            placeholder={i18n.t('passwordPlaceholder')}
            secureTextEntry={true}
            onChangeText={password => (this.password = password)}
            testID="MessengerSetupText"
          />
        </View>

        <Spacer top="XL">
          <B2>· {i18n.t('messenger.setupMessage1')}</B2>
          <B2 top="M">· {i18n.t('messenger.setupMessage2')}</B2>
          <B2 top="M">· {i18n.t('messenger.setupMessage3')}</B2>
        </Spacer>
      </ScreenSection>
    );
  }

  renderOnboarding() {
    const text = this.props.user.me.chat
      ? i18n.t('messenger.changeKeyMessage')
      : i18n.t('messenger.notEncryptedMessage', {
          user: this.props.user.me.name,
        });

    return (
      <View
        style={[
          ThemedStyles.style.flexContainer,
          ThemedStyles.style.padding2x,
        ]}>
        <View style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <TextInput
            style={ComponentsStyle.passwordinput}
            editable={true}
            underlineColorAndroid="transparent"
            placeholder={i18n.t('passwordPlaceholder')}
            secureTextEntry={true}
            onChangeText={password => (this.password = password)}
          />
          <TextInput
            style={[
              ComponentsStyle.passwordinput,
              ThemedStyles.style.marginTop2x,
            ]}
            editable={true}
            underlineColorAndroid="transparent"
            placeholder={i18n.t('passwordConmfirmPlaceholder')}
            secureTextEntry={true}
            onChangeText={password => (this.confirm = password)}
          />
        </View>

        <View style={{ paddingTop: 16 }}>
          <MText style={styles.infoText}>{text}</MText>
        </View>
      </View>
    );
  }

  /**
   * Render
   */
  render() {
    let body, buttonProps;
    if (this.props.user.me.chat && !this.props.rekey) {
      body = this.renderUnlock();
    } else {
      body = this.renderOnboarding();
    }
    if (this.props.user.me.chat && !this.props.rekey) {
      buttonProps = {
        onPress: this.unlock,
        children: i18n.t('unlock'),
      };
    } else {
      buttonProps = {
        onPress: this.setup,
        children: i18n.t('setup'),
      };
    }
    return (
      <Screen safe>
        {body}
        <ScreenSection>
          <Button
            spinner
            loading={this.props.messengerList.unlocking}
            {...buttonProps}
            transparent
            large
          />
        </ScreenSection>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  infoText: {
    marginBottom: 16,
    color: '#BBB',
  },
});
