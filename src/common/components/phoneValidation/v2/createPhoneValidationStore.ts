import NavigationService from '../../../../navigation/NavigationService';
import walletService from '../../../../wallet/WalletService';
import i18n from '../../../services/i18n.service';
import logService from '../../../services/log.service';

type ValidationSteps = 'inputNumber' | 'validateCode' | 'validationSucess';

const createPhoneValidationStore = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: Function;
  onCancel: Function;
}) => ({
  phone: '',
  phoneInputRef: null as any,
  validationStep: 'inputNumber' as ValidationSteps,
  inProgress: false,
  confirming: false,
  confirmFailed: false,
  error: '',
  confirmed: false,
  code: '',
  secret: '',
  setPhone(phone: string) {
    this.phone = phone;
  },
  setCode(code: string) {
    this.code = code;
  },
  setPhoneInputRef(phoneInputRef: any) {
    this.phoneInputRef = phoneInputRef;
  },
  get canConfirm() {
    return this.code.length > 0;
  },
  get haveToInputNumber() {
    return !this.confirming && !this.confirmed;
  },
  get haveToConfirm() {
    return this.confirming && !this.confirmed;
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
  setInProgress(inProgress) {
    this.inProgress = inProgress;
  },
  isConfirming(secret) {
    this.secret = secret;
    this.confirming = true;
    this.inProgress = false;
  },
  isJoining() {
    this.inProgress = true;
    this.error = '';
    this.confirming = false;
    this.confirmFailed = false;
  },
  canJoin() {
    return this.isPhoneNumberValid();
  },
  isPhoneNumberValid() {
    return this.phoneInputRef?.current?.isValidNumber(this.phone);
  },
  async join() {
    try {
      let { secret } = await walletService.join(this.phone, false);

      this.isConfirming(secret);
    } catch (e) {
      const error =
        e instanceof Error && e.message ? e.message : 'Unknown server error';
      this.setInProgress(false);
      this.setError(error);
      throw e;
    }
  },
  joinAction() {
    if (!this.canJoin()) {
      this.setError(i18n.t('onboarding.phoneNumberInvalid'));
      return null;
    }
    if (this.inProgress) {
      return null;
    }

    this.isJoining();

    this.join();
  },
  async confirm() {
    try {
      await walletService.confirm(this.phone, this.code, this.secret);
      this.isConfirmed();
      onConfirm && onConfirm(true);
      NavigationService.goBack();
    } catch (e) {
      const error =
        e instanceof Error && e.message ? e.message : 'Unknown server error';
      this.setError(error);
      logService.exception(e);
      throw e;
    } finally {
      this.setInProgress(false);
    }
  },
  cancel() {
    onCancel && onCancel(false);
    NavigationService.goBack();
  },
  confirmAction() {
    if (!this.canConfirm) {
      this.setError(i18n.t('onboarding.confirmationCodeInvalid'));
      return null;
    }
    if (this.inProgress) {
      return null;
    }

    this.inProgressNow();

    return this.confirm();
  },
});

export type PhoneValidationStore = ReturnType<
  typeof createPhoneValidationStore
>;
export default createPhoneValidationStore;
