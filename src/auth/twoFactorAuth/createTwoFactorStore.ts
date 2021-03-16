import Clipboard from '@react-native-clipboard/clipboard';
import { Linking } from 'react-native';
import { showNotification } from '../../../AppMessages';
import apiService from '../../common/services/api.service';
import logService from '../../common/services/log.service';
import sessionService from '../../common/services/session.service';
export type Options = 'app' | 'sms';

const createTwoFactorStore = () => ({
  loading: false,
  confirmPassword: false,
  selectedOption: 'app' as Options,
  secret: '',
  appCode: '',
  appAuthEnabled: false,
  smsAuthEnabled: false,
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
  copySecret() {
    //Clipboard.setString(this.secret);
    //showNotification('Secret copied to clipboard', 'success');
    Linking.openURL(
      `otpauth://totp/Minds.com?secret=${this.secret}&issuer=${
        sessionService.getUser().username
      }`,
    );
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
      console.log('submitCODE RESPONSE', response);
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
    } else {
      this.smsAuthEnabled = true;
    }
  },
  setAuthDisabled() {
    this.appAuthEnabled = false;
    this.smsAuthEnabled = false;
  },
});

export default createTwoFactorStore;
export type TwoFactorStore = ReturnType<typeof createTwoFactorStore>;
