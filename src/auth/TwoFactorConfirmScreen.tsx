import React, { useCallback } from 'react';
import { runInAction } from 'mobx';
import { RouteProp } from '@react-navigation/core';
import { observer, useLocalStore } from 'mobx-react';
import { useBackHandler } from '@react-native-community/hooks';

import { B1 } from '~ui';
import { showNotification } from 'AppMessages';
import i18n from '../common/services/i18n.service';
import { TwoFactorError } from '~/common/services/ApiErrors';
import { RootStackParamList } from '../navigation/NavigationTypes';
import CodeConfirmScreen from '~/common/screens/CodeConfirmScreen';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

type ForgotScreenRouteProp = RouteProp<
  RootStackParamList,
  'TwoFactorConfirmation'
>;

type PropsType = {
  route: ForgotScreenRouteProp;
  navigation: any;
};

/**
 * Two factor confirmation modal screen
 */
const TwoFactorConfirmScreen = observer(({ route, navigation }: PropsType) => {
  const { onConfirm, title, onCancel, mfaType, oldCode, showRecovery } =
    route.params;

  // Disable back button on Android
  useBackHandler(
    useCallback(() => {
      return true;
    }, []),
  );

  // Local store
  const localStore = useLocalStore(() => ({
    code: oldCode,
    recovery: false,
    codeSentAt: undefined as number | undefined,
    error: !!oldCode,
    /**
     * Whether email resend is in progress
     */
    resending: false,
    setCode(code: string) {
      this.code = code;
    },
    toggleRecovery() {
      this.recovery = !this.recovery;
    },
    setError(error: boolean) {
      this.error = error;
    },
    cancel: () => {
      onCancel && onCancel();
      navigation.goBack();
    },
    /**
     * Ensures we don't resend the code more than once every 10 seconds
     */
    get canResendRateLimit() {
      if (this.codeSentAt && Date.now() - this.codeSentAt < 10000) {
        return false;
      }

      return true;
    },
    /**
     * Resends email confirmation code
     */
    resend(): void {
      if (!this.canResendRateLimit) {
        showNotification(i18n.t('auth.waitMoment'), 'danger', undefined);
        return;
      }

      // resends the same request (the backend will resend the email confirmation)
      this.resending = true;
      onConfirm('')
        .then(() => {
          // this code won't get called because the backend is always throwing an error here. Please refer to .catch
          showNotification(i18n.t('emailConfirm.sent'), 'info');
        })
        .catch(e => {
          // the backend is always returning an error, se we have no other option but to optimistically consider this a success
          if (e instanceof TwoFactorError) {
            showNotification(i18n.t('emailConfirm.sent'), 'info');
          }
        })
        .finally(() => {
          runInAction(() => {
            this.codeSentAt = Date.now();
            this.resending = false;
          });
        });
    },
    submit() {
      this.error = false;
      if (!this.code) {
        this.error = true;
        return;
      }
      try {
        onConfirm(this.code);
        navigation.goBack();
        this.code = '';
      } catch (err) {
        this.error = true;
      }
    },
  }));

  const titleText =
    !title && mfaType === 'email'
      ? i18n.t('onboarding.verifyEmailAddress')
      : title || i18n.t('auth.2faRequired');

  const description =
    mfaType === 'email'
      ? i18n.t('auth.2faEmailDescription')
      : mfaType === 'totp'
      ? i18n.t('auth.2faAppDescription')
      : i18n.t('auth.2faSmsDescription');

  const detail =
    mfaType === 'email' ? (
      <B1 color="secondary" vertical="XL" horizontal="L">
        {i18n.t('onboarding.verifyEmailDescription2')}
        <B1
          color={localStore.resending ? 'tertiary' : 'link'}
          onPress={localStore.resend}>
          {' '}
          {i18n.t('onboarding.resend')}
        </B1>
      </B1>
    ) : mfaType === 'totp' && showRecovery ? (
      <B1 color="secondary" vertical="XL" horizontal="L">
        {i18n.t('auth.recoveryDesc')}
        <B1 color={'link'} onPress={localStore.toggleRecovery}>
          {' '}
          {localStore.recovery
            ? i18n.t('auth.authCode')
            : i18n.t('auth.recoveryCode')}
        </B1>
      </B1>
    ) : null;

  return (
    <CodeConfirmScreen
      onBack={localStore.cancel}
      title={titleText}
      onVerify={localStore.submit}
      description={description}
      maxLength={localStore.recovery ? undefined : 6}
      keyboardType={localStore.recovery ? undefined : 'numeric'}
      placeholder={
        localStore.recovery
          ? i18n.t('auth.recoveryCode')
          : i18n.t('auth.authCode')
      }
      onChangeText={localStore.setCode}
      error={localStore.error ? i18n.t('auth.2faInvalid') : ''}
      value={localStore.code}
      detail={detail}
    />
  );
});

export default withErrorBoundaryScreen(
  TwoFactorConfirmScreen,
  'TwoFactorConfirmationScreen',
);
