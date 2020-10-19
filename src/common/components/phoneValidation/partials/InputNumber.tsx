import React, { forwardRef, useCallback, useRef } from 'react';
import { Text, View } from 'react-native';
import ThemedStyles from '../../../../styles/ThemedStyles';
import i18n from '../../../services/i18n.service';
import { PhoneValidationPropsType } from '../PhoneValidationComponent';
import stylesheet from '../../../../onboarding/stylesheet';
import { ComponentsStyle } from '../../../../styles/Components';
import ListItemButton from '../../ListItemButton';
import { observer } from 'mobx-react';
import twoFactorAuthenticationService from '../../../services/two-factor-authentication.service';
import { WalletStoreType } from '../../../../wallet/v2/createWalletStore';
import Colors from '../../../../styles/Colors';
import ActivityIndicator from '../../ActivityIndicator';
import PhoneInput from 'react-native-phone-input';
import { PhoneValidationStoreType } from '../createLocalStore';

type PropsType = {
  localStore: PhoneValidationStoreType;
  wallet: WalletStoreType;
} & PhoneValidationPropsType;

const InputNumber = observer(
  forwardRef(({ localStore, wallet, ...props }: PropsType) => {
    const theme = ThemedStyles.style;

    const phoneInput = useRef<PhoneInput>(null);

    const canJoin = useCallback(() => {
      return phoneInput.current?.isValidNumber();
    }, [phoneInput]);

    const joinAction = useCallback(
      async (retry = false) => {
        if (localStore.inProgress || (!retry && !canJoin()) || !wallet) {
          return null;
        }

        localStore.isJoining();

        try {
          let { secret } = props.TFA
            ? await twoFactorAuthenticationService.authenticate(
                localStore.phone,
              )
            : await wallet.join(localStore.phone, retry);

          localStore.isConfirming(secret);
        } catch (e) {
          const error = (e && e.message) || 'Unknown server error';
          localStore.setInProgress(false);
          localStore.setError(error);
        }
      },
      [canJoin, localStore, props.TFA, wallet],
    );

    let joinButtonContent = (
      <Text
        style={[
          theme.colorPrimaryText,
          theme.padding,
          !canJoin() ? theme.colorSecondaryText : theme.colorPrimaryText,
        ]}>
        {i18n.t('validate')}
      </Text>
    );

    if (localStore.inProgress) {
      joinButtonContent = (
        <ActivityIndicator size="small" color={Colors.primary} />
      );
    }

    const joinActionButton = !props.bottomStore && (
      <ListItemButton
        onPress={joinAction}
        disabled={!canJoin()}
        style={[theme.borderPrimary, theme.borderHair]}>
        {joinButtonContent}
      </ListItemButton>
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
        <View style={[theme.rowStretch]} testID="RewardsOnboarding">
          <PhoneInput
            disabled={localStore.inProgress}
            style={props.inputStyles || defaultStyles}
            textStyle={theme.colorPrimaryText}
            value={localStore.phone}
            onChangePhoneNumber={localStore.setPhone}
            ref={phoneInput}
            placeholder={i18n.t('onboarding.phoneNumber')}
            textProps={{
              onFocus: props.onFocus,
              onBlur: props.onBlur,
            }}
          />
          {joinActionButton}
        </View>
      </View>
    );
  }),
);

export default InputNumber;
