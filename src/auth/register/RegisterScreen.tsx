import React from 'react';
import { View, KeyboardAvoidingView } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import Icon from 'react-native-vector-icons/Ionicons';

import { AuthStackParamList } from '../../navigation/NavigationTypes';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import DismissKeyboard from '../../common/components/DismissKeyboard';
import FitScrollView from '../../common/components/FitScrollView';
import RegisterForm from './RegisterForm';
import MText from '../../common/components/MText';

export type RegisterScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Register'
>;

type PropsType = {
  navigation: RegisterScreenNavigationProp;
};

export default observer(function RegisterScreen(props: PropsType) {
  const theme = ThemedStyles.style;

  return (
    <DismissKeyboard>
      <SafeAreaView style={theme.flexContainer}>
        <KeyboardAvoidingView behavior="height">
          <FitScrollView>
            <View style={[theme.rowJustifyStart, theme.paddingVertical3x]}>
              <MText
                style={[
                  theme.titleText,
                  theme.textCenter,
                  theme.colorWhite,
                  theme.paddingVertical3x,
                  theme.positionAbsolute,
                ]}
              >
                {i18n.t('auth.createChannel')}
              </MText>
              <Icon
                size={34}
                name="ios-chevron-back"
                style={[theme.colorWhite, theme.padding]}
                onPress={props.navigation.goBack}
              />
            </View>
            <RegisterForm />
          </FitScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </DismissKeyboard>
  );
});
