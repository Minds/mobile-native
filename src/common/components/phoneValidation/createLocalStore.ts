import type UserStore from '../../../auth/UserStore';
import walletService from '../../../wallet/WalletService';
import logService from '../../services/log.service';
import twoFactorAuthenticationService from '../../services/two-factor-authentication.service';
import i18n from '../../services/i18n.service';

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
    return this.isPhoneNumberValid();
  },
  isPhoneNumberValid() {
    return this.phoneInputRef?.current?.isValidNumber();
  },
  async join(TFA = false, retry = false) {
    try {
      let { secret } = TFA
        ? await twoFactorAuthenticationService.authenticate(this.phone)
        : await walletService.join(this.phone, retry);

      this.isConfirming(secret);
      return true;
    } catch (e) {
      const error = (e && e.message) || 'Unknown server error';
      this.setInProgress(false);
      this.setError(error);
      throw e;
    }
  },
  joinAction(TFA = false, retry = false) {
    if (!this.canJoin()) {
      this.setError(i18n.t('onboarding.phoneNumberInvalid'));
      return null;
    }
    if (this.inProgress || (!retry && !this.canJoin())) {
      return null;
    }

    this.isJoining();

    return this.join(TFA, retry);
  },
  async confirm(user, TFA = false) {
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
      throw e;
    } finally {
      this.setInProgress(false);
    }
  },
  confirmAction(user: UserStore, TFA = false) {
    if (this.inProgress || !this.canConfirm || !user) {
      return null;
    }

    this.inProgressNow();

    return this.confirm(user, TFA);
  },
});

export type PhoneValidationStoreType = ReturnType<typeof createLocalStore>;
export default createLocalStore;
