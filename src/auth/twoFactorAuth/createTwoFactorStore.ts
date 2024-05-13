import { Linking } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import SettingsService from '~/settings/SettingsService';
import { showNotification } from '../../../AppMessages';
import apiService from '../../common/services/api.service';
import i18n from '../../common/services/i18n.service';
import logService from '../../common/services/log.service';
import sessionService from '../../common/services/session.service';
import twoFactorAuthenticationService from '../../common/services/two-factor-authentication.service';
import authService from '../AuthService';
export type Options = 'app' | 'sms' | 'email' | 'disable';

// Used to 'navigate' between forms inside loginscreen
export type TwoFactorAuthSteps = 'login' | 'authCode' | 'recoveryCode';

const createTwoFactorStore = () => ({
  loaded: false,
  loadError: false,
  loading: false,
  selectedOption: 'app' as Options,
  secret: '',
  appCode: '',
  appAuthEnabled: false,
  smsAuthEnabled: false,
  recoveryCode: '',
  error: false,
  twoFactorAuthStep: 'login' as TwoFactorAuthSteps,
  smsSecret: '',
  username: '',
  password: '',
  setSelected(option: Options) {
    this.selectedOption = option;
  },
  setSecret(secret: string) {
    this.secret = secret;
  },
  setAppCode(appCode: string) {
    this.appCode = appCode;
  },
  has2fa(has2fa: { sms: boolean; totp: boolean }) {
    this.loaded = true;
    if (has2fa.totp) {
      this.appAuthEnabled = true;
    } else if (has2fa.sms) {
      this.smsAuthEnabled = true;
    }
  },
  async load() {
    this.loadError = false;
    try {
      const settings: any = await SettingsService.getSettings();
      if (settings && settings.channel) {
        this.has2fa(settings.channel.has2fa);
      }
    } catch (error) {
      this.loadError = true;
      logService.exception(error);
    }
  },
  get has2faEnabled() {
    return this.appAuthEnabled || this.smsAuthEnabled;
  },
  copySecret() {
    Clipboard.setStringAsync(this.secret);
    showNotification('Secret copied to clipboard', 'success');
    Linking.openURL(
      `otpauth://totp/Minds.com?secret=${this.secret}&issuer=${
        sessionService.getUser().username
      }`,
    );
  },
  copyRecoveryCode() {
    Clipboard.setStringAsync(this.recoveryCode);
    showNotification('Recovery code copied to clipboard', 'success');
  },
  async fetchSecret() {
    const response = <any>await apiService.get('api/v3/security/totp/new');
    if (!response.secret) {
      throw new Error("Couldn't fetch a secret");
    }
    this.setSecret(response.secret);
  },
  async submitCode(onComplete: Function) {
    try {
      const response = <any>await apiService.post('api/v3/security/totp/new', {
        code: this.appCode,
        secret: this.secret,
      });
      if (response.recovery_code) {
        this.recoveryCode = response.recovery_code;
        onComplete();
      }
    } catch (err) {
      logService.exception(err);
    }
  },
  async disable2fa(onComplete: Function, password: string) {
    try {
      this.error = false;

      if (this.appAuthEnabled) {
        <any>await apiService.delete('api/v3/security/totp', {
          code: this.appCode,
        });
      } else {
        await twoFactorAuthenticationService.remove(password);
      }
      this.appAuthEnabled = false;
      this.smsAuthEnabled = false;
      onComplete();
    } catch (err) {
      logService.exception(err);
      this.error = true;
      if (err instanceof Error) {
        showNotification(err.message, 'warning');
      }
    } finally {
      this.setAppCode('');
      this.setLoading(false);
    }
  },
  setRecoveryCode(recoveryCode: string) {
    this.recoveryCode = recoveryCode;
  },
  handleBackButton() {
    if (this.twoFactorAuthStep === 'authCode') {
      this.twoFactorAuthStep = 'login';
      return;
    }
    if (this.twoFactorAuthStep === 'recoveryCode') {
      this.twoFactorAuthStep = 'authCode';
      return;
    }
  },
  handleVerify() {
    if (this.twoFactorAuthStep === 'authCode') {
      return;
    }
    if (this.twoFactorAuthStep === 'recoveryCode') {
      this.useRecoveryCode();
      return;
    }
  },
  showTwoFactorForm(secret: string, username: string, password: string) {
    if (secret) {
      this.smsSecret = secret;
      this.smsAuthEnabled = true;
    } else {
      this.appAuthEnabled = true;
    }
    this.username = username;
    this.password = password;
    this.twoFactorAuthStep = 'authCode';
  },
  showRecoveryForm() {
    this.twoFactorAuthStep = 'recoveryCode';
  },
  setLoading(loading: boolean) {
    this.loading = loading;
  },
  setAuthEnabled(method: Options) {
    if (method === 'app') {
      this.appAuthEnabled = true;
    } else if (method === 'sms') {
      this.smsAuthEnabled = true;
    }
  },
  setAuthDisabled() {
    this.appAuthEnabled = false;
    this.smsAuthEnabled = false;
  },
  async useRecoveryCode() {
    this.setLoading(true);
    try {
      const response = <any>await apiService.post(
        'api/v3/security/totp/recovery',
        {
          username: this.username,
          password: this.password,
          recovery_code: this.recoveryCode,
        },
      );
      if (!response.matches) {
        throw new Error(i18n.t('auth.recoveryFail'));
      }
      sessionService.setRecoveryCodeUsed(true);
      await authService.login(this.username, this.password);
    } catch (err) {
      this.setLoading(false);
      logService.exception(err);
      if (err instanceof Error) {
        showNotification(err.message, 'warning');
      }
    }
  },
});

export default createTwoFactorStore;
export type TwoFactorStore = ReturnType<typeof createTwoFactorStore>;
