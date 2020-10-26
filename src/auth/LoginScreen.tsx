import React from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { useTransition, mix } from 'react-native-redash';

import LoginForm from './LoginForm';

import ThemedStyles from '../styles/ThemedStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

import BannerInfo from '../topbar/BannerInfo';
import DismissKeyboard from '../common/components/DismissKeyboard';
import { useKeyboard } from '@react-native-community/hooks';
import i18n from '../common/services/i18n.service';

const { height, width } = Dimensions.get('window');
const LOGO_HEIGHT = height / 7;
const titleMargin = { paddingVertical: height / 18 };

type PropsType = {
  navigation: any;
};

export default function LoginScreen(props: PropsType) {
  const theme = ThemedStyles.style;

  const keyboard = useKeyboard();
  const transition = useTransition(keyboard.keyboardShown);
  const translateY = mix(transition, 0, -LOGO_HEIGHT);
  const containerHeight = mix(transition, LOGO_HEIGHT, 0);
  const opacity = mix(transition, 1, 0);

  return (
    <SafeAreaView style={theme.flexContainer}>
      <DismissKeyboard>
        <View style={theme.flexContainer}>
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
              ]}>
              {i18n.t('auth.login')}
            </Text>

            <LoginForm
              onForgot={() => props.navigation.push('Forgot')}
              onRegisterPress={() => props.navigation.push('Register')}
            />
          </View>
        </View>
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
