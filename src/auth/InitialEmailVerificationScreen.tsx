import { useBackHandler } from '@react-native-community/hooks';
import { showNotification } from 'AppMessages';
import { runInAction } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';
import React, { useCallback, useEffect } from 'react';
import CodeConfirmScreen from '~/common/screens/CodeConfirmScreen';
import apiService, { TwoFactorError } from '~/common/services/api.service';
import i18n from '~/common/services/i18n.service';
import sessionService from '~/common/services/session.service';
import { B1 } from '~/common/ui';
import AuthService from './AuthService';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import NavigationService from '../navigation/NavigationService';

/**
 * Initial email verification screen
 *
 * It uses the 2FA endpoints but without the api.service interceptor modal
 * to be able to transition to this component as the initial screen
 */
const InitialEmailVerificationScreen = () => {
  // Disable back button on Android
  useBackHandler(
    useCallback(() => {
      return true;
    }, []),
  );

  // Local store
  const localStore = useLocalStore(() => ({
    code: '',
    emailKey: '',
    codeSentAt: undefined as number | undefined,
    error: false,
    /**
     * Whether email resend is in progress
     */
    resending: false,
    verify: async (code?: string) => {
      const headers = code
        ? {
            'X-MINDS-2FA-CODE': code,
            'X-MINDS-EMAIL-2FA-KEY': localStore.emailKey,
          }
        : undefined;
      try {
        await apiService
          .setTwoFactorHandlingEnabled(false)
          .rawPost('api/v3/email/confirm', {}, headers);

        sessionService.getUser().setEmailConfirmed(true);
      } catch (error) {
        if (error instanceof TwoFactorError) {
          localStore.emailKey = error.message;
          if (localStore.code) {
            throw error;
          }
        }
      } finally {
        apiService.setTwoFactorHandlingEnabled(true);
      }
    },
    setCode(code: string) {
      localStore.code = code;
    },
    setError(error: boolean) {
      localStore.error = error;
    },
    cancel: () => {
      AuthService.logout();
    },
    /**
     * Ensures we don't resend the code more than once every 10 seconds
     */
    get canResendRateLimit() {
      if (localStore.codeSentAt && Date.now() - localStore.codeSentAt < 10000) {
        return false;
      }

      return true;
    },
    /**
     * Resends email confirmation code
     */
    resend(): void {
      if (!localStore.canResendRateLimit) {
        showNotification(i18n.t('auth.waitMoment'), 'danger', undefined);
        return;
      }

      // resends the same request (the backend will resend the email confirmation)
      localStore.resending = true;

      localStore
        .verify()
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
            localStore.codeSentAt = Date.now();
            localStore.resending = false;
          });
        });
    },
    async submit() {
      localStore.error = false;
      if (!localStore.code) {
        localStore.error = true;
        return;
      }
      try {
        await localStore.verify(localStore.code);
        localStore.code = '';
      } catch (err) {
        localStore.error = true;
      }
    },
  }));

  // verify on mount
  useEffect(() => {
    localStore.verify();
  }, [localStore]);

  const detail = (
    <>
      <B1 color="secondary" vertical="XL" horizontal="L">
        {i18n.t('onboarding.verifyEmailDescription2')}
        <B1
          color={localStore.resending ? 'tertiary' : 'link'}
          onPress={localStore.resend}>
          {' '}
          {i18n.t('onboarding.resend')}
        </B1>
      </B1>

      <B1
        horizontal="L"
        color="link"
        onPress={() =>
          NavigationService.push('ChangeEmail', {
            onSubmit: () => localStore.resend(),
          })
        }>
        Change email
      </B1>
    </>
  );
  return (
    <CodeConfirmScreen
      onBack={AuthService.justRegistered ? undefined : localStore.cancel}
      title={i18n.t('onboarding.verifyEmailAddress')}
      onVerify={localStore.submit}
      description={i18n.t('auth.2faEmailDescription')}
      maxLength={6}
      keyboardType={'numeric'}
      placeholder={i18n.t('auth.authCode')}
      onChangeText={localStore.setCode}
      error={localStore.error ? i18n.t('auth.2faInvalid') : ''}
      value={localStore.code}
      detail={detail}
    />
  );
};

export default withErrorBoundaryScreen(
  observer(InitialEmailVerificationScreen),
  'InitialEmailVerificationScreen',
);
