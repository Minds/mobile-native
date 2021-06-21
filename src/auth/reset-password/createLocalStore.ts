import i18n from '../../common/services/i18n.service';

type StepsType = 'inputUser' | 'emailSended' | 'inputPassword';

const createLocalStore = () => ({
  currentStep: 'inputUser' as StepsType,
  username: '',
  setUsername(username: string) {
    this.username = username;
  },
  navToInputUser() {
    console.log('nav');
    this.currentStep = 'inputUser';
  },
  navToEmailSended() {
    this.currentStep = 'emailSended';
  },
  navToInputPassword() {
    this.currentStep = 'inputPassword';
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
});

export type ResetPasswordStore = ReturnType<typeof createLocalStore>;
export default createLocalStore;
