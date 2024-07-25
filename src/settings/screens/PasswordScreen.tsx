import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Button, Screen } from '~ui';

import validatePassword from '~/common/helpers/validatePassword';
import PasswordValidator from '~/common/components/password-input/PasswordValidator';
import { isUserError } from '~/common/UserError';
import { showNotification } from '~/../AppMessages';
import PasswordInput from '~/common/components/password-input/PasswordInput';
import { InputContainerImperativeHandle } from '~/common/components/InputContainer';
import sp from '~/services/serviceProvider';

export default observer(function () {
  const theme = sp.styles.style;
  const newPasswordRef = useRef<InputContainerImperativeHandle>(null);
  const confirmPasswordRef = useRef<InputContainerImperativeHandle>(null);
  const navigation = useNavigation();
  const i18n = sp.i18n;

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
      await sp.resolve('auth').validatePassword(store.currentPassword);
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
      await sp.resolve('settingsApi').submitSettings(params);
      store.clearInputs();
      // clear the cookies (fix future issues with calls)
      await sp.api.clearCookies();
      // @ts-ignore
      navigation.popToTop?.();
      showNotification(i18n.t('settings.passwordChanged'), 'success');
    } catch (err) {
      if (!isUserError(err) && err instanceof Error) {
        showNotification(err.message, 'danger');
      }
    }
  }, [i18n, navigation, store]);

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

  return (
    <KeyboardAwareScrollView
      style={[theme.flexContainer, theme.bgPrimaryBackground]}
      contentContainerStyle={theme.paddingTop3x}>
      <Screen>
        {!store.passwordFocused ? (
          <PasswordInput
            placeholder={i18n.t('settings.currentPassword')}
            onChangeText={store.setCurrentPassword}
            onSubmitEditing={newPasswordRef.current?.focus}
            value={store.currentPassword}
            returnKeyLabel={i18n.t('auth.nextLabel')}
            returnKeyType="next"
            testID={'currentPasswordInput'}
            error={store.currentPasswordError}
            style={[theme.paddingBottom7x]}
          />
        ) : (
          <View style={[theme.paddingLeft3x]}>
            <PasswordValidator password={store.newPassword} />
          </View>
        )}
        <PasswordInput
          ref={newPasswordRef}
          placeholder={i18n.t('settings.newPassword')}
          onChangeText={store.setNewPassword}
          onSubmitEditing={confirmPasswordRef.current?.focus}
          value={store.newPassword}
          returnKeyLabel={i18n.t('auth.nextLabel')}
          returnKeyType="next"
          testID={'newPasswordInput'}
          onFocus={store.newPasswordFocus}
          onBlur={store.newPasswordBlurred}
          error={store.newPasswordError}
          noBottomBorder={true}
        />

        <PasswordInput
          ref={confirmPasswordRef}
          placeholder={i18n.t('settings.confirmNewPassword')}
          onChangeText={store.setConfirmationPassword}
          onSubmitEditing={confirmPassword}
          returnKeyLabel={i18n.t('auth.submitLabel')}
          returnKeyType="send"
          value={store.confirmationPassword}
          error={store.confirmationPasswordError}
          testID={'confirmationPasswordPasswordInput'}
          onBlur={store.newPasswordBlurred}
        />
      </Screen>
    </KeyboardAwareScrollView>
  );
});
