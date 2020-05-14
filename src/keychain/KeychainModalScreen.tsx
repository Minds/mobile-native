//@ts-nocheck
import React, { Component } from 'react';
import { Text, View, TextInput, SafeAreaView } from 'react-native';

import Modal from 'react-native-modal';
import { observer, inject } from 'mobx-react';

import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import Button from '../common/components/Button';

@inject('keychain')
@observer
export default class KeychainModalScreen extends Component {
  state = {
    secret: '',
    secretConfirmation: '',
  };

  submit = () => {
    if (!this.canSubmit()) {
      return;
    }

    this.props.keychain.unlock(this.state.secret);
    this.setState({ secret: '' });
  };

  cancel = () => {
    this.props.keychain.cancel();
    this.setState({ secret: '' });
  };

  canSubmit() {
    if (!this.props.keychain.unlockingExisting) {
      return (
        !!this.state.secret &&
        this.state.secret === this.state.secretConfirmation
      );
    }

    return !!this.state.secret;
  }

  renderBody() {
    const theme = ThemedStyles.style;
    if (this.props.keychain.unlockingExisting) {
      return (
        <View>
          <Text style={[theme.fontXL, theme.colorSecondaryText]}>
            {i18n.t('keychain.unlockMessage', {
              keychain: this.props.keychain.unlockingKeychain,
            })}
          </Text>
          <TextInput
            style={[theme.input, theme.marginVertical2x]}
            placeholderTextColor={ThemedStyles.getColor('tertiary_text')}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(secret) => this.setState({ secret })}
            value={this.state.secret || ''}
          />
        </View>
      );
    } else {
      return (
        <View>
          <Text style={[theme.fontXL, theme.colorSecondaryText]}>
            {i18n.t('keychain.setupMessage', {
              keychain: this.props.keychain.unlockingKeychain,
            })}
          </Text>
          <Text style={[theme.fontL, theme.paddingVertical2x]}>
            {i18n.t('keychain.encryptMessage', {
              keychain: this.props.keychain.unlockingKeychain,
            }) +
              '\n' +
              i18n.t('keychain.encryptMessage1')}
          </Text>
          <TextInput
            style={[theme.input, theme.marginVertical2x]}
            placeholder={i18n.t('auth.password')}
            placeholderTextColor={ThemedStyles.getColor('tertiary_text')}
            secureTextEntry={true}
            onChangeText={(secret) => this.setState({ secret })}
            value={this.state.secret || ''}
          />
          <TextInput
            style={[theme.input, theme.marginVertical2x]}
            placeholderTextColor={ThemedStyles.getColor('tertiary_text')}
            placeholder={i18n.t('auth.confirmpassword')}
            secureTextEntry={true}
            onChangeText={(secretConfirmation) =>
              this.setState({ secretConfirmation })
            }
            value={this.state.secretConfirmation || ''}
          />
          {this.state.secret !== this.state.secretConfirmation && (
            <Text style={[theme.colorAlert]}>
              {i18n.t('auth.confirmPasswordError')}
            </Text>
          )}
        </View>
      );
    }
  }

  render() {
    const body = this.renderBody();
    const theme = ThemedStyles.style;

    return (
      <Modal
        isVisible={this.props.keychain.isUnlocking}
        backdropColor={ThemedStyles.getColor('primary_background')}
        backdropOpacity={1}>
        {this.props.keychain.isUnlocking && (
          <SafeAreaView style={[theme.flexContainer, theme.padding2x]}>
            {body}
            {this.props.keychain.unlockingAttempts > 0 && (
              <Text style={[theme.colorAlert, theme.fontL]}>
                {i18n.t('auth.invalidPassword')}
              </Text>
            )}

            <View style={[theme.rowJustifyStart, theme.marginTop2x]}>
              <View style={theme.flexContainer} />
              <Button text={i18n.t('cancel')} onPress={this.cancel} inverted />
              <Button
                text={i18n.t('confirm')}
                onPress={this.submit}
                containerStyle={theme.marginLeft2x}
              />
            </View>
          </SafeAreaView>
        )}
      </Modal>
    );
  }
}
