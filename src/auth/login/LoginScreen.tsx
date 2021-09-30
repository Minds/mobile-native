import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { useTransition, mix } from 'react-native-redash';
import { useKeyboard } from '@react-native-community/hooks';
import { SafeAreaView } from 'react-native-safe-area-context';

import ThemedStyles from '../../styles/ThemedStyles';

import FitScrollView from '../../common/components/FitScrollView';
import DismissKeyboard from '../../common/components/DismissKeyboard';
import i18n from '../../common/services/i18n.service';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/NavigationTypes';
import LoginFormHandler from './LoginFormHandler';
import MText from '../../common/components/MText';

const { height, width } = Dimensions.get('window');
const LOGO_HEIGHT = height / 7;
const titleMargin = { paddingVertical: height / 18 };

type PropsType = {
  navigation: any;
  route: LoginScreenRouteProp;
};

export type LoginScreenRouteProp = RouteProp<AuthStackParamList, 'Login'>;

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
        <FitScrollView
          style={theme.flexContainer}
          keyboardShouldPersistTaps="always"
        >
          <View style={theme.flexColumnStretch}>
            <Animated.View style={[styles.bulb, { height: containerHeight }]}>
              <Animated.Image
                resizeMode="contain"
                source={require('./../../assets/logos/logo-white.png')}
                style={[styles.image, { transform: [{ translateY }], opacity }]}
              />
            </Animated.View>
            <MText
              style={[
                theme.titleText,
                theme.textCenter,
                theme.colorWhite,
                titleMargin,
              ]}
              testID="loginscreentext"
            >
              {i18n.t('auth.login')}
            </MText>
            <LoginFormHandler
              navigation={props.navigation}
              route={props.route}
            />
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
