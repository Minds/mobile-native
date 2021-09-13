import { useLocalStore } from 'mobx-react';
import React from 'react';
import i18n from '../../common/services/i18n.service';
import ModalContainer from '../../onboarding/v2/steps/ModalContainer';
import ThemedStyles from '../../styles/ThemedStyles';
import LoginFormHandler from '../login/LoginFormHandler';
import BackButton from '../twoFactorAuth/BackButton';
import createTwoFactorStore from '../twoFactorAuth/createTwoFactorStore';

type PropsType = {
  navigation: any;
  route: any;
};

const LoginScreen = ({ navigation, route }: PropsType) => {
  const twoFactorStore = useLocalStore(createTwoFactorStore);
  const onLogin = React.useCallback(() => navigation.goBack(), [navigation]);
  const theme = ThemedStyles.style;
  return (
    <ModalContainer
      title={i18n.t('auth.login')}
      onPressBack={navigation.goBack}
      marginTop={20}
      contentContainer={theme.bgPrimaryBackgroundHighlight}
      titleStyle={theme.colorPrimaryText}
      backIconStyle={theme.colorPrimaryText}>
      <BackButton store={twoFactorStore} />
      <LoginFormHandler
        navigation={navigation}
        store={twoFactorStore}
        route={route}
        multiUser
        onLogin={onLogin}
      />
    </ModalContainer>
  );
};

export default LoginScreen;
