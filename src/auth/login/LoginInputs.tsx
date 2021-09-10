import React from 'react';
import { View, Platform } from 'react-native';
import BoxShadow from '../../common/components/BoxShadow';
import InputContainer from '../../common/components/InputContainer';
import i18n from '../../common/services/i18n.service';
import { LoginStore } from './createLoginStore';
import { styles, shadowOpt, icon } from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';
import ThemedStyles from '../../styles/ThemedStyles';
import { observer } from 'mobx-react-lite';

type PropsType = {
  localStore: LoginStore;
  multiUser?: boolean;
};

const LoginInputs = observer(({ localStore, multiUser }: PropsType) => {
  const theme = ThemedStyles.style;

  const Inputs = (
    <View style={styles.shadow}>
      <InputContainer
        containerStyle={styles.inputBackground}
        labelStyle={theme.colorWhite}
        style={theme.colorWhite}
        placeholder={i18n.t('auth.username')}
        onChangeText={localStore.setUsername}
        autoCompleteType="username"
        textContentType="username"
        value={localStore.username}
        testID="usernameInput"
        noBottomBorder
        autoFocus={multiUser}
      />
      <View>
        <InputContainer
          containerStyle={styles.inputBackground}
          labelStyle={theme.colorWhite}
          style={theme.colorWhite}
          placeholder={i18n.t('auth.password')}
          secureTextEntry={localStore.hidePassword}
          autoCompleteType="password"
          textContentType="password"
          onChangeText={localStore.setPassword}
          value={localStore.password}
          testID="userPasswordInput"
        />
        <Icon
          name={localStore.hidePassword ? 'md-eye' : 'md-eye-off'}
          size={25}
          onPress={localStore.toggleHidePassword}
          style={[theme.inputIcon, icon]}
        />
      </View>
    </View>
  );

  const InputsWithShadow = Platform.select({
    ios: Inputs,
    android: <BoxShadow setting={shadowOpt}>{Inputs}</BoxShadow>, // Android fallback for shadows
  });

  return InputsWithShadow!; // the ! is because of the possible undefined value that in our case never ocurr
});

export default LoginInputs;
