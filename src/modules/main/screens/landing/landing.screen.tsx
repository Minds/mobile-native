import React, { useCallback } from 'react';
import { View, Text, Button } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
// import { useTranslation } from '../../locales';

export function LandingScreen(): React.ReactElement {
  const navigation = useNavigation();
  const { t } = useTranslation('mainModule');
  // const { setStatusBarStyle } = useThemeContext();

  useFocusEffect(
    useCallback(() => {
      // setStatusBarStyle?.('light-content');
    }, []),
  );

  const onLoginButtonPress = (): void => navigation.navigate('Login');

  const onSignUpButtonPress = (): void =>
    navigation.navigate('SignUp', {
      screen: 'OnboardingProducts',
    });

  return (
    <>
      <Text testID="main-title" style={[]}>
        {t('Minds awesome')}
      </Text>
      <Text style={[]}>{t('The worlds most powerful app')}</Text>
      <View style={[]} />
      <Button
        title={t('Get an account')}
        testID="sign-up-button"
        onPress={onSignUpButtonPress}>
        {t('Get an account')}
      </Button>
      <Button
        title={t('Sign in')}
        testID="login-button"
        onPress={onLoginButtonPress}>
        {t('Sign in')}
      </Button>
      <View />
    </>
  );
}
