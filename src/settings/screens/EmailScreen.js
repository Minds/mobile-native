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

    // validate
    const error = validator.emailMessage(email);

    return (
      <View style={[CommonStyle.flexContainer, CommonStyle.backgroundWhite, CommonStyle.marginTop2x]}>
        <Input
          label={i18n.t('settings.currentEmail')}
          onChangeText={this.setEmail}
          value={email}
          errorMessage={error}
          leftIcon={{ type: 'font-awesome', name: 'envelope-o' }}
        />
        <Button
          text={i18n.t('save').toUpperCase()}
          loading={this.state.saving}
          containerStyle={[CommonStyle.marginTop3x, {alignSelf: 'center'}]}
          onPress={this.confirmPassword}
        />
        <ModalConfirmPassword isVisible={this.state.isVisible} onSuccess={this.save}></ModalConfirmPassword>
      </View>
    );
  }
}
