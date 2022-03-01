import { RouteProp } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import MText from '~/common/components/MText';
import { IS_REVIEW } from '~/config/Config';
import { Button } from '~ui';
import i18n from '../common/services/i18n.service';
import { AuthStackParamList } from '../navigation/NavigationTypes';
import ThemedStyles from '../styles/ThemedStyles';
import ResetPasswordModal, {
  ResetPasswordModalHandles,
} from './reset-password/ResetPasswordModal';

const { height, width } = Dimensions.get('window');
const LOGO_HEIGHT = height / 7;

type PropsType = {
  navigation: any;
  route: WelcomeScreenRouteProp;
};

export type WelcomeScreenRouteProp = RouteProp<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen(props: PropsType) {
  const theme = ThemedStyles.style;
  const resetRef = React.useRef<ResetPasswordModalHandles>(null);
  const onLoginPress = useCallback(() => {
    props.navigation.navigate('MultiUserLogin');
  }, [props.navigation]);

  const onRegisterPress = useCallback(() => {
    props.navigation.navigate('MultiUserRegister');
  }, [props.navigation]);
  const username = props.route?.params?.username;
  const code = props.route?.params?.code;

  React.useEffect(() => {
    const navToInputPassword = username && code && !!resetRef.current;
    if (navToInputPassword) {
      resetRef.current!.show(navToInputPassword, username, code);
    }
  }, [code, username]);

  const openDevtools = useCallback(
    () => props.navigation.navigate('DevTools'),
    [props.navigation],
  );

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
            mode="outline"
            type="action"
            font="medium"
            bottom="XL"
            onPress={onRegisterPress}
            darkContent>
            {i18n.t('auth.createChannel')}
          </Button>
          <Button font="medium" onPress={onLoginPress}>
            {i18n.t('auth.login')}
          </Button>
        </View>
      </View>
      <ResetPasswordModal ref={resetRef} />

      {IS_REVIEW && (
        <MText style={devtoolsStyle} onPress={openDevtools}>
          Dev Options
        </MText>
      )}
    </SafeAreaView>
  );
}

const devtoolsStyle = ThemedStyles.combine(
  'positionAbsoluteTopRight',
  'marginTop9x',
  'padding5x',
);

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
