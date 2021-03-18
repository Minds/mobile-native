import React from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { useTransition, mix } from 'react-native-redash';

import LoginForm from './LoginForm';

import ThemedStyles from '../styles/ThemedStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

import FitScrollView from '../common/components/FitScrollView';
import DismissKeyboard from '../common/components/DismissKeyboard';
import { useKeyboard } from '@react-native-community/hooks';
import i18n from '../common/services/i18n.service';
import { RouteProp, useRoute } from '@react-navigation/native';
import { AuthStackParamList } from '../navigation/NavigationTypes';
import TwoFactorTotpForm from './twoFactorAuth/TwoFactorTotpForm';

const { height, width } = Dimensions.get('window');
const LOGO_HEIGHT = height / 7;
const titleMargin = { paddingVertical: height / 18 };

type PropsType = {
  navigation: any;
};

export type LoginScreenRouteProp = RouteProp<AuthStackParamList, 'Login'>;

export default function LoginScreen(props: PropsType) {
  const theme = ThemedStyles.style;

  const route = useRoute<LoginScreenRouteProp>();
  const tfa = route.params?.tfa || '';

  const keyboard = useKeyboard();
  const transition = useTransition(keyboard.keyboardShown);
  const translateY = mix(transition, 0, -LOGO_HEIGHT);
  const containerHeight = mix(transition, LOGO_HEIGHT, 0);
  const opacity = mix(transition, 1, 0);

  return (
    <SafeAreaView style={theme.flexContainer}>
      <DismissKeyboard>
        <FitScrollView
          style={theme.flexContainer}
          keyboardShouldPersistTaps={true}>
          <View style={theme.flexColumnStretch}>
            <Animated.View style={[styles.bulb, { height: containerHeight }]}>
              <Animated.Image
                resizeMode="contain"
                source={require('./../assets/logos/logo-white.png')}
                style={[styles.image, { transform: [{ translateY }], opacity }]}
              />
            </Animated.View>
            <Text
              style={[
                theme.titleText,
                theme.textCenter,
                theme.colorWhite,
                titleMargin,
              ]}
              testID="loginscreentext">
              {i18n.t('auth.login')}
            </Text>

            {tfa === '' && (
              <LoginForm
                onForgot={() => props.navigation.push('Forgot')}
                onRegisterPress={() => props.navigation.push('Register')}
              />
            )}
            {tfa !== '' && <TwoFactorTotpForm route={route} />}
          </View>
        </FitScrollView>
      </DismissKeyboard>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bulb: {
    width: '100%',
    height: LOGO_HEIGHT,
    justifyContent: 'flex-end',
    // height: 70,
  },
  image: {
    height: 0.3679 * (width * 0.43),
    width: '43%',
    alignSelf: 'center',
  },
});
