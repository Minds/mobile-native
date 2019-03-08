import React, {
  Component
} from 'react';

import {
  View,
  ScrollView,
  Text,
  Alert,
} from 'react-native';

import { List, ListItem } from 'react-native-elements';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import settingsService from '../SettingsService';
import i18n from '../../common/services/i18n.service';
import validator from '../../common/services/validator.service';
import CenteredLoading from '../../common/components/CenteredLoading';
import Button from '../../common/components/Button';
import { CommonStyle } from '../../styles/Common';
import ModalConfirmPassword from '../../auth/ModalConfirmPassword';

/**
 * Email settings screen
 */
export default class EmailScreen extends Component {

  static navigationOptions = {
    title: 'Change Email'
  }

  state = {
    email: null,
    saving: false,
    isVisible: false,
    loaded: false
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
    this.setState({email});
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
      })
      .catch(() => {
        Alert.alert('Error', i18n.t('settings.errorSaving'));
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

    // validate
    const error = validator.emailMessage(email);
    const message = error ? <FormValidationMessage>{error}</FormValidationMessage> : null;

    return (
      <View style={[CommonStyle.flexContainer, CommonStyle.backgroundWhite]}>
        <FormLabel labelStyle={CommonStyle.fieldLabel}>{i18n.t('settings.currentEmail')}</FormLabel>
        <FormInput onChangeText={this.setEmail} value={email} inputStyle={CommonStyle.fieldTextInput}/>
        {message}
        <Button
          text={i18n.t('save')}
          loading={this.state.saving}
          containerStyle={[CommonStyle.marginTop3x, {alignSelf: 'center'}]}
          onPress={this.confirmPassword}
        />
        <ModalConfirmPassword isVisible={this.state.isVisible} onSuccess={this.save}></ModalConfirmPassword>
      </View>
    );
  }
}
