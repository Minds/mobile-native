import i18n from '../../common/services/i18n.service';
import AuthService from '../AuthService';
import { LayoutAnimation } from 'react-native';
import logService from '../../common/services/log.service';
import { showNotification } from '../../../AppMessages';

const createLoginStore = ({ props, resetRef }) => ({
  username: '',
  password: '',
  msg: '',
  language: i18n.getCurrentLocale(),
  hidePassword: true,
  inProgress: false,
  setUsername(value) {
    let username = String(value).trim();
    // check for @ char at start, remove it if it is present.
    if (username.charAt(0) === '@') {
      username = username.substring(1);
    }
    this.username = username;
  },
  setPassword(value) {
    const password = String(value).trim();
    this.password = password;
  },
  toggleHidePassword() {
    this.hidePassword = !this.hidePassword;
  },
  setInProgress(value: boolean) {
    this.inProgress = value;
  },
  initLogin() {
    this.msg = '';
    this.inProgress = true;
  },
  setError(msg: string) {
    this.msg = msg;
    showNotification(msg, 'warning', 3000, 'top');
    this.inProgress = false;
  },
  onLoginPress() {
    this.initLogin();
    // is two factor auth
    AuthService.login(this.username, this.password)
      .then(() => {
        props.onLogin && props.onLogin();
      })
      .catch(err => {
        const errJson = err.response ? err.response.data : err;
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        if (
          errJson.error === 'invalid_grant' ||
          errJson.error === 'invalid_client'
        ) {
          this.setError(i18n.t('auth.invalidGrant'));
          return;
        }

        if (errJson.message.includes('user could not be found')) {
          this.setError(i18n.t('auth.loginFail'));
          return;
        }

        this.setError(errJson.message || 'Unknown error');

        logService.exception('[LoginForm]', errJson);
      });
  },
  onForgotPress() {
    resetRef.current?.show();
  },
});

export type LoginStore = ReturnType<typeof createLoginStore>;
export default createLoginStore;
