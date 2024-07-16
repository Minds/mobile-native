import { useBackHandler } from '@react-native-community/hooks';
import { RouteProp } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { RootStackParamList } from '../navigation/NavigationTypes';
import ModalContainer from '../onboarding/v2/steps/ModalContainer';
import LoginForm from './login/LoginForm';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import sp from '~/services/serviceProvider';

type RelogScreenRouteProp = RouteProp<RootStackParamList, 'RelogScreen'>;

type PropsType = {
  route: RelogScreenRouteProp;
  navigation: any;
};

const RelogScreen = ({ route, navigation }: PropsType) => {
  const theme = sp.styles.style;

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
  useBackHandler(
    useCallback(() => {
      return true;
    }, []),
  );

  return (
    <ModalContainer
      title={sp.i18n.t('auth.login')}
      onPressBack={onBackHandler}
      marginTop={20}
      contentContainer={[
        theme.bgPrimaryBackgroundHighlight,
        theme.alignSelfCenterMaxWidth,
      ]}
      titleStyle={theme.colorPrimaryText}>
      <LoginForm relogin onLogin={onLoginHandler} sessionIndex={sessionIndex} />
    </ModalContainer>
  );
};

export default withErrorBoundaryScreen(RelogScreen, 'RelogScreen');
