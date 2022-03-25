import { showNotification } from '../../../AppMessages';
import delay from '../../common/helpers/delay';
import validatePassword from '../../common/helpers/validatePassword';
import apiService from '../../common/services/api.service';
import i18n from '../../common/services/i18n.service';
import logService from '../../common/services/log.service';
import AuthService from '../AuthService';

type StepsType = 'inputUser' | 'emailSended' | 'inputPassword';

const showError = (error: string) =>
  showNotification(error, 'danger', undefined, 'top');

const createLocalStore = () => ({
  currentStep: 'inputUser' as StepsType,
  username: '',
  code: '',
  password: '',
  sending: false,
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
    return i18n.t(
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
        await AuthService.forgot(this.username);
        this.setSent();
        if (this.currentStep === 'inputUser') {
          this.navToEmailSended();
        }
      } catch (err: any) {
        const message =
          (typeof err === 'object' && err !== null && err.message) ||
          i18n.t('messenger.errorDirectMessage');
        showError(message);
        logService.exception('[ForgotPassword]', err);
      } finally {
        this.setSending(false);
      }
    } else {
      showError(i18n.t('auth.waitMoment'));
    }
  },
  async resetPassword() {
    if (!this.username || !this.code) {
      showError(i18n.t('errorMessage'));
      return false;
    }

    if (!validatePassword(this.password).all) {
      showError(i18n.t('auth.invalidPassword'));
      return false;
    }

    if (this.canSendAgain) {
      this.setSending(true);
      let success = false;
      try {
        const data = await AuthService.reset(
          this.username,
          this.password,
          this.code,
        );
        if (data.status === 'success') {
          this.setSent();
          success = true;
        } else {
          throw data;
        }
      } catch (err: any) {
        if (err.message) {
          showError(err.message);
        } else {
          showError(i18n.t('errorMessage'));
        }
        logService.exception('[ResetPassword]', err);
      } finally {
        this.setSending(false);
        if (success) {
          this.setPassword('');
          this.setUsername('');
          const response = {
            success,
            login: async () => {
              showNotification(i18n.t('auth.waitLogin'), 'info', 3000, 'top');

              await delay(150);
              // clear the cookies (fix future issues with calls)
              await apiService.clearCookies();
              await delay(300);
              AuthService.login(this.username, this.password);
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
