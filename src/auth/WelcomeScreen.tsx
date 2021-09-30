import { RouteProp } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../common/components/Button';
import i18n from '../common/services/i18n.service';
import { AuthStackParamList } from '../navigation/NavigationTypes';
import ThemedStyles, { useStyle } from '../styles/ThemedStyles';

const { height, width } = Dimensions.get('window');
const LOGO_HEIGHT = height / 7;

type PropsType = {
  navigation: any;
  route: WelcomeScreenRouteProp;
};

export type WelcomeScreenRouteProp = RouteProp<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen(props: PropsType) {
  const theme = ThemedStyles.style;

  const onLoginPress = useCallback(() => {
    props.navigation.navigate('MultiUserLogin');
  }, [props.navigation]);

  const onRegisterPress = useCallback(() => {
    props.navigation.navigate('MultiUserRegister');
  }, [props.navigation]);

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
