import React, { useCallback } from 'react';
import { Text, TextInput, View } from 'react-native';
import ThemedStyles from '../../../../styles/ThemedStyles';
import i18n from '../../../services/i18n.service';
import { PhoneValidationPropsType } from '../PhoneValidationComponent';
import { style } from './styles';
import { ComponentsStyle } from '../../../../styles/Components';
import ListItemButton from '../../ListItemButton';
import { observer } from 'mobx-react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PhoneValidationStoreType } from '../createLocalStore';
import { useLegacyStores } from '../../../hooks/use-stores';

type PropsType = {
  localStore: PhoneValidationStoreType;
} & PhoneValidationPropsType;

const ConfirmNumber = observer(({ localStore, ...props }: PropsType) => {
  const theme = ThemedStyles.style;

  const confirmAction = useCallback(() => {
    localStore.confirmAction(useLegacyStores().user, props.TFA);
  }, [localStore, props.TFA]);

  const joinActionButton = !props.bottomStore && (
    <ListItemButton disabled={!localStore.canConfirm} onPress={confirmAction}>
      <Icon
        name={'check'}
        size={26}
        style={
          !localStore.canConfirm ? theme.colorSecondaryText : theme.colorDone
        }
      />
    </ListItemButton>
  );

  const text = !props.bottomStore && (
    <Text style={theme.colorPrimaryText}>
      {i18n.t('onboarding.weJustSentCode', { phone: localStore.phone })}
    </Text>
  );

  const defaultStyles = [
    style.col,
    style.colFirst,
    style.phoneInput,
    ComponentsStyle.loginInputNew,
    theme.marginRight2x,
    theme.borderPrimary,
  ];

  return (
    <View>
      {text}
      <View style={[style.cols, style.form]}>
        <TextInput
          style={props.inputStyles || defaultStyles}
          value={localStore.code}
          onChangeText={localStore.setCode}
          placeholder={
            !props.bottomStore ? i18n.t('onboarding.confirmationCode') : ''
          }
          placeholderTextColor={ThemedStyles.getColor('secondary_text')}
          keyboardType="numeric"
        />
        {joinActionButton}
      </View>
    </View>
  );
});

export default ConfirmNumber;
