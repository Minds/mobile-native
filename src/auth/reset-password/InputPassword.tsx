import React from 'react';
import { observer } from 'mobx-react';
import { View } from 'react-native';
import i18n from '../../common/services/i18n.service';
import { ResetPasswordStore } from './createLocalStore';
import { containerStyle, textStyle } from './EmailSended';
import ThemedStyles from '../../styles/ThemedStyles';
import { styles } from './InputUser';
import Button from '../../common/components/Button';
import PasswordInput from '../../common/components/password-input/PasswordInput';
import { DARK_THEME } from '../../styles/Colors';
import MText from '../../common/components/MText';

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
        <MText style={textStyle}>{i18n.t('auth.newPassword')}</MText>
      </View>
      <View style={wrapperStyle}>
        <PasswordInput
          showValidator={store.focused && Boolean(store.password)}
          onFocus={store.focus}
          onBlur={store.blur}
          value={store.password}
          tooltipBackground={DARK_THEME.TertiaryBackground}
          onChangeText={store.setPassword}
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

export default InputPassword;
