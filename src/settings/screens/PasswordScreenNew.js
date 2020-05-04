//@ts-nocheck
import React, { useCallback } from 'react';
import { observer, useLocalStore } from 'mobx-react';
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
import PasswordValidator from '../../common/components/PasswordValidator';

export default observer(function () {
  const theme = ThemedStyles.style;

  const navigation = useNavigation();

  const store = useLocalStore(() => ({
    currentPassword: '',
    newPassword: '',
    confirmationPassword: '',
    passwordFocused: false,
    error: false,
    setCurrentPassword(password) {
      store.currentPassword = password;
    },
    setNewPassword(password) {
      store.newPassword = password;
    },
    setConfirmationPassword(password) {
      store.confirmationPassword = password;
    },
    setPasswordFocused(value) {
      store.passwordFocused = value;
    },
    setError(password) {
      store.currentPassword = password;
    },
    clearInputs() {
      store.setCurrentPassword('');
      store.setNewPassword('');
      store.setConfirmationPassword('');
    },
    currentPasswordFocus() {
      store.setCurrentPassword('');
    },
    newPasswordBlurred() {
      store.setPasswordFocused(false);
    },
    confirmationPasswordFocus() {
      store.setConfirmationPassword('');
    },
    newPasswordFocus() {
      store.setNewPassword('');
      store.setPasswordFocused(true);
    },
  }));

  let currentPasswordInput = '';
  let newPasswordInput = '';

  const confirmPassword = useCallback(async () => {
    // missing data
    if (
      !store.currentPassword ||
      !store.newPassword ||
      !store.confirmationPassword
    ) {
      return;
    }

    // current password doesn't match
    try {
      await authService.validatePassword(store.currentPassword);
    } catch (err) {
      currentPasswordInput.showError();
      return;
    }

    // password format is invalid
    if (!validatePassword(store.newPassword).all) {
      store.setError(true);
      return;
    }

    // passwords not matching
    if (store.newPassword !== store.confirmationPassword) {
      newPasswordInput.showError();
    }

    const params = {
      password: store.currentPassword,
      new_password: store.newPassword,
    };

    try {
      await settingsService.submitSettings(params);
      store.clearInputs();
      Alert.alert(i18n.t('success'), i18n.t('settings.passwordChanged'));
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  }, [store, currentPasswordInput, newPasswordInput]);

  /**
   * Set save button on header right
   */
  navigation.setOptions({
    headerRight: () => (
      <Text
        onPress={confirmPassword}
        style={[theme.colorLink, theme.fontL, theme.bold]}>
        {i18n.t('save')}
      </Text>
    ),
  });

  const getInput = useCallback(
    (props) => {
      const wrapperStyle = [
        theme.paddingLeft3x,
        theme.paddingTop3x,
        theme.backgroundSecondary,
        theme.border,
        theme.borderPrimary,
      ];

      const labelStyle = [
        theme.colorSecondaryText,
        theme.fontL,
        theme.paddingLeft,
      ];

      return (
        <View style={wrapperStyle}>
          <Input
            style={[theme.border0x, styles.inputHeight]}
            labelStyle={labelStyle}
            placeholder={props.placeholder}
            onChangeText={props.onChangeText}
            value={props.value}
            testID={props.testID}
            clearTextOnFocus={true}
            secureTextEntry={!DISABLE_PASSWORD_INPUTS}
            onFocus={props.onFocus}
            onBlur={props.onBlur ?? (() => {})}
            onError={props.onError ?? (() => {})}
            ref={props.ref ?? (() => {})}
          />
        </View>
      );
    },
    [theme],
  );

  return (
    <ScrollView style={[theme.flexContainer, theme.backgroundPrimary]}>
      <KeyboardAvoidingView
        style={[theme.flexContainer, theme.paddingTop3x]}
        behavior="position"
        keyboardVerticalOffset={isIphoneX ? 100 : 64}>
        {store.passwordFocused ? (
          <View style={[theme.paddingLeft3x]}>
            <PasswordValidator password={store.newPassword} />
          </View>
        ) : (
          getInput({
            placeholder: i18n.t('settings.currentPassword'),
            onChangeText: store.setCurrentPassword,
            value: store.currentPassword,
            testID: 'currentPasswordInput',
            onFocus: store.currentPasswordFocus,
            onError: i18n.t('settings.invalidPassword'),
            ref: (input) => (currentPasswordInput = input),
          })
        )}
        {getInput({
          placeholder: i18n.t('settings.newPassword'),
          onChangeText: store.setNewPassword,
          value: store.newPassword,
          testID: 'newPasswordInput',
          onFocus: store.newPasswordFocus,
          onBlur: store.newPasswordBlurred,
          onError: i18n.t('settings.passwordsNotMatch'),
          ref: (input) => (newPasswordInput = input),
        })}
        {getInput({
          placeholder: i18n.t('settings.confirmNewPassword'),
          onChangeText: store.setConfirmationPassword,
          value: store.confirmationPassword,
          testID: 'confirmationPasswordPasswordInput',
          onFocus: store.confirmationPasswordFocus,
          onBlur: store.newPasswordBlurred,
        })}
      </KeyboardAvoidingView>
    </ScrollView>
  );
});

const styles = {
  inputHeight: {
    height: 40,
  },
};
