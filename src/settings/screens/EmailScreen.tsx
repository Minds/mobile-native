import React, { Component } from 'react';

import { View, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import settingsService from '../SettingsService';
import i18n from '../../common/services/i18n.service';
import validator from '../../common/services/validator.service';
import CenteredLoading from '../../common/components/CenteredLoading';
import ModalConfirmPassword from '../../auth/ModalConfirmPassword';
import { inject } from 'mobx-react';
import ThemedStyles from '../../styles/ThemedStyles';
import MText from '../../common/components/MText';
import { Button } from '~ui';
import InputContainer from '~/common/components/InputContainer';
import { AppStackParamList } from '~/navigation/NavigationTypes';
import type UserStore from '~/auth/UserStore';
type NavigationProp = StackNavigationProp<AppStackParamList, 'SettingsEmail'>;
/**
 * Email settings screen
 */
@inject('user')
class EmailScreen extends Component<
  {
    navigation: NavigationProp;
    user: UserStore;
  },
  {
    email: string;
    saving: boolean;
    isVisible: boolean;
    loaded: boolean;
    showConfirmNote: boolean;
    inProgress: boolean;
  }
> {
  static navigationOptions = {
    title: 'Change Email',
  };

  state = {
    email: '',
    saving: false,
    isVisible: false,
    loaded: false,
    inProgress: false,
    showConfirmNote: false,
  };

  constructor(props) {
    super(props);
    settingsService.getSettings().then(({ channel }) => {
      this.setState({ email: channel.email, loaded: true });
    });
  }

  componentDidMount() {
    const { setOptions } = this.props.navigation;

    setOptions({
      headerRight: () => (
        <Button
          type="action"
          mode="flat"
          size="small"
          onPress={this.confirmPassword}>
          {i18n.t('save')}
        </Button>
      ),
    });
  }

  /**
   * Set email value
   */
  setEmail = email => {
    this.setState({ email, showConfirmNote: true });
  };

  /**
   * Save email
   */
  save = () => {
    if (!validator.email(this.state.email)) return;

    this.setState({ saving: true });

    settingsService
      .submitSettings({ email: this.state.email })
      .then(data => {
        this.props.navigation.goBack();
      })
      .finally(() => {
        this.setState({ isVisible: false });
        this.setState({ saving: false });
        this.props.user.me.setEmailConfirmed(false);
      })
      .catch(() => {
        Alert.alert(i18n.t('error'), i18n.t('settings.errorSaving'));
      });
  };

  confirmPassword = () => {
    this.setState({ isVisible: true });
  };

  dismissModal = () => {
    this.setState({ isVisible: false });
  };

  /**
   * Render
   */
  render() {
    const theme = ThemedStyles.style;

    if (this.state.saving || !this.state.loaded) {
      return <CenteredLoading />;
    }

    const email = this.state.email;
    const showConfirmNote = this.state.showConfirmNote;

    const valid = validator.email(email);

    const confirmNote = showConfirmNote ? (
      <MText
        style={[
          theme.colorSecondaryText,
          theme.fontM,
          theme.paddingHorizontal2x,
          theme.centered,
          theme.marginTop3x,
        ]}>
        {i18n.t('emailConfirm.confirmNote')}
      </MText>
    ) : null;

    return (
      <View
        style={[
          theme.flexContainer,
          theme.paddingTop3x,
          theme.bgPrimaryBackground,
        ]}>
        <InputContainer
          placeholder={i18n.t('settings.currentEmail')}
          onChangeText={this.setEmail}
          value={email}
          editable={!this.state.inProgress}
          testID="emailScreenInput"
          error={valid ? undefined : i18n.t('validation.email')}
          selectTextOnFocus={true}
        />
        {confirmNote}
        <ModalConfirmPassword
          isVisible={this.state.isVisible}
          onSuccess={this.save}
          close={this.dismissModal}
        />
      </View>
    );
  }
}

export default EmailScreen;
