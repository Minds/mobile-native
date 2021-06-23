import React from 'react';
import { observer } from 'mobx-react';
import { View, Text } from 'react-native';
import i18n from '../../common/services/i18n.service';
import { ResetPasswordStore } from './createLocalStore';
import { containerStyle, textStyle } from './EmailSended';
import Tooltip from '../../common/components/Tooltip';
import PasswordValidator from '../../common/components/PasswordValidator';
import InputContainer from '../../common/components/InputContainer';
import Icon from 'react-native-vector-icons/Ionicons';
import { validatorText } from '../RegisterScreen';
import ThemedStyles from '../../styles/ThemedStyles';
import { styles } from './InputUser';
import { icon } from '../styles';
import Button from '../../common/components/Button';

type PropsType = {
  store: ResetPasswordStore;
  onFinish: () => void;
};

const InputPassword = observer(({ store, onFinish }: PropsType) => {
  const resetPassword = React.useCallback(async () => {
    const success = await store.resetPassword();
    if (success !== false) {
      onFinish();
      success?.login();
    }
  }, [onFinish, store]);
  return (
    <View>
      <View style={containerStyle}>
        <Text style={textStyle}>{i18n.t('auth.newPassword')}</Text>
      </View>
      <View style={wrapperStyle}>
        {!!store.password && store.focused && (
          <Tooltip
            bottom={12}
            backgroundColor={ThemedStyles.getColor('TertiaryBackground')}
            containerStyle={ThemedStyles.style.paddingLeft2x}>
            <PasswordValidator
              password={store.password}
              textStyle={validatorText}
            />
          </Tooltip>
        )}
        <InputContainer
          containerStyle={styles.inputContainer}
          style={styles.inputText}
          labelStyle={styles.label}
          placeholder={i18n.t('auth.password')}
          secureTextEntry={store.hidePassword}
          onChangeText={store.setPassword}
          value={store.password}
          testID="passwordInput"
          onFocus={store.focus}
          onBlur={store.blur}
        />
        <Icon
          name={store.hidePassword ? 'md-eye' : 'md-eye-off'}
          size={25}
          onPress={store.toggleHidePassword}
          style={iconStyle}
        />
      </View>
      <Button
        text={i18n.t('continue')}
        onPress={resetPassword}
        centered={false}
        containerStyle={styles.button}
        loading={store.sending}
        action
      />
    </View>
  );
});

const wrapperStyle = ThemedStyles.combine('marginVertical6x');
const iconStyle = ThemedStyles.combine('inputIcon', 'colorPrimaryText', icon);

export default InputPassword;
