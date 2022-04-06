import React from 'react';
import { observer } from 'mobx-react';
import { View } from 'react-native';
import { ResetPasswordStore } from './createLocalStore';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import InputContainer from '../../common/components/InputContainer';
import MText from '../../common/components/MText';
import { Button } from '~/common/ui';

type PropsType = {
  store: ResetPasswordStore;
};

const InputUser = observer(({ store }: PropsType) => {
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
        mode="outline"
        horizontal="L2"
        type={store.username ? 'action' : undefined}
        onPress={store.sendEmail}
        containerStyle={styles.button}
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
  text: ThemedStyles.combine(
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
  label: ThemedStyles.combine('colorSecondaryText'),
  inputText: ThemedStyles.combine('colorPrimaryText'),
  button: ThemedStyles.combine(
    'margin6x',
    'bgPrimaryBackground',
    'marginTop10x',
  ),
};
