import { NavigationProp } from '@react-navigation/core';
import React from 'react';
import { ModalFullScreen } from '~/common/ui';
import i18n from '../../common/services/i18n.service';
import LoginForm from '../login/LoginForm';

type PropsType = {
  navigation: NavigationProp<any>;
  route: any;
};

const LoginScreen = ({ navigation, route }: PropsType) => {
  const onLogin = React.useCallback(() => {
    route.params?.onLogin && route.params.onLogin(navigation);
  }, [navigation, route.params]);
  return (
    <ModalFullScreen back title={i18n.t('auth.login')}>
      <LoginForm onLogin={onLogin} />
    </ModalFullScreen>
  );
};

export default LoginScreen;
