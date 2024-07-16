import { NavigationProp } from '@react-navigation/core';
import React from 'react';
import { ModalFullScreen } from '~/common/ui';
import LoginForm from '../login/LoginForm';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import serviceProvider from '~/services/serviceProvider';

type PropsType = {
  navigation: NavigationProp<any>;
  route: any;
};

const LoginScreen = ({ navigation, route }: PropsType) => {
  const onLogin = React.useCallback(() => {
    route.params?.onLogin?.(navigation);
  }, [navigation, route.params]);
  return (
    <ModalFullScreen back title={serviceProvider.i18n.t('auth.login')}>
      <LoginForm onLogin={onLogin} />
    </ModalFullScreen>
  );
};

export default withErrorBoundaryScreen(LoginScreen, 'LoginScreen');
