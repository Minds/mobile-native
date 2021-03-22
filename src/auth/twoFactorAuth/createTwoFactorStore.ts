import Clipboard from '@react-native-clipboard/clipboard';
import { Linking } from 'react-native';
import { showNotification } from '../../../AppMessages';
import apiService from '../../common/services/api.service';
import logService from '../../common/services/log.service';
import sessionService from '../../common/services/session.service';
import twoFactorAuthenticationService from '../../common/services/two-factor-authentication.service';
import authService, { TFA } from '../AuthService';
export type Options = 'app' | 'sms' | 'disable';

const createTwoFactorStore = () => ({
  loading: false,
  confirmPassword: false,
  selectedOption: 'app' as Options,
  secret: '',
  appCode: '',
  appAuthEnabled: false,
  smsAuthEnabled: false,
  recoveryCode: '',
  showConfirmPasssword() {
    this.confirmPassword = true;
  },
  closeConfirmPasssword() {
    this.confirmPassword = false;
  },
  setSelected(option: Options) {
    this.selectedOption = option;
    this.showConfirmPasssword();
  },
  setSecret(secret: string) {
    this.secret = secret;
  },
  setAppCode(appCode: string) {
    this.appCode = appCode;
  },
  has2fa(has2fa: { sms: boolean; totp: boolean }) {
    if (has2fa.totp) {
      this.appAuthEnabled = true;
    } else if (has2fa.sms) {
      this.smsAuthEnabled = true;
    }
  },
  get has2faEnabled() {
    return this.appAuthEnabled || this.smsAuthEnabled;
  },
  copySecret() {
    Clipboard.setString(this.secret);
    showNotification('Secret copied to clipboard', 'success');
    Linking.openURL(
      `otpauth://totp/Minds.com?secret=${this.secret}&issuer=${
        sessionService.getUser().username
      }`,
    );
  },
  copyRecoveryCode() {
    Clipboard.setString(this.recoveryCode);
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
      let response;
      if (this.appAuthEnabled) {
        response = <any>await apiService.delete('api/v3/security/totp', {
          code: this.appCode,
        });
      } else {
        response = await twoFactorAuthenticationService.remove(password);
      }
      this.appAuthEnabled = false;
      this.smsAuthEnabled = false;
      onComplete();
    } catch (err) {
      logService.exception(err);
    }
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
  async login(username: string, password: string, tfa: TFA, secret?: string) {
    this.setLoading(true);
    let headers: any = {
      'X-MINDS-2FA-CODE': this.appCode,
    };
    if (tfa === 'sms') {
      headers['X-MINDS-SMS-2FA-KEY'] = secret;
    }
    try {
      await authService.login(username, password, headers);
    } catch (err) {
      logService.exception(err);
    } finally {
      this.setLoading(false);
    }
  },
});

export default createTwoFactorStore;
export type TwoFactorStore = ReturnType<typeof createTwoFactorStore>;
