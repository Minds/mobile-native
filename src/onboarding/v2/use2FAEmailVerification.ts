import { showNotification } from 'AppMessages';
import { runInAction } from 'mobx';
import { useLocalStore } from 'mobx-react';
import AuthService from '~/auth/AuthService';
import { TwoFactorError } from '~/common/services/ApiErrors';
import apiService from '~/common/services/api.service';
import sessionService from '~/common/services/session.service';
import i18n from '~/utils/locales';

export const use2FAEmailVerification = () => {
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

  return localStore;
};
