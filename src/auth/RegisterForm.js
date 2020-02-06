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
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import authService from '../auth/AuthService';
import { CommonStyle as CS} from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';

import { observer, inject } from 'mobx-react/native';

import {CheckBox} from 'react-native-elements'

import i18n from '../common/services/i18n.service';
import sessionService from '../common/services/session.service';
import delay from '../common/helpers/delay';
import apiService from '../common/services/api.service';
import Input from '../common/components/Input';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../common/components/Button';
import { DISABLE_PASSWORD_INPUTS } from '../config/Config';

/**
 * Register Form
 */
@inject('user')
@observer
export default class RegisterForm extends Component {
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

  getFormBody = () => {
    return (
      <ScrollView style={[CS.flexContainer, CS.marginTop2x]}>
        <TouchableOpacity onPress={this.props.onBack} style={CS.marginBottom3x}>
          <Icon size={34} name="keyboard-arrow-left" style={CS.colorSecondaryText} />
        </TouchableOpacity>
        <Text style={[CS.marginBottom3x, CS.textCenter, CS.titleText, CS.colorPrimaryText]}>
          {i18n.t('auth.join')}
        </Text>
        <Text style={{color: '#F00', textAlign: 'center', paddingTop:4, paddingLeft:4}}>
          {this.state.error.termsAcceptedError}
        </Text>
        <Input
          placeholder={i18n.t('auth.username')}
          onChangeText={this.setUsername}
          value={this.state.username}
          editable={!this.state.inProgress}
          testID="registerUsernameInput"
        />
        <Input
          placeholder={i18n.t('auth.email')}
          onChangeText={this.setEmail}
          value={this.state.email}
          editable={!this.state.inProgress}
          testID="registerEmailInput"
        />
        <Input
          placeholder={i18n.t('auth.password')}
          secureTextEntry={!DISABLE_PASSWORD_INPUTS} // e2e workaround
          onChangeText={this.setPassword}
          value={this.state.password}
          editable={!this.state.inProgress}
          testID="registerPasswordInput"
        />
        { this.state.password ?
          <Input
            placeholder={i18n.t('auth.confirmpassword')}
            secureTextEntry={!DISABLE_PASSWORD_INPUTS} // e2e workaround
            onChangeText={this.setConfirmPassword}
            value={this.state.confirmPassword}
            editable={!this.state.inProgress}
            testID="registerPasswordConfirmInput"
          /> : null }
        <CheckBox
          containerStyle={ComponentsStyle.registerCheckboxNew}
          title={<Text style={ComponentsStyle.termsNew}>{i18n.t('auth.accept')} <Text style={ComponentsStyle.linkNew} onPress={ ()=> Linking.openURL('https://www.minds.com/p/terms') }>{i18n.t('auth.termsAndConditions')}</Text></Text>}
          checked={this.state.termsAccepted}
          // textStyle={ComponentsStyle.registerCheckboxTextNew}
          onPress={this.check}
          disabled={this.state.inProgress}
          testID="checkbox"
        />
      </ScrollView>
    );
  };

  check = () => {
    this.setState({ termsAccepted: !this.state.termsAccepted })
  };

  getFormFooter = () => {
    return (
      <View style={CS.flexContainer}>
        <Button
          onPress={() => this.onPressRegister()}
          borderRadius={2}
          containerStyle={ComponentsStyle.loginButtonNew}
          loading={this.state.inProgress}
          loadingRight={true}
          disabled={this.state.inProgress}
          text={''}
          testID="registerCreateButton"
        >
          <Text style={ComponentsStyle.loginButtonTextNew}>{i18n.t('auth.createChannel')}</Text>
        </Button>
        <Text style={[CS.subTitleText, CS.colorSecondaryText, CS.centered, CS.marginTop2x]}>
          {i18n.to('auth.alreadyHaveAccount', null, {
            login: (
              <Text style={[ComponentsStyle.linkNew, CS.fontL]} onPress={this.props.onBack}>
                {i18n.t('auth.login')}
              </Text>
            ),
          })}
        </Text>
      </View>
    );
  };

  render() {
    return (
      <View style={[CS.flexContainerCenter]}>
        <View style={[CS.mindsLayoutBody, CS.backgroundThemePrimary]}>
          {this.getFormBody()}
        </View>
        <View style={[CS.mindsLayoutFooter, CS.backgroundThemePrimary]}>
          {this.getFormFooter()}
        </View>
      </View>
    );
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
      sessionService.setInitialScreen('OnboardingScreenNew');
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
