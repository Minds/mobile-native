//@ts-nocheck
import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';

import Modal from 'react-native-modal';

import i18n from '../common/services/i18n.service';
import authService from '../auth/AuthService';
import { ComponentsStyle } from '../styles/Components';
import ThemedStyles from '../styles/ThemedStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

type PropsType = {
  onSuccess: Function;
  close: Function;
  isVisible: boolean;
};

export default class ModalConfirmPassword extends Component<PropsType> {
  state = {
    password: '',
    error: false,
  };

  async submit() {
    this.setState({
      error: false,
    });
    try {
      await authService.validatePassword(this.state.password);
      this.props.onSuccess(this.state.password);
      this.setState({
        password: '',
      });
    } catch (err) {
      this.setState({
        error: true,
      });
    }
  }

  render() {
    const theme = ThemedStyles.style;
    const msg = this.state.error ? (
      <Text style={styles.error}>{i18n.t('auth.invalidPassword')}</Text>
    ) : null;
    return (
      <Modal
        isVisible={this.props.isVisible}
        backdropColor={ThemedStyles.getColor('PrimaryBackground')}
        backdropOpacity={1}>
        <SafeAreaView style={theme.flexContainer}>
          <KeyboardAvoidingView
            style={theme.flexContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : null}>
            {msg}
            <View style={styles.textCotainer}>
              <Text>{i18n.t('auth.confirmpassword')}</Text>
              <Text style={styles.closeText} onPress={this.props.close}>
                {i18n.t('close')}
              </Text>
            </View>
            <TextInput
              style={styles.passwordInput}
              placeholder={i18n.t('auth.password')}
              secureTextEntry={true}
              autoCapitalize={'none'}
              returnKeyType={'done'}
              placeholderTextColor="#444"
              underlineColorAndroid="transparent"
              onChangeText={value => this.setState({ password: value })}
              value={this.state.password}
              key={2}
            />
            <Button
              onPress={() => this.submit()}
              title={i18n.t('auth.confirmpassword')}
              borderRadius={3}
              backgroundColor="transparent"
              containerViewStyle={ComponentsStyle.loginButton}
              textStyle={ComponentsStyle.loginButtonText}
              key={1}
            />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = ThemedStyles.create({
  passwordInput: [ComponentsStyle.loginInput, 'marginTop2x'],
  closeText: ['colorSecondaryText', 'textRight'],
  error: [
    {
      marginTop: 8,
      marginBottom: 8,
      color: '#c00',
      textAlign: 'center',
    },
  ],
  textCotainer: [
    {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  ],
});
