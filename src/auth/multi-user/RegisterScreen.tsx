import React from 'react';
import { View, Text } from 'react-native';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import ModalContainer from '../../onboarding/v2/steps/ModalContainer';
import { useNavigation } from '@react-navigation/native';

type PropsType = {};

const RegisterScreen = ({}: PropsType) => {
  const theme = ThemedStyles.style;
  const navigation = useNavigation();
  return (
    <ModalContainer
      title={i18n.t('auth.createChannel')}
      onPressBack={navigation.goBack}
      marginTop={20}>
      <Text style={[theme.fontL]}>Register</Text>
    </ModalContainer>
  );
};

export default RegisterScreen;
