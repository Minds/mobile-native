import React from 'react';

import { View, Text, TextInput, KeyboardAvoidingView } from 'react-native';

import authService from './AuthService';
import { ComponentsStyle } from '../styles/Components';

import i18n from '../common/services/i18n.service';
import delay from '../common/helpers/delay';
import logService from '../common/services/log.service';
import apiService from '../common/services/api.service';
import { observer, useLocalStore } from 'mobx-react';
import { showNotification } from '../../AppMessages';
import Button from '../common/components/Button';
import ThemedStyles from '../styles/ThemedStyles';

type PropsType = {
  onBack: () => void;
  code: string;
  username: string;
};

/**
 * Reset Password Form
 */
const ResetPassword = observer(({ onBack, code, username }: PropsType) => {
  const theme = ThemedStyles.style;
  const localStore = useLocalStore(() => ({
    password: '',
    confirmation: '',
    sending: false,
    sent: false,
    msg: 'Please enter your new password',
    setPassword(password: string) {
      this.password = password;
    },
    setConfirmation(confirmation: string) {
      this.confirmation = confirmation;
    },
    setSending(sending: boolean) {
      this.sending = sending;
    },
    setSent(sent: boolean) {
      this.sent = sent;
    },
    setMsg(msg: string) {
      this.msg = msg;
    },
    async onContinuePress() {
      if (!username || !code) {
        showNotification(i18n.t('errorMessage'), 'warning');
        return;
      }
      if (this.confirmation !== this.password) {
        showNotification(i18n.t('settings.passwordsNotMatch'), 'warning');
        return;
      }

      if (!this.sent) {
        this.setSending(true);
        try {
          const data = await authService.reset(username, this.password, code);
          // clear the cookies (fix future issues with calls)
          await apiService.clearCookies();

          if (data.status === 'success') {
            await delay(100);
            authService.login(username, this.password);
          } else {
            throw data;
          }
        } catch (err) {
          if (err.message) {
            showNotification(err.message, 'warning');
          } else {
            showNotification(i18n.t('errorMessage'), 'warning');
          }
          logService.exception('[ResetPassword]', err);
        } finally {
          this.setSending(false);
        }
      }
    },
  }));

  return (
    <KeyboardAvoidingView behavior="padding" style={theme.paddingHorizontal3x}>
      <Text style={[theme.colorWhite, theme.fontM]}>{localStore.msg}</Text>
      <TextInput
        style={[
          ComponentsStyle.loginInput,
          theme.marginTop2x,
          theme.marginBottom2x,
        ]}
        placeholder={i18n.t('auth.password')}
        returnKeyType={'done'}
        placeholderTextColor="#444"
        underlineColorAndroid="transparent"
        onChangeText={localStore.setPassword}
        autoCapitalize={'none'}
        value={localStore.password}
        secureTextEntry={true}
      />
      <TextInput
        style={[
          ComponentsStyle.loginInput,
          theme.marginTop2x,
          theme.marginBottom2x,
        ]}
        placeholder={i18n.t('auth.confirmpassword')}
        returnKeyType={'done'}
        placeholderTextColor="#444"
        underlineColorAndroid="transparent"
        onChangeText={localStore.setConfirmation}
        autoCapitalize={'none'}
        value={localStore.confirmation}
        secureTextEntry={true}
      />
      <View style={[theme.rowJustifyEnd, theme.marginTop2x]}>
        <Button onPress={onBack} text={i18n.t('goback')} />
        {!localStore.sent && (
          <Button
            onPress={localStore.onContinuePress}
            text={i18n.t('continue')}
            loading={localStore.sending}
            containerStyle={theme.marginLeft4x}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
});

export default ResetPassword;
