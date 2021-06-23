import React from 'react';
import { observer } from 'mobx-react';
import { View, Text } from 'react-native';
import i18n from '../../common/services/i18n.service';
import { ResetPasswordStore } from './createLocalStore';
import { containerStyle, textStyle } from './EmailSended';
import ThemedStyles from '../../styles/ThemedStyles';
import { styles } from './InputUser';
import { icon } from '../styles';
import Button from '../../common/components/Button';
import PasswordInput from '../../common/components/password-input/PasswordInput';

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
        <PasswordInput
          store={store}
          tooltipBackground={ThemedStyles.getColor('TertiaryBackground')}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
          inputLabelStyle={styles.label}
          iconStyle={iconStyle}
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
