import { RouteProp } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import MText from '~/common/components/MText';
import { DEV_MODE } from '~/config/Config';
import { HiddenTap } from '~/settings/screens/DevToolsScreen';
import { Button } from '~ui';
import i18n from '../common/services/i18n.service';
import { AuthStackParamList } from '../navigation/NavigationTypes';
import ThemedStyles from '../styles/ThemedStyles';

const { height } = Dimensions.get('window');
const LOGO_HEIGHT = height / 7;

type PropsType = {
  navigation: any;
  route: WelcomeScreenRouteProp;
};

export type WelcomeScreenRouteProp = RouteProp<AuthStackParamList, 'Welcome'>;

function WelcomeScreen(props: PropsType) {
  const theme = ThemedStyles.style;
  const onLoginPress = useCallback(() => {
    props.navigation.navigate('MultiUserLogin');
  }, [props.navigation]);

  const onRegisterPress = useCallback(() => {
    props.navigation.navigate('MultiUserRegister');
  }, [props.navigation]);

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
            testID="joinNowButton"
            onPress={onRegisterPress}
            darkContent>
            {i18n.t('auth.createChannel')}
          </Button>
          <Button font="medium" onPress={onLoginPress}>
            {i18n.t('auth.login')}
          </Button>
        </View>
      </View>

      {DEV_MODE.isActive && (
        <MText style={devtoolsStyle} onPress={openDevtools}>
          Dev Options
        </MText>
      )}
      <HiddenTap style={devToggleStyle}>
        <View />
      </HiddenTap>
    </SafeAreaView>
  );
}

const devtoolsStyle = ThemedStyles.combine(
  'positionAbsoluteTopRight',
  'marginTop9x',
  'padding5x',
);

const devToggleStyle = ThemedStyles.combine(
  'positionAbsoluteTopLeft',
  'width30',
  'marginTop9x',
  'padding5x',
);

export default observer(WelcomeScreen);

const styles = StyleSheet.create({
  bulb: {
    width: '100%',
    height: LOGO_HEIGHT,
    justifyContent: 'flex-end',
    // height: 70,
  },
  image: {
    height: '14%',
    width: '50%',
    position: 'absolute',
    top: '10%',
    alignSelf: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '3%',
    left: 0,
    right: 0,
    padding: 32,
  },
  buttonContainerStyle: {
    alignSelf: 'stretch',
    marginBottom: 20,
  },
});
