import React from 'react';
import RegisterForm from '../register/RegisterForm';
import { ModalFullScreen } from '~ui';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { TENANT } from '~/config/Config';
import sp from '~/services/serviceProvider';

const RegisterScreen = () => {
  return (
    <ModalFullScreen back title={sp.i18n.t('auth.createChannel', { TENANT })}>
      <RegisterForm />
    </ModalFullScreen>
  );
};

export default withErrorBoundaryScreen(RegisterScreen, 'RegisterScreen');
