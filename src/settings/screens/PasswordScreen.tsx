import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer, useLocalStore } from 'mobx-react';

import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import validatePassword from '../../common/helpers/validatePassword';
import authService from '../../auth/AuthService';
import settingsService from '../SettingsService';
import PasswordValidator from '../../common/components/password-input/PasswordValidator';
import { isUserError } from '../../common/UserError';
import { showNotification } from '../../../AppMessages';
import { Button } from '~ui';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PasswordInput from '~/common/components/password-input/PasswordInput';
import apiService from '~/common/services/api.service';

export default observer(function () {
  const theme = ThemedStyles.style;

  const navigation = useNavigation();

  const store = useLocalStore(() => ({
    currentPassword: '',
    currentPasswordError: '',
    newPassword: '',
    newPasswordError: '',
    confirmationPassword: '',
    confirmationPasswordError: '',
    passwordFocused: false,
    setCurrentPassword(password) {
      store.currentPasswordError = '';
      store.currentPassword = password;
    },
    setCurrentPasswordError(error) {
      store.currentPasswordError = error;
    },
    setNewPassword(password) {
      store.newPasswordError = '';
      store.newPassword = password;
    },
    setNewPasswordError(error) {
      store.newPasswordError = error;
    },
    setConfirmationPasswordError(error) {
      store.confirmationPasswordError = error;
    },
    setConfirmationPassword(password) {
      store.confirmationPasswordError = '';
      store.confirmationPassword = password;
    },
    setPasswordFocused(value) {
      store.passwordFocused = value;
    },
    clearInputs() {
      store.setCurrentPassword('');
      store.setNewPassword('');
      store.setConfirmationPassword('');
    },
    newPasswordBlurred() {
      store.setPasswordFocused(false);
    },
    newPasswordFocus() {
      store.setPasswordFocused(true);
    },
  }));

  const confirmPassword = useCallback(async () => {
    // missing data

    if (!store.currentPassword) {
      store.setCurrentPasswordError(i18n.t('auth.fieldRequired'));
    }
    if (!store.newPassword) {
      store.setNewPasswordError(i18n.t('auth.fieldRequired'));
    }
    if (!store.confirmationPassword) {
      store.setConfirmationPasswordError(i18n.t('auth.fieldRequired'));
    }

    if (
      !store.currentPassword ||
      !store.newPassword ||
      !store.confirmationPassword
    ) {
      return;
    }

    // current password doesn't match
    try {
      store.setCurrentPasswordError('');
      await authService.validatePassword(store.currentPassword);
    } catch (err) {
      store.setCurrentPasswordError(i18n.t('auth.invalidPassword'));
      return;
    }

    // password format is invalid
    if (!validatePassword(store.newPassword).all) {
      store.setNewPasswordError(i18n.t('settings.invalidPassword'));
      return;
    } else {
      store.setNewPasswordError('');
    }

    // passwords not matching
    if (store.newPassword !== store.confirmationPassword) {
      store.setNewPasswordError(i18n.t('settings.passwordsNotMatch'));
      return;
    } else {
      store.setNewPasswordError('');
    }

    const params = {
      password: store.currentPassword,
      new_password: store.newPassword,
    };

    try {
      await settingsService.submitSettings(params);
      store.clearInputs();
      // clear the cookies (fix future issues with calls)
      await apiService.clearCookies();
      // @ts-ignore
      navigation.popToTop?.();
      showNotification(i18n.t('settings.passwordChanged'), 'success');
    } catch (err) {
      if (!isUserError(err) && err instanceof Error) {
        showNotification(err.message, 'danger');
      }
    }
  }, [store]);

  /**
   * Set save button on header right
   */
  navigation.setOptions({
    headerRight: () => (
      <Button type="action" mode="flat" size="small" onPress={confirmPassword}>
        {i18n.t('save')}
      </Button>
    ),
  });

  const subContainer = !store.passwordFocused ? [theme.paddingTop7x] : [];

  return (
    <KeyboardAwareScrollView
      style={[theme.flexContainer, theme.bgPrimaryBackground]}
      contentContainerStyle={theme.paddingTop3x}>
      {!store.passwordFocused && (
        <PasswordInput
          placeholder={i18n.t('settings.currentPassword')}
          onChangeText={store.setCurrentPassword}
          value={store.currentPassword}
          testID={'currentPasswordInput'}
          error={store.currentPasswordError}
        />
      )}
      <View style={subContainer}>
        {store.passwordFocused && (
          <View style={[theme.paddingLeft3x]}>
            <PasswordValidator password={store.newPassword} />
          </View>
        )}
        <PasswordInput
          placeholder={i18n.t('settings.newPassword')}
          onChangeText={store.setNewPassword}
          value={store.newPassword}
          testID={'newPasswordInput'}
          onFocus={store.newPasswordFocus}
          onBlur={store.newPasswordBlurred}
          error={store.newPasswordError}
          noBottomBorder={true}
        />

        <PasswordInput
          placeholder={i18n.t('settings.confirmNewPassword')}
          onChangeText={store.setConfirmationPassword}
          value={store.confirmationPassword}
          error={store.confirmationPasswordError}
          testID={'confirmationPasswordPasswordInput'}
          onBlur={store.newPasswordBlurred}
        />
      </View>
    </KeyboardAwareScrollView>
  );
});
