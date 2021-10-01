import React from 'react';
import { View, Dimensions } from 'react-native';
import Button from '../../common/components/Button';
import MText from '../../common/components/MText';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { LoginStore } from './createLoginStore';

type PropsType = {
  localStore: LoginStore;
  multiUser?: boolean;
  onRegisterPress?: () => void;
  relogin?: boolean;
};

const { height } = Dimensions.get('window');

const LoginButtons = ({
  localStore,
  multiUser,
  onRegisterPress,
  relogin,
}: PropsType) => {
  const theme = ThemedStyles.style;
  const alt = !!(relogin || multiUser);
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
        <MText
          style={alt ? styles.forgotTextAlt : styles.forgotText}
          onPress={localStore.onForgotPress}>
          {i18n.t('auth.forgot')}
        </MText>
      </View>
      <View style={theme.flexContainer} />
      {!alt && (
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
  forgotTextAlt: ['colorPrimaryText', 'fontL', 'textCenter'],
  buttonRegisterContainer: ['fullWidth', 'marginTop6x'],
});

export default LoginButtons;
