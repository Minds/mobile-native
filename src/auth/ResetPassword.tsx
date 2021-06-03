import React from 'react';

import { View, Text, KeyboardAvoidingView } from 'react-native';

import authService from './AuthService';

import i18n from '../common/services/i18n.service';
import delay from '../common/helpers/delay';
import logService from '../common/services/log.service';
import apiService from '../common/services/api.service';
import { observer, useLocalStore } from 'mobx-react';
import { showNotification } from '../../AppMessages';
import Button from '../common/components/Button';
import ThemedStyles from '../styles/ThemedStyles';
import InputContainer from '../common/components/InputContainer';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    msg: i18n.t('auth.newPassword'),
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
    async onContinuePress() {
      if (!username || !code) {
        showNotification(i18n.t('errorMessage'), 'warning', 3000, 'top');
        return;
      }
      if (this.confirmation !== this.password) {
        showNotification(
          i18n.t('settings.passwordsNotMatch'),
          'warning',
          3000,
          'top',
        );
        return;
      }

      if (!this.sent) {
        this.setSending(true);
        try {
          const data = await authService.reset(username, this.password, code);
          showNotification(i18n.t('auth.waitLogin'), 'info', 3000, 'top');
          await delay(150);
          // clear the cookies (fix future issues with calls)
          await apiService.clearCookies();

          if (data.status === 'success') {
            this.setSent(true);
            await delay(300);
            authService.login(username, this.password);
          } else {
            throw data;
          }
        } catch (err) {
          if (err.message) {
            showNotification(err.message, 'warning', 3000, 'top');
          } else {
            showNotification(i18n.t('errorMessage'), 'warning', 3000, 'top');
          }
          logService.exception('[ResetPassword]', err);
        } finally {
          this.setSending(false);
        }
      }
    },
  }));

  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior="padding">
        <Text style={titleStyle}>{localStore.msg}</Text>

        <InputContainer
          autoFocus
          containerStyle={styles.inputBackground}
          style={theme.colorWhite}
          placeholder={i18n.t('auth.password')}
          returnKeyType={'done'}
          onChangeText={localStore.setPassword}
          autoCapitalize={'none'}
          value={localStore.password}
          secureTextEntry={true}
          noBottomBorder
        />
        <InputContainer
          containerStyle={styles.inputBackground}
          style={theme.colorWhite}
          placeholder={i18n.t('auth.confirmpassword')}
          returnKeyType={'done'}
          onChangeText={localStore.setConfirmation}
          autoCapitalize={'none'}
          value={localStore.confirmation}
          secureTextEntry={true}
        />
        <View style={[theme.rowJustifyEnd, theme.marginTop2x]}>
          {!localStore.sent && (
            <>
              <Button
                onPress={onBack}
                text={i18n.t('goback')}
                large
                transparent
              />
              <Button
                onPress={localStore.onContinuePress}
                text={i18n.t('continue')}
                loading={localStore.sending}
                containerStyle={continueStyle}
                large
                transparent
              />
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

const titleStyle = ThemedStyles.combine(
  'fontXXL',
  'colorWhite',
  'marginTop4x',
  'marginBottom8x',
  'marginHorizontal3x',
);

const continueStyle = ThemedStyles.combine('marginLeft4x', 'marginRight3x', {
  width: 138,
});

export default ResetPassword;
