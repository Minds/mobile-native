import { RouteProp } from '@react-navigation/native';
import { useLocalStore } from 'mobx-react';
import React from 'react';
import { BackHandler } from 'react-native';
import i18n from '../common/services/i18n.service';
import { RootStackParamList } from '../navigation/NavigationTypes';
import ModalContainer from '../onboarding/v2/steps/ModalContainer';
import ThemedStyles from '../styles/ThemedStyles';
import LoginFormHandler from './login/LoginFormHandler';
import createTwoFactorStore from './twoFactorAuth/createTwoFactorStore';

type RelogScreenRouteProp = RouteProp<RootStackParamList, 'RelogScreen'>;

type PropsType = {
  route: RelogScreenRouteProp;
  navigation: any;
};

const RelogScreen = ({ route, navigation }: PropsType) => {
  const twoFactorStore = useLocalStore(createTwoFactorStore);
  const theme = ThemedStyles.style;

  const { sessionIndex, onLogin } = route.params;

  const onLoginHandler = React.useCallback(() => {
    onLogin && onLogin();
    navigation.goBack();
  }, [navigation, onLogin]);

  // Disable back button on Android
  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', () => true);
  }, []);

  return (
    <ModalContainer
      title={i18n.t('auth.login')}
      onPressBack={navigation.goBack}
      marginTop={20}
      contentContainer={theme.bgPrimaryBackgroundHighlight}
      titleStyle={theme.colorPrimaryText}
      backIconStyle={theme.colorPrimaryText}>
      <LoginFormHandler
        store={twoFactorStore}
        relogin
        onLogin={onLoginHandler}
        sessionIndex={sessionIndex}
      />
    </ModalContainer>
  );
};

export default RelogScreen;
