import React from 'react';
import { observer } from 'mobx-react';
import { View } from 'react-native';
import { ResetPasswordStore } from './createLocalStore';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import InputContainer from '../../common/components/InputContainer';
import Button from '../../common/components/Button';
import MText from '../../common/components/MText';

type PropsType = {
  store: ResetPasswordStore;
};

const InputUser = observer(({ store }: PropsType) => {
  return (
    <View>
      <MText style={styles.text}>{i18n.t('auth.inputUser')}</MText>
      <InputContainer
        containerStyle={styles.inputContainer}
        labelStyle={styles.label}
        style={styles.inputText}
        placeholder={i18n.t('auth.username')}
        onChangeText={store.setUsername}
        autoComplete="username"
        textContentType="username"
        value={store.username}
      />
      <Button
        text={i18n.t('continue')}
        onPress={store.sendEmail}
        centered={false}
        containerStyle={styles.button}
        loading={store.sending}
        action
      />
    </View>
  );
});

export default InputUser;

export const styles = {
  text: ThemedStyles.combine(
    'fontMedium',
    'fontL',
    'borderTopHair',
    'textCenter',
    'paddingVertical6x',
    'paddingHorizontal4x',
    'bcolorPrimaryBorder',
    'colorSecondaryText',
  ),
  inputContainer: ThemedStyles.combine(
    'bgPrimaryBackgroundHighlight',
    'bcolorPrimaryBorder',
  ),
  label: ThemedStyles.combine('colorSecondaryText'),
  inputText: ThemedStyles.combine('colorPrimaryText'),
  button: ThemedStyles.combine('margin6x', 'bgPrimaryBackground'),
};
