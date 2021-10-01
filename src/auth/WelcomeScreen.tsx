import { CommonActions, RouteProp } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../common/components/Button';
import i18n from '../common/services/i18n.service';
import { AuthStackParamList } from '../navigation/NavigationTypes';
import ThemedStyles, { useStyle } from '../styles/ThemedStyles';
import ResetPasswordModal, {
  ResetPasswordModalHandles,
} from './reset-password/ResetPasswordModal';

const { height, width } = Dimensions.get('window');
const LOGO_HEIGHT = height / 7;

/**
 * set the App route as the root of the stack and
 * goBack after 500ms (enough time for App component
 * to render and the navigation to be registered).
 *
 * We do this because
 * 1. after login, the root stack changes and our previous
 *    screen may not exist
 * 2. to keep the bottomsheet close transition
 */
const resetStackAndGoBack = navigation => {
  navigation.dispatch(state => {
    setTimeout(() => {
      navigation.goBack();
    }, 500);

    return CommonActions.reset({
      ...state,
      routes: [{ key: 'App_SOMETHING', name: 'App' }, ...state.routes],
      index: 1,
    });
  });
};

type PropsType = {
  navigation: any;
  route: WelcomeScreenRouteProp;
};

export type WelcomeScreenRouteProp = RouteProp<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen(props: PropsType) {
  const theme = ThemedStyles.style;
  const resetRef = React.useRef<ResetPasswordModalHandles>(null);
  const onLoginPress = useCallback(() => {
    props.navigation.navigate('MultiUserLogin', {
      onLogin: resetStackAndGoBack,
    });
  }, [props.navigation]);

  const onRegisterPress = useCallback(() => {
    props.navigation.navigate('MultiUserRegister', {
      onRegister: resetStackAndGoBack,
    });
  }, [props.navigation]);
  const username = props.route?.params?.username;
  const code = props.route?.params?.code;

  React.useEffect(() => {
    const navToInputPassword = username && code && !!resetRef.current;
    if (navToInputPassword) {
      resetRef.current!.show(navToInputPassword, username, code);
    }
  }, [code, username]);

  return (
    <SafeAreaView style={theme.flexContainer}>
      <View style={theme.flexColumnStretch}>
        <Animated.Image
          resizeMode="contain"
          source={require('./../assets/logos/logo-white.png')}
          style={styles.image}
        />

        <View style={styles.buttonContainer}>
          <Button
            text={i18n.t('auth.createChannel')}
            onPress={onRegisterPress}
            large
            action
            transparent
            containerStyle={useStyle(
              styles.buttonContainerStyle,
              theme.marginBottom5x,
            )}
          />
          <Button
            text={i18n.t('auth.login')}
            onPress={onLoginPress}
            large
            borderless
            color={ThemedStyles.getColor('White')}
            containerStyle={useStyle(
              styles.buttonContainerStyle,
              theme.bgPrimaryBorder_Dark,
            )}
          />
        </View>
      </View>
      <ResetPasswordModal ref={resetRef} />
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
    position: 'absolute',
    top: '10%',
    alignSelf: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '10%',
    left: 0,
    right: 0,
    padding: 32,
  },
  buttonContainerStyle: {
    alignSelf: 'stretch',
    marginBottom: 20,
  },
});
