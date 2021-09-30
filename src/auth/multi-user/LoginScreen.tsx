import { NavigationProp } from '@react-navigation/core';
import React from 'react';
import i18n from '../../common/services/i18n.service';
import ModalContainer from '../../onboarding/v2/steps/ModalContainer';
import ThemedStyles from '../../styles/ThemedStyles';
import LoginFormHandler from '../login/LoginFormHandler';
import { resetStackAndGoBack } from '../resetStackAndGoBack';

type PropsType = {
  navigation: NavigationProp<any>;
  route: any;
};

const LoginScreen = ({ navigation, route }: PropsType) => {
  const onLogin = React.useCallback(() => resetStackAndGoBack(navigation), [
    navigation,
  ]);
  const theme = ThemedStyles.style;
  return (
    <ModalContainer
      title={i18n.t('auth.login')}
      onPressBack={navigation.goBack}
      marginTop={20}
      contentContainer={theme.bgPrimaryBackground_Dark}
      titleStyle={theme.colorPrimaryText_Dark}
      backIconStyle={theme.colorPrimaryText_Dark}>
      <LoginFormHandler
        navigation={navigation}
        route={route}
        multiUser
        onLogin={onLogin}
      />
    </ModalContainer>
  );
};

export default LoginScreen;
