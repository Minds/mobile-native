import React from 'react';
import { observer } from 'mobx-react';
import { View, Text } from 'react-native';
import { ResetPasswordStore } from './createLocalStore';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import InputContainer from '../../common/components/InputContainer';
import Button from '../../common/components/Button';
import { DARK_THEME } from '../../styles/Colors';

type PropsType = {
  store: ResetPasswordStore;
};

const InputUser = observer(({ store }: PropsType) => {
  return (
    <View>
      <Text style={styles.text}>{i18n.t('auth.inputUser')}</Text>
      <InputContainer
        containerStyle={styles.inputContainer}
        labelStyle={styles.label}
        style={styles.inputText}
        placeholder={i18n.t('auth.username')}
        onChangeText={store.setUsername}
        autoCompleteType="username"
        textContentType="username"
        value={store.username}
      />
      <Button
        text={i18n.t('continue')}
        onPress={store.sendEmail}
        centered={false}
        containerStyle={styles.button}
        loading={store.sending}
        textColor={DARK_THEME.PrimaryText}
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
    'bcolorPrimaryBorder_Dark',
    'colorSecondaryText_Dark',
  ),
  inputContainer: ThemedStyles.combine(
    'bgPrimaryBackgroundHighlight_Dark',
    'bcolorPrimaryBorder_Dark',
  ),
  label: ThemedStyles.combine('colorSecondaryText_Dark'),
  inputText: ThemedStyles.combine('colorPrimaryText_Dark'),
  button: ThemedStyles.combine('margin6x', 'bgPrimaryBackground_Dark'),
};
