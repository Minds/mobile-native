import React from 'react';
import { observer } from 'mobx-react';
import TwoFactorTotpForm from '../twoFactorAuth/TwoFactorTotpForm';
import { TwoFactorStore } from '../twoFactorAuth/createTwoFactorStore';
import LoginForm from './LoginForm';
import { LoginScreenRouteProp } from './LoginScreen';

type PropsType = {
  store: TwoFactorStore;
  navigation?: any;
  route?: LoginScreenRouteProp;
  multiUser?: boolean;
  onLogin?: Function;
  relogin?: boolean;
  sessionIndex?: number;
};

const LoginFormHandler = observer(
  ({
    store,
    navigation,
    route,
    multiUser,
    onLogin,
    relogin,
    sessionIndex,
  }: PropsType) => {
    const form =
      store.twoFactorAuthStep === 'login' ? (
        <LoginForm
          onRegisterPress={() => navigation.push('Register')}
          store={store}
          route={route}
          multiUser={multiUser}
          onLogin={onLogin}
          relogin={relogin}
          sessionIndex={sessionIndex}
        />
      ) : (
        <TwoFactorTotpForm store={store} />
      );
    return form;
  },
);

export default LoginFormHandler;
