import React from 'react';
import { observer } from 'mobx-react';
import { View } from 'react-native';
import { ResetPasswordStore } from './createLocalStore';
import { containerStyle, textStyle } from './EmailSended';

import { styles } from './InputUser';
import { Button } from '~/common/ui';
import PasswordInput from '~/common/components/password-input/PasswordInput';
import MText from '~/common/components/MText';
import { IS_IPAD } from '~/config/Config';
import sp from '~/services/serviceProvider';

type PropsType = {
  store: ResetPasswordStore;
  onFinish: () => void;
};

const InputPassword = observer(({ store, onFinish }: PropsType) => {
  const i18n = sp.i18n;
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
          tooltipBackground={sp.styles.getColor('TertiaryBackground')}
          onChangeText={store.setPassword}
        />
      </View>
      <Button
        horizontal="L2"
        type="action"
        onPress={resetPassword}
        containerStyle={IS_IPAD ? styles.buttonIpad : styles.button}
        spinner
        disabled={!store.password}
        loading={store.sending}>
        {i18n.t('continue')}
      </Button>
    </View>
  );
});

const wrapperStyle = sp.styles.combine('marginVertical6x');

export default InputPassword;
