import React, { useCallback } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import ThemedStyles from '../../../../styles/ThemedStyles';
import i18n from '../../../services/i18n.service';
import { PhoneValidationPropsType } from '../PhoneValidationComponent';
import stylesheet from '../../../../onboarding/stylesheet';
import { ComponentsStyle } from '../../../../styles/Components';
import ListItemButton from '../../ListItemButton';
import { observer } from 'mobx-react';
import twoFactorAuthenticationService from '../../../services/two-factor-authentication.service';
import { UserError } from '../../../UserError';
import { PhoneValidationStoreType } from '../createLocalStore';

type PropsType = {
  localStore: PhoneValidationStoreType;
} & PhoneValidationPropsType;

const NumberConfirmed = observer(({ localStore, ...props }: PropsType) => {
  const theme = ThemedStyles.style;

  const remove2FA = useCallback(async () => {
    try {
      const { status } = await twoFactorAuthenticationService.remove(
        localStore.password,
      );
      if (status === 'error') {
        throw new Error('invalid password');
      } else {
        localStore.setTFAConfirmed(false);
      }
    } catch (err) {
      new UserError(i18n.t('auth.invalidPassword'));
    }
  }, [localStore]);

  if (!props.TFA) {
    return (
      <Text style={theme.colorPrimaryText}>
        {i18n.t('onboarding.numberConfirmed')}
      </Text>
    );
  }

  return (
    <View>
      <Text style={[theme.colorPrimaryText, theme.marginBottom4x]}>
        {i18n.t('settings.TFAEnabled')}
      </Text>
      <View style={[style.cols, style.form]}>
        <TextInput
          style={[
            stylesheet.col,
            stylesheet.colFirst,
            stylesheet.phoneInput,
            ComponentsStyle.loginInputNew,
            theme.marginRight2x,
            theme.borderPrimary,
            theme.colorPrimaryText,
          ]}
          value={localStore.password}
          onChangeText={localStore.setPassword}
          placeholder={i18n.t('passwordPlaceholder')}
          placeholderTextColor={ThemedStyles.getColor('secondary_text')}
        />
        <ListItemButton onPress={remove2FA}>
          <Text style={theme.colorPrimaryText}>
            {i18n.t('settings.TFADisable')}
          </Text>
        </ListItemButton>
      </View>
    </View>
  );
});

const style = StyleSheet.create(stylesheet);

export default NumberConfirmed;
