//@ts-nocheck
import React, { Component } from 'react';

import { View, Alert, StyleSheet } from 'react-native';

import { inject, observer, Observer } from 'mobx-react';

import { ComponentsStyle } from '../styles/Components';
import NavNextButton from '../common/components/NavNextButton';
import Button from '../common/components/Button';
import logService from '../common/services/log.service';
import i18n from '../common/services/i18n.service';
import ActivityIndicator from '../common/components/ActivityIndicator';
import ThemedStyles from '../styles/ThemedStyles';
import { showNotification } from '../../AppMessages';
import TextInput from '../common/components/TextInput';
import MText from '../common/components/MText';

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
        <NavNextButton
          onPress={this.unlock}
          title={i18n.t('unlock').toUpperCase()}
          color={ThemedStyles.style.colorLink}
        />
      );
    } else {
      button = (
        <NavNextButton
          onPress={this.setup}
          title={i18n.t('setup').toUpperCase()}
          color={ThemedStyles.style.colorLink}
        />
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
            testID="MessengerSetupText"
          />
        </View>

        <View style={{ paddingTop: 32 }}>
          <MText style={styles.infoText}>
            · {i18n.t('messenger.setupMessage1')}
          </MText>
          <MText style={styles.infoText}>
            · {i18n.t('messenger.setupMessage2')}
          </MText>
          <MText style={styles.infoText}>
            · {i18n.t('messenger.setupMessage3')}
          </MText>
        </View>
      </View>
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
    const theme = ThemedStyles.style;
    let body, buttonProps;
    if (this.props.user.me.chat && !this.props.rekey) {
      body = this.renderUnlock();
    } else {
      body = this.renderOnboarding();
    }
    if (this.props.user.me.chat && !this.props.rekey) {
      buttonProps = {
        onPress: this.unlock,
        text: i18n.t('unlock').toUpperCase(),
      };
    } else {
      buttonProps = {
        onPress: this.setup,
        text: i18n.t('setup').toUpperCase(),
      };
    }
    return (
      <View style={theme.flexContainer}>
        {body}
        <View style={theme.padding4x}>
          <Button
            containerStyle={[theme.fullWidth, theme.marginTop6x]}
            loading={this.props.messengerList.unlocking}
            {...buttonProps}
            transparent
            large
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  infoText: {
    marginBottom: 16,
    color: '#BBB',
  },
});
