import React from 'react';
import { View, Text, KeyboardAvoidingView } from 'react-native';

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
            <View style={styles.container}>
              <Text style={styles.createChannel}>
                {i18n.t('auth.createChannel')}
              </Text>
              <Icon
                size={34}
                name="ios-chevron-back"
                style={styles.icon}
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

const styles = ThemedStyles.create({
  container: ['rowJustifyStart', 'paddingVertical3x'],
  createChannel: [
    'titleText',
    'textCenter',
    'colorWhite',
    'paddingVertical3x',
    'positionAbsolute',
  ],
  icon: ['colorWhite', 'padding'],
});
