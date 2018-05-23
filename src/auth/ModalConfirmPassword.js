import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

import Modal from 'react-native-modal';

import i18n from '../common/services/i18n.service';
import authService from '../auth/AuthService';
import { observer, inject } from 'mobx-react/native'
import { ComponentsStyle } from '../styles/Components';
import { CommonStyle } from '../styles/Common';
import Colors from '../styles/Colors';

export default class ModalConfirmPassword extends Component {

  state = {
    password: '',
    error: false
  };

  async submit() {
    this.setState({
      error:false
    });
    try {
      await authService.validatePassword(this.state.password);
      this.props.onSuccess();
    } catch (err) {
      console.log(err);
      this.setState({
        error: true
      });
    }
  }

  render() {
    const msg = (this.state.error) ? <Text style={styles.error}>{i18n.t('auth.invalidPassword')}</Text> : null;
    return (
      <Modal
        isVisible={ this.props.isVisible }
        backdropColor="white"
        backdropOpacity={ 1 }
      > 
        <View style={ [ CommonStyle.flexContainer, CommonStyle.modalScreen ]} >
          <KeyboardAvoidingView style={CommonStyle.flexContainer} behavior={Platform.OS == 'ios' ? 'padding' : null} >
            {msg}
            <Text>Confirm password</Text>
            <TextInput
              style={[ComponentsStyle.loginInput, CommonStyle.marginTop2x]}
              placeholder={i18n.t('auth.password')}
              secureTextEntry={true}
              autoCapitalize={'none'}
              returnKeyType={'done'}
              placeholderTextColor="#444"
              underlineColorAndroid='transparent'
              onChangeText={(value) => this.setState({ password: value })}
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
        </View> 

      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  error: {
    marginTop: 8,
    marginBottom: 8,
    color: '#c00',
    textAlign: 'center',
  },
  nonEditable: {
    color: Colors.darkGreyed
  }
});
