import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import ThemedStyles from '../../../../styles/ThemedStyles';
import i18n from '../../../services/i18n.service';
import { PhoneValidationPropsType } from '../PhoneValidationComponent';
import { style } from './styles';
import { ComponentsStyle } from '../../../../styles/Components';
import ListItemButton from '../../ListItemButton';
import { observer } from 'mobx-react';
import twoFactorAuthenticationService from '../../../services/two-factor-authentication.service';
import { UserError } from '../../../UserError';
import { PhoneValidationStoreType } from '../createLocalStore';
import TextInput from '../../TextInput';

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
            style.col,
            style.colFirst,
            style.phoneInput,
            ComponentsStyle.loginInputNew,
            theme.marginRight2x,
            theme.bcolorPrimaryBorder,
            theme.colorPrimaryText,
          ]}
          value={localStore.password}
          onChangeText={localStore.setPassword}
          placeholder={i18n.t('passwordPlaceholder')}
          placeholderTextColor={ThemedStyles.getColor('SecondaryText')}
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

export default NumberConfirmed;
