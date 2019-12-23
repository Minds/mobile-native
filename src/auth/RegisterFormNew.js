import React, {
  Component
} from 'react';

import {
  Text,
  TextInput,
  KeyboardAvoidingView,
  View,
  ScrollView,
  Linking,
  Alert,
  StyleSheet
} from 'react-native';

import authService from '../auth/AuthService';
import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';

import { observer, inject } from 'mobx-react/native';

import {
  CheckBox,
  Button
} from 'react-native-elements'

import i18n from '../common/services/i18n.service';
import sessionService from '../common/services/session.service';
import delay from '../common/helpers/delay';
import apiService from '../common/services/api.service';
import Input from '../common/components/Input';

/**
 * Register Form
 */
@inject('user')
@observer
export default class RegisterFormNew extends Component {
  state = {
    error: {},
    password: '',
    username: '',
    confirmPassword: '',
    email: '',
    termsAccepted: false,
    exclusive_promotions: false,
    inProgress: false,
  };

  validatePassword(value) {
    let error = this.state.error;
    if (this.state.password !== value) {
      error.confirmPasswordError = i18n.t('auth.confirmPasswordError');
    } else {
      error.confirmPasswordError = '';
    }
    this.setState({ error });
  }

  validateTerms(value) {
    let error = this.state.error;
    if(!this.state.termsAccepted && this.state.username.length > 4){
      error.termsAcceptedError = i18n.t('auth.termsAcceptedError');
    } else {
      error.termsAcceptedError = '';
    }
    this.setState({ termsAccepted: !!value, error });
  }

  setUsername = username => this.setState({username});
  setEmail = email => this.setState({email});
  setPassword = password => this.setState({password});
  setConfirmPassword = confirmPassword => this.setState({confirmPassword});

  render() {
    return (
      <ScrollView>
        <View>
          <Text style={styles.joinText}>
            {i18n.t('auth.join')}
          </Text>
        </View>
        <View>
          <Text style={{color: '#F00', textAlign: 'center', paddingTop:4, paddingLeft:4}}>
            {this.state.error.termsAcceptedError}
          </Text>
        </View>
        <Input
          placeholder={i18n.t('auth.username')}
          onChangeText={this.setUsername}
          value={this.state.username}
          editable={!this.state.inProgress}
        />
        <Input
          placeholder={i18n.t('auth.email')}
          onChangeText={this.setEmail}
          value={this.state.email}
          editable={!this.state.inProgress}
        />
        <Input
          placeholder={i18n.t('auth.password')}
          secureTextEntry={true}
          onChangeText={this.setPassword}
          value={this.state.password}
          editable={!this.state.inProgress}
        />
        { this.state.password ?
          <Input
            placeholder={i18n.t('auth.confirmpassword')}
            secureTextEntry={true}
            onChangeText={this.setConfirmPassword}
            value={this.state.confirmPassword}
            editable={!this.state.inProgress}
          /> : null }
        <CheckBox
          right
          iconLeft
          containerStyle={ComponentsStyle.registerCheckboxNew}
          title={<Text style={ComponentsStyle.termsNew}>{i18n.t('auth.accept')} <Text style={ComponentsStyle.linkNew} onPress={ ()=> Linking.openURL('https://www.minds.com/p/terms') }>{i18n.t('auth.termsAndConditions')}</Text></Text>}
          checked={this.state.termsAccepted}
          textStyle={ComponentsStyle.registerCheckboxTextNew}
          onPress={() => { this.setState({ termsAccepted: !this.state.termsAccepted }) }}
          disabled={this.state.inProgress}
        />
        <View style={[styles.containerButton, CommonStyle.marginTop2x]}>
            <Button
              onPress={() => this.onPressRegister()}
              title={i18n.t('auth.createChannel')}
              backgroundColor="#5DBAC0"
              borderRadius={2}
              containerViewStyle={[styles.button, ComponentsStyle.loginButton]}
              textStyle={ComponentsStyle.loginButtonText}
              loading={this.state.inProgress}
              loadingRight={true}
              disabled={this.state.inProgress}
              disabledStyle={CommonStyle.backgroundTransparent}
            />
        </View>
      </ScrollView>
    );
  }

  /**
   * On press back
   */
  onPressBack() {
    this.props.onBack();
  }

  /**
   * On press register
   */
  async onPressRegister() {
    this.validatePassword(this.state.confirmPassword);

    if (!this.state.termsAccepted) {
      return Alert.alert(
        i18n.t('ops'),
        i18n.t('auth.termsAcceptedError')
      );
    }

    if (this.state.error.confirmPasswordError) {
      return Alert.alert(
        i18n.t('ops'),
        i18n.t('auth.confirmPasswordError')
      );
    }

    this.setState({ inProgress: true });

    try {
      const params = {
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        exclusive_promotions: this.state.exclusive_promotions
      };
      await authService.register(params);
      sessionService.setInitialScreen('OnboardingScreen');
      await apiService.clearCookies();
      await delay(100);
      await authService.login(this.state.username ,this.state.password);
    } catch (err) {
      Alert.alert(
        i18n.t('ops'),
        err.message
      );
    }

    this.setState({ inProgress: false });
  }
}

const styles = StyleSheet.create({
  joinText: {
    color: '#4A4A4A',
    fontFamily: 'Roboto',
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 37,
    textAlign: 'center',
    paddingTop: 25,
  },
  containerButton: {
    flex: 1,
    marginLeft: 10,
    marginRight: 20,
  },
  button: {
    alignSelf: 'stretch',
  },
});
