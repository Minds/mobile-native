import React from 'react';
import { View, Platform, Text } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { observer, useLocalStore } from 'mobx-react';
import Icon from 'react-native-vector-icons/Ionicons';

import InputContainer from '../common/components/InputContainer';
import { AuthStackParamList } from '../navigation/NavigationTypes';
import { styles, shadowOpt, icon } from './styles';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import BoxShadow from '../common/components/BoxShadow';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../common/components/Button';
import PasswordValidator from '../common/components/PasswordValidator';

export type WalletScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Register'
>;

type PropsType = {
  navigation: WalletScreenNavigationProp;
};

export default observer(function RegisterScreen(props: PropsType) {
  const store = useLocalStore(() => ({
    error: {},
    password: '',
    passwordFocused: false,
    username: '',
    email: '',
    termsAccepted: false,
    exclusivePromotions: false,
    hidePassword: true,
    inProgress: false,

    setPassword(value: string) {
      store.password = value;
    },
    setUsername(value: string) {
      store.username = value;
    },
    setEmail(value: string) {
      store.email = value;
    },
    toggleTerms() {
      store.termsAccepted = !store.termsAccepted;
    },
    toggleHidePassword() {
      store.hidePassword = !store.hidePassword;
    },
    togglePromotions() {
      store.exclusivePromotions = !store.exclusivePromotions;
    },
  }));

  const theme = ThemedStyles.style;

  const inputs = (
    <SafeAreaView style={styles.shadow}>
      <View style={[theme.rowJustifyStart, theme.paddingVertical3x]}>
        <Text
          style={[
            theme.titleText,
            theme.textCenter,
            theme.colorWhite,
            theme.paddingVertical3x,
            theme.positionAbsolute,
          ]}>
          {i18n.t('auth.createChannel')}
        </Text>
        <Icon
          size={34}
          name="ios-chevron-back"
          style={[theme.colorWhite, theme.padding1x]}
          onPress={props.navigation.goBack}
        />
      </View>
      <InputContainer
        containerStyle={styles.inputBackground}
        placeholder={i18n.t('auth.username')}
        onChangeText={store.setUsername}
        value={store.username}
        testID="usernameInput"
        noBottomBorder
      />
      <InputContainer
        containerStyle={styles.inputBackground}
        placeholder={i18n.t('auth.email')}
        onChangeText={store.setEmail}
        value={store.email}
        testID="email"
        noBottomBorder
      />
      <PasswordValidator password={store.password} />
      <View>
        <InputContainer
          containerStyle={styles.inputBackground}
          placeholder={i18n.t('auth.password')}
          secureTextEntry={store.hidePassword}
          onChangeText={store.setPassword}
          value={store.password}
          testID="userPasswordInput"
        />
        <Icon
          name={store.hidePassword ? 'md-eye' : 'md-eye-off'}
          size={25}
          onPress={store.toggleHidePassword}
          style={[theme.inputIcon, icon]}
        />
      </View>
      <View style={theme.padding4x}>
        <Button
          onPress={store.onRegisterPress}
          text={i18n.t('auth.createChannel')}
          containerStyle={[
            theme.transparentButton,
            theme.paddingVertical3x,
            theme.fullWidth,
            theme.marginTop6x,
            styles.lightButton,
          ]}
          textStyle={theme.buttonText}
          loading={store.inProgress}
          disabled={store.inProgress}
          testID="loginButton"
        />
      </View>
    </SafeAreaView>
  );

  const inputsWithShadow = Platform.select({
    ios: inputs,
    android: <BoxShadow setting={shadowOpt}>{inputs}</BoxShadow>, // Android fallback for shadows
  });

  return <View style={theme.flexContainer}>{inputsWithShadow}</View>;
});
