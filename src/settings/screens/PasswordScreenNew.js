//@ts-nocheck
import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native-animatable';
import Input from '../../common/components/Input';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import { DISABLE_PASSWORD_INPUTS } from '../../config/Config';
import { useNavigation } from '@react-navigation/native';
import validatePassword from '../../common/helpers/validatePassword';
import authService from '../../auth/AuthService';
import settingsService from '../SettingsService';
import { KeyboardAvoidingView, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import isIphoneX from '../../common/helpers/isIphoneX';

export default function() {
  const CS = ThemedStyles.style;

  const navigation = useNavigation();

  const [currentPassword, setCurrentPassword] = useState('12345678');
  const [newPassword, setNewPassword] = useState('12345678');
  const [confirmationPassword, setConfirmationPassword] = useState('12345678');
  const [error, setError] = useState(false);

  const currentPasswordFocus = useCallback(() => setCurrentPassword(''), []);
  const newPasswordFocus = useCallback(() => setNewPassword(''), []);
  const confirmationPasswordFocus = useCallback(() => setConfirmationPassword(''), []);
  const clearInputs = useCallback(() => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmationPassword('');
  }, [setCurrentPassword, setNewPassword, setConfirmationPassword]);

  let currentPasswordInput = '';
  let newPasswordInput = '';

  const confirmPassword = useCallback(async () => {
    // missing data
    if (!currentPassword || !newPassword || !confirmationPassword) {
      return;
    }

    // current password doesn't match
    try {
      await authService.validatePassword(currentPassword);
    } catch(err) {
      currentPasswordInput.showError();
      return;
    }

    // password format is invalid
    if (!validatePassword(newPassword).all) {
      setError(true);
      return;
    }

    // passwords not matching
    if (newPassword !== confirmationPassword) {
      newPasswordInput.showError();
    }

    const params = {
      password: currentPassword,
      new_password: newPassword
    }

    try {
      await settingsService.submitSettings(params);
      clearInputs();
      Alert.alert(i18n.t('success'), i18n.t('settings.passwordChanged'));
    } catch (err) {
      Alert.alert('Error', err.message);
    }

  }, [currentPassword, newPassword, confirmationPassword, clearInputs]);

  /**
   * Set save button on header right
   */
  navigation.setOptions({ 
    headerRight: () => (
      <Text onPress={confirmPassword} style={[
        CS.colorLink,
        CS.fontL,
        CS.bold,
      ]}>{i18n.t('save')}</Text>
    )
  });

  return (
    <ScrollView style={[CS.flexContainer, CS.backgroundPrimary]}>
    <KeyboardAvoidingView style={[CS.flexContainer, CS.paddingTop3x]} behavior="position" keyboardVerticalOffset={isIphoneX ? 100 : 64}>
      <View style={[CS.paddingLeft3x, CS.paddingTop3x, CS.backgroundSecondary, CS.border, CS.borderPrimary]}>
        <Input
          style={[CS.border0x, styles.inputHeight]}
          labelStyle={[CS.colorSecondaryText, CS.fontL, CS.paddingLeft]}
          placeholder={i18n.t('settings.currentPassword')}
          onChangeText={setCurrentPassword}
          value={currentPassword}
          //editable={!this.state.inProgress}
          testID="currentPasswordInput"
          clearTextOnFocus={true}
          secureTextEntry={!DISABLE_PASSWORD_INPUTS} // e2e workaround
          //editable={!this.state.inProgress}
          onFocus={currentPasswordFocus}
          onError={i18n.t('settings.invalidPassword')}
          ref={(input) => currentPasswordInput = input}
          //onBlur={this.blurPassword}
        />
      </View>
      <View style={[CS.paddingLeft3x, CS.paddingTop3x, CS.backgroundSecondary, CS.border, CS.borderPrimary, CS.marginTop7x]}>
        <Input
          style={[CS.border0x, styles.inputHeight]}
          labelStyle={[CS.colorSecondaryText, CS.fontL, CS.paddingLeft]}
          placeholder={i18n.t('settings.newPassword')}
          onChangeText={setNewPassword}
          value={newPassword}
          testID="newPasswordInput"
          clearTextOnFocus={true}
          secureTextEntry={!DISABLE_PASSWORD_INPUTS} // e2e workaround
          onFocus={newPasswordFocus}
          onError={i18n.t('settings.passwordsNotMatch')}
          ref={(input) => newPasswordInput = input}
        />
      </View>
      <View style={[CS.paddingLeft3x, CS.paddingTop3x, CS.backgroundSecondary, CS.border, CS.borderPrimary]}>
        <Input
          style={[CS.border0x, styles.inputHeight]}
          labelStyle={[CS.colorSecondaryText, CS.fontL, CS.paddingLeft]}
          placeholder={i18n.t('settings.confirmNewPassword')}
          onChangeText={setConfirmationPassword}
          value={confirmationPassword}
          testID="confirmationPasswordPasswordInput"
          clearTextOnFocus={true}
          secureTextEntry={!DISABLE_PASSWORD_INPUTS} // e2e workaround
          onFocus={confirmationPasswordFocus}
        />
      </View>

      <View style={[CS.paddingLeft3x, CS.paddingTop3x]}>
        <Text style={[error ? CS.colorAlert : CS.colorSecondaryText, CS.fontL]}>{i18n.t('settings.passwordFormat')}</Text>
      </View>
    </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = {
  inputHeight: {
    height: 40,
  },
};