import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Button from '../../common/components/Button';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { LoginStore } from './createLoginStore';

type PropsType = {
  localStore: LoginStore;
  multiUser?: boolean;
  onRegisterPress?: () => void;
};

const { height } = Dimensions.get('window');

const LoginButtons = ({
  localStore,
  multiUser,
  onRegisterPress,
}: PropsType) => {
  const theme = ThemedStyles.style;
  return (
    <View style={styles.container}>
      <Button
        onPress={localStore.onLoginPress}
        text={i18n.t('auth.login')}
        containerStyle={styles.buttonLoginContainer}
        loading={localStore.inProgress}
        disabled={localStore.inProgress}
        testID="loginButton"
        transparent
        large
      />
      <View style={theme.marginTop4x}>
        <Text style={styles.forgotText} onPress={localStore.onForgotPress}>
          {i18n.t('auth.forgot')}
        </Text>
      </View>
      <View style={theme.flexContainer} />
      {!multiUser && (
        <Button
          onPress={onRegisterPress}
          text={i18n.t('auth.createChannel')}
          containerStyle={styles.buttonRegisterContainer}
          disabled={localStore.inProgress}
          testID="registerButton"
          transparent
          large
        />
      )}
    </View>
  );
};

const styles = ThemedStyles.create({
  container: ['margin6x', 'flexContainer'],
  buttonLoginContainer: ['fullWidth', { marginTop: height / 55 }],
  forgotText: ['colorWhite', 'fontL', 'textCenter'],
  buttonRegisterContainer: ['fullWidth', 'marginTop6x'],
});

export default LoginButtons;
