import { useLocalStore } from 'mobx-react';
import React from 'react';
import i18n from '../../common/services/i18n.service';
import ModalContainer from '../../onboarding/v2/steps/ModalContainer';
import ThemedStyles from '../../styles/ThemedStyles';
import { LoginFormHandler } from '../LoginScreen';
import BackButton from '../twoFactorAuth/BackButton';
import createTwoFactorStore from '../twoFactorAuth/createTwoFactorStore';

type PropsType = {
  navigation: any;
  route: any;
};

const LoginScreen = ({ navigation, route }: PropsType) => {
  const twoFactorStore = useLocalStore(createTwoFactorStore);
  const onLogin = React.useCallback(() => navigation.goBack(), [navigation]);
  return (
    <ModalContainer
      title={i18n.t('auth.login')}
      onPressBack={navigation.goBack}
      marginTop={20}>
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

export const commonStyles = ThemedStyles.create({
  container: [
    'flexContainer',
    'bgPrimaryBackground',
    {
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      overflow: 'hidden',
    },
  ],
});

export default LoginScreen;
