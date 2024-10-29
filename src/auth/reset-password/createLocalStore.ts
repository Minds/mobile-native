import { showNotification } from '../../../AppMessages';
import delay from '~/common/helpers/delay';
import validatePassword from '~/common/helpers/validatePassword';
import sp from '~/services/serviceProvider';

type StepsType = 'inputUser' | 'emailSended' | 'inputPassword';

const showError = (error: string) =>
  showNotification(error, 'danger', undefined);

const createLocalStore = () => ({
  currentStep: 'inputUser' as StepsType,
  username: '',
  code: '',
  password: '',
  sending: false,
  rateLimited: false,
  sent: 0,
  focused: false,
  setPassword(password: string) {
    this.password = password;
  },
  setUsername(username: string) {
    this.username = username;
  },
  navToInputUser() {
    this.currentStep = 'inputUser';
  },
  navToEmailSended() {
    this.currentStep = 'emailSended';
  },
  navToInputPassword(username: string, code: string) {
    this.username = username;
    this.code = code;
    this.currentStep = 'inputPassword';
  },
  setSending(sending) {
    this.sending = sending;
  },
  setSent() {
    this.sent = Date.now();
  },
  get title() {
    return sp.i18n.t(
      `auth.${
        this.currentStep !== 'inputPassword'
          ? 'resetPassword'
          : 'createNewPassword'
      }`,
    );
  },
  get canSendAgain() {
    const now = Date.now();
    return now - this.sent > 10000;
  },
  focus() {
    this.focused = true;
  },
  blur() {
    this.focused = false;
  },
  async sendEmail() {
    if (this.canSendAgain) {
      this.setSending(true);
      try {
        await sp.resolve('auth').forgot(this.username);
        this.setSent();
        if (this.currentStep === 'inputUser') {
          this.navToEmailSended();
        }
      } catch (err: any) {
        const message =
          (typeof err === 'object' && err !== null && err.message) ||
          sp.i18n.t('messenger.errorDirectMessage');
        if (
          message === 'You have exceed the rate limit. Please try again later.'
        ) {
          this.rateLimited = true;
          showError(sp.i18n.t('auth.rateLimit'));
          sp.navigation.goBack();
          return;
        }
        showError(message);
        sp.log.exception('[ForgotPassword]', err);
      } finally {
        this.setSending(false);
      }
    } else {
      showError(sp.i18n.t('auth.waitMoment'));
    }
  },
  async resetPassword() {
    if (!this.username || !this.code) {
      showError(sp.i18n.t('errorMessage'));
      return false;
    }

    if (!validatePassword(this.password).all) {
      showError(sp.i18n.t('auth.invalidPassword'));
      return false;
    }

    if (this.canSendAgain) {
      this.setSending(true);
      let success = false;
      try {
        const data = await sp
          .resolve('auth')
          .reset(this.username, this.password, this.code);
        if (data.status === 'success') {
          this.setSent();
          success = true;
        } else {
          throw data;
        }
      } catch (err: any) {
        console.log('err', err);
        if (err.message) {
          showError(err.message);
        } else {
          showError(sp.i18n.t('errorMessage'));
        }
        sp.log.exception('[ResetPassword]', err);
      } finally {
        this.setSending(false);
        if (success) {
          const password = this.password;
          const username = this.username;
          this.setPassword('');
          this.setUsername('');
          const response = {
            success,
            login: async () => {
              showNotification(sp.i18n.t('auth.waitLogin'), 'info', 3000);
              await delay(150);
              // clear the cookies (fix future issues with calls)
              await sp.api.clearCookies();
              await delay(300);
              sp.resolve('auth').login(username, password);
            },
          };
          return response;
        }
        return false;
      }
    }
  },
});

export type ResetPasswordStore = ReturnType<typeof createLocalStore>;
export default createLocalStore;
