import { LayoutAnimation } from 'react-native';
import { showNotification } from '../../../AppMessages';
import sp from '~/services/serviceProvider';

const createLoginStore = ({ props }) => ({
  username: '',
  password: '',
  msg: '',
  language: sp.i18n.getCurrentLocale(),
  inProgress: false,
  showErrors: false,
  setUsername(value) {
    this.showErrors = false;
    let username = String(value).trim();
    // check for @ char at start, remove it if it is present.
    if (username.charAt(0) === '@') {
      username = username.substring(1);
    }
    this.username = username;
  },
  setPassword(value) {
    this.showErrors = false;
    const password = String(value).trim();
    this.password = password;
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
    showNotification(msg, 'warning', 3000);
    this.inProgress = false;
  },
  onLoginPress() {
    if (!this.username || !this.password) {
      this.showErrors = true;
      return;
    }

    this.initLogin();
    // is two factor auth
    return sp
      .resolve('auth')
      .login(this.username, this.password)
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
          this.setError(sp.i18n.t('auth.invalidGrant'));
          return;
        }

        if (errJson.message?.includes('user could not be found')) {
          this.setError(sp.i18n.t('auth.loginFail'));
          return;
        }

        if (err.response?.data && !err.response.data.message) {
          this.setError(
            err.response.status === 403
              ? 'Error: Forbidden'
              : `Error: Status ${err.response.status}`,
          );
        } else {
          this.setError(errJson.message || 'Unknown error');
        }

        sp.log.exception('[LoginStore]', errJson);
      });
  },
  onForgotPress() {
    sp.navigation.navigate('ResetPassword');
  },
});

export type LoginStore = ReturnType<typeof createLoginStore>;
export default createLoginStore;
