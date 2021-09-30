import React from 'react';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import ModalContainer from '../../onboarding/v2/steps/ModalContainer';
import { useNavigation } from '@react-navigation/native';
import RegisterForm from '../register/RegisterForm';

type PropsType = {
  route: any;
};

const RegisterScreen = ({ route }: PropsType) => {
  const theme = ThemedStyles.style;
  const navigation = useNavigation();
  return (
    <ModalContainer
      title={i18n.t('auth.createChannel')}
      onPressBack={navigation.goBack}
      marginTop={20}
      contentContainer={theme.bgPrimaryBackground_Dark}
      titleStyle={theme.colorPrimaryText_Dark}
      backIconStyle={theme.colorPrimaryText_Dark}>
      <RegisterForm onRegister={route.params?.onRegister} />
    </ModalContainer>
  );
};

export default RegisterScreen;
