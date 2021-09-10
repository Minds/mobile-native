import React from 'react';
import { observer } from 'mobx-react';
import TwoFactorTotpForm from '../twoFactorAuth/TwoFactorTotpForm';
import { TwoFactorStore } from '../twoFactorAuth/createTwoFactorStore';
import LoginForm from './LoginForm';
import { LoginScreenRouteProp } from './LoginScreen';

type PropsType = {
  store: TwoFactorStore;
  navigation: any;
  route: LoginScreenRouteProp;
  multiUser?: boolean;
  onLogin?: Function;
};

const LoginFormHandler = observer(
  ({ store, navigation, route, multiUser, onLogin }: PropsType) => {
    const form =
      store.twoFactorAuthStep === 'login' ? (
        <LoginForm
          onRegisterPress={() => navigation.push('Register')}
          store={store}
          route={route}
          multiUser={multiUser}
          onLogin={onLogin}
        />
      ) : (
        <TwoFactorTotpForm store={store} />
      );
    return form;
  },
);

export default LoginFormHandler;
