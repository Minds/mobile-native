import React from 'react';
import { observer } from 'mobx-react';
import LoginForm from './LoginForm';
import { LoginScreenRouteProp } from './LoginScreen';

type PropsType = {
  navigation?: any;
  route?: LoginScreenRouteProp;
  multiUser?: boolean;
  onLogin?: Function;
  relogin?: boolean;
  sessionIndex?: number;
};

const LoginFormHandler = observer(
  ({
    navigation,
    route,
    multiUser,
    onLogin,
    relogin,
    sessionIndex,
  }: PropsType) => {
    const form = (
      <LoginForm
        onRegisterPress={() => navigation.push('Register')}
        route={route}
        multiUser={multiUser}
        onLogin={onLogin}
        relogin={relogin}
        sessionIndex={sessionIndex}
      />
    );

    return form;
  },
);

export default LoginFormHandler;
