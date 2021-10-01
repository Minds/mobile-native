import { NavigationProp } from '@react-navigation/core';
import React from 'react';
import i18n from '../../common/services/i18n.service';
import ModalContainer from '../../onboarding/v2/steps/ModalContainer';
import ThemedStyles from '../../styles/ThemedStyles';
import LoginForm from '../login/LoginForm';

type PropsType = {
  navigation: NavigationProp<any>;
  route: any;
};

const LoginScreen = ({ navigation, route }: PropsType) => {
  const onLogin = React.useCallback(() => {
    route.params?.onLogin
      ? route.params.onLogin(navigation)
      : navigation.goBack();
  }, [navigation, route.params]);
  const theme = ThemedStyles.style;
  return (
    <ModalContainer
      title={i18n.t('auth.login')}
      onPressBack={navigation.goBack}
      marginTop={20}
      contentContainer={theme.bgPrimaryBackgroundHighlight}>
      <LoginForm route={route} onLogin={onLogin} />
    </ModalContainer>
  );
};

export default LoginScreen;
