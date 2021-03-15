import Clipboard from '@react-native-clipboard/clipboard';
import { showNotification } from '../../../AppMessages';
type Options = 'app' | 'sms';

const createTwoFactorStore = () => ({
  loading: false,
  confirmPassword: false,
  selectedOption: 'app' as Options,
  secret: '',
  appCode: '',
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
    Clipboard.setString(this.secret);
    showNotification('Secret copied to clipboard', 'success');
  },
  async getSecret() {
    setTimeout(() => this.setSecret('DFF4DE3B62C2A11B'), 300);
  },
  setLoading(loading: boolean) {
    this.loading = loading;
  },
});

export default createTwoFactorStore;
export type TwoFactorStore = ReturnType<typeof createTwoFactorStore>;
