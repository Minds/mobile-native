import React from 'react';
import { observer } from 'mobx-react';
import { View } from 'react-native';
import { ResetPasswordStore } from './createLocalStore';

import InputContainer from '~/common/components/InputContainer';
import MText from '~/common/components/MText';
import { Button } from '~/common/ui';
import { IS_IPAD } from '~/config/Config';
import sp from '~/services/serviceProvider';

type PropsType = {
  store: ResetPasswordStore;
};

const InputUser = observer(({ store }: PropsType) => {
  const i18n = sp.i18n;
  return (
    <View>
      <MText style={styles.text}>{i18n.t('auth.inputUser')}</MText>
      <InputContainer
        labelStyle={styles.label}
        style={styles.inputText}
        placeholder={i18n.t('auth.username')}
        onChangeText={store.setUsername}
        autoComplete="username"
        textContentType="username"
        value={store.username}
      />
      <Button
        horizontal="L2"
        type={'action'}
        onPress={store.sendEmail}
        containerStyle={IS_IPAD ? styles.buttonIpad : styles.button}
        loading={store.sending}
        spinner
        disabled={!store.username || store.rateLimited}>
        {i18n.t('continue')}
      </Button>
    </View>
  );
});

export default InputUser;

export const styles = {
  text: sp.styles.combine(
    'fontMedium',
    'fontL',
    'textCenter',
    'paddingVertical6x',
    'paddingHorizontal4x',
    'colorSecondaryText',
    {
      top: -3,
    },
  ),
  label: sp.styles.combine('colorSecondaryText'),
  inputText: sp.styles.combine('colorPrimaryText'),
  button: sp.styles.combine('margin6x', 'marginTop10x'),
  buttonIpad: sp.styles.combine('margin6x', 'marginTop10x', {
    width: '45%',
    alignSelf: 'center',
  }),
};
