import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { BackHandler } from 'react-native';
import i18n from '../common/services/i18n.service';
import { RootStackParamList } from '../navigation/NavigationTypes';
import ModalContainer from '../onboarding/v2/steps/ModalContainer';
import ThemedStyles from '../styles/ThemedStyles';
import LoginForm from './login/LoginForm';

type RelogScreenRouteProp = RouteProp<RootStackParamList, 'RelogScreen'>;

type PropsType = {
  route: RelogScreenRouteProp;
  navigation: any;
};

const RelogScreen = ({ route, navigation }: PropsType) => {
  const theme = ThemedStyles.style;

  const { sessionIndex, onLogin, onCancel } = route.params;

  const onLoginHandler = React.useCallback(() => {
    onLogin && onLogin();
    navigation.goBack();
  }, [navigation, onLogin]);

  const onBackHandler = React.useCallback(() => {
    navigation.goBack();
    onCancel && onCancel();
  }, [navigation, onCancel]);

  // Disable back button on Android
  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', () => true);
  }, []);

  return (
    <ModalContainer
      title={i18n.t('auth.login')}
      onPressBack={onBackHandler}
      marginTop={20}
      contentContainer={theme.bgPrimaryBackgroundHighlight}
      titleStyle={theme.colorPrimaryText}
      backIconStyle={theme.colorPrimaryText}>
      <LoginForm relogin onLogin={onLoginHandler} sessionIndex={sessionIndex} />
    </ModalContainer>
  );
};

export default RelogScreen;
