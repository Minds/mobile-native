import React, { forwardRef, useCallback } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import ThemedStyles from '../../../../styles/ThemedStyles';
import i18n from '../../../services/i18n.service';
import { PhoneValidationPropsType } from '../PhoneValidationComponent';
import stylesheet from '../../../../onboarding/stylesheet';
import { ComponentsStyle } from '../../../../styles/Components';
import ListItemButton from '../../ListItemButton';
import { observer } from 'mobx-react';
import twoFactorAuthenticationService from '../../../services/two-factor-authentication.service';
import { WalletStoreType } from '../../../../wallet/v2/createWalletStore';
import type UserStore from '../../../../auth/UserStore';
import logService from '../../../services/log.service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PhoneValidationStoreType } from '../createLocalStore';

type PropsType = {
  localStore: PhoneValidationStoreType;
  wallet: WalletStoreType;
  user: UserStore;
} & PhoneValidationPropsType;

const ConfirmNumber = observer(
  forwardRef(({ localStore, wallet, user, ...props }: PropsType) => {
    const theme = ThemedStyles.style;

    const confirmAction = useCallback(async () => {
      if (localStore.inProgress || !localStore.canConfirm || !wallet || !user) {
        return null;
      }

      localStore.inProgressNow();

      console.log(localStore.phone, localStore.code, localStore.secret);

      try {
        if (props.TFA) {
          await twoFactorAuthenticationService.check(
            localStore.phone,
            localStore.code,
            localStore.secret,
          );
        } else {
          await wallet.confirm(
            localStore.phone,
            localStore.code,
            localStore.secret,
          );
          user.setRewards(true);
        }
        localStore.isConfirmed();
      } catch (e) {
        const error = (e && e.message) || 'Unknown server error';
        localStore.setError(error);
        logService.exception(e);
      } finally {
        localStore.setInProgress(false);
      }
    }, [localStore, props.TFA, user, wallet]);

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
      stylesheet.col,
      stylesheet.colFirst,
      stylesheet.phoneInput,
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
  }),
);

const style = StyleSheet.create(stylesheet);

export default ConfirmNumber;
