import React, {
  Component
} from 'react';

import {
  View,
  ScrollView,
  Text,
  Alert,
} from 'react-native';

import { Input } from 'react-native-elements';
import settingsService from '../SettingsService';
import i18n from '../../common/services/i18n.service';
import validator from '../../common/services/validator.service';
import CenteredLoading from '../../common/components/CenteredLoading';
import Button from '../../common/components/Button';
import { CommonStyle } from '../../styles/Common';
import ModalConfirmPassword from '../../auth/ModalConfirmPassword';
import { inject } from 'mobx-react'

/**
 * Email settings screen
 */
@inject('user')
export default class EmailScreen extends Component {

  static navigationOptions = {
    title: 'Change Email'
  }

  state = {
    email: null,
    saving: false,
    isVisible: false,
    loaded: false,
    showConfirmNote: false,
  }

  constructor(){
    super();
    settingsService.getSettings().then(({ channel }) => {
      this.setState({email: channel.email, loaded: true});
    });
  }

  /**
   * Set email value
   */
  setEmail = (email) => {
    this.setState({email, showConfirmNote: true});
  }

  /**
   * Save email
   */
  save = () => {
    if (!validator.email(this.state.email)) return;

    this.setState({saving: true});

    settingsService.submitSettings({email: this.state.email})
      .then((data) => {
        this.props.navigation.goBack();
      })
      .finally(() => {
        this.setState({isVisible:false});
        this.setState({saving: false});
        this.props.user.me.setEmailConfirmed(false);
      })
      .catch(() => {
        Alert.alert(i18n.t('error'), i18n.t('settings.errorSaving'));
      });
  }

  confirmPassword = () => {
    this.setState({isVisible:true});
  }

  /**
   * Render
   */
  render() {
    if (this.state.saving || !this.state.loaded) {
      return <CenteredLoading/>
    }

    const email = this.state.email;
    const showConfirmNote = this.state.showConfirmNote;

    // validate
    const error = validator.emailMessage(email);
    const message = error ? <FormValidationMessage>{error}</FormValidationMessage> : null;
    const confirmNote = showConfirmNote ? <FormValidationMessage>{i18n.t('emailConfirm.confirmNote')}</FormValidationMessage> : null;

    return (
      <View style={[CommonStyle.flexContainer]}>
        <Input onChangeText={this.setEmail} value={email} inputStyle={CommonStyle.fieldTextInput} label={i18n.t('settings.currentEmail')}/>
        {message}
        {confirmNote}
        <Button
          text={i18n.t('save').toUpperCase()}
          loading={this.state.saving}
          containerStyle={[CommonStyle.marginTop3x, CommonStyle.padding2x, {alignSelf: 'center'}]}
          onPress={this.confirmPassword}
        />
        <ModalConfirmPassword isVisible={this.state.isVisible} onSuccess={this.save}></ModalConfirmPassword>
      </View>
    );
  }
}
