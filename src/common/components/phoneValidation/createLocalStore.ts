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
});

export type PhoneValidationStoreType = ReturnType<typeof createLocalStore>;
export default createLocalStore;
