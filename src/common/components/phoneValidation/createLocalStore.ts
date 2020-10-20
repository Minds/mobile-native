import type UserStore from '../../../auth/UserStore';
import walletService from '../../../wallet/WalletService';
import logService from '../../services/log.service';
import twoFactorAuthenticationService from '../../services/two-factor-authentication.service';

const createLocalStore = () => ({
  inProgress: false,
  confirming: false,
  confirmFailed: false,
  smsAllowed: true,
  phone: '+1',
  secret: '',
  code: '',
  error: '',
  wait: 60,
  confirmed: false,
  password: '',
  TFAConfirmed: false,
  phoneInputRef: null as any,
  setPhoneInputRef(phoneInputRef: any) {
    this.phoneInputRef = phoneInputRef;
  },
  setCode(code: string) {
    this.code = code;
  },
  setTFAConfirmed(TFAConfirmed: boolean) {
    this.TFAConfirmed = TFAConfirmed;
  },
  setPassword(password: string) {
    this.password = password;
  },
  setInProgress(inProgress) {
    this.inProgress = inProgress;
  },
  inProgressNow() {
    this.inProgress = true;
    this.error = '';
  },
  isConfirmed() {
    this.inProgress = false;
    this.confirmed = true;
  },
  setError(error: string) {
    this.error = error;
  },
  isJoining() {
    this.inProgress = true;
    this.error = '';
    this.confirming = false;
    this.confirmFailed = false;
  },
  isConfirming(secret) {
    this.secret = secret;
    this.confirming = true;
    this.inProgress = false;
  },
  setPhone(phone: string) {
    this.phone = phone;
  },
  get canConfirm() {
    return this.code.length > 0;
  },
  canJoin() {
    return this.phoneInputRef?.current?.isValidNumber();
  },
  async join(TFA = undefined, retry = false) {
    try {
      let { secret } = TFA
        ? await twoFactorAuthenticationService.authenticate(this.phone)
        : await walletService.join(this.phone, retry);

      this.isConfirming(secret);
    } catch (e) {
      const error = (e && e.message) || 'Unknown server error';
      this.setInProgress(false);
      this.setError(error);
    }
  },
  joinAction(TFA = undefined, retry = false) {
    if (this.inProgress || (!retry && !this.canJoin())) {
      return null;
    }

    this.isJoining();

    return this.join(TFA, retry);
  },
  async confirm(user, TFA = undefined) {
    try {
      if (TFA) {
        await twoFactorAuthenticationService.check(
          this.phone,
          this.code,
          this.secret,
        );
      } else {
        await walletService.confirm(this.phone, this.code, this.secret);
        user.setRewards(true);
      }
      this.isConfirmed();
    } catch (e) {
      const error = (e && e.message) || 'Unknown server error';
      this.setError(error);
      logService.exception(e);
    } finally {
      this.setInProgress(false);
    }
  },
  confirmAction(user: UserStore, TFA = undefined) {
    if (this.inProgress || !this.canConfirm || !user) {
      return null;
    }

    this.inProgressNow();

    return this.confirm(user, TFA);
  },
});

export type PhoneValidationStoreType = ReturnType<typeof createLocalStore>;
export default createLocalStore;
