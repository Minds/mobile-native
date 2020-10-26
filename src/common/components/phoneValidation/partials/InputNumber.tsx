import React, { useCallback, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import ThemedStyles from '../../../../styles/ThemedStyles';
import i18n from '../../../services/i18n.service';
import { PhoneValidationPropsType } from '../PhoneValidationComponent';
import stylesheet from '../../../../onboarding/stylesheet';
import { ComponentsStyle } from '../../../../styles/Components';
import ListItemButton from '../../ListItemButton';
import { observer } from 'mobx-react';
import Colors from '../../../../styles/Colors';
import ActivityIndicator from '../../ActivityIndicator';
import PhoneInput from 'react-native-phone-input';
import { PhoneValidationStoreType } from '../createLocalStore';

type PropsType = {
  localStore: PhoneValidationStoreType;
} & PhoneValidationPropsType;

const InputNumber = observer(({ localStore, ...props }: PropsType) => {
  const theme = ThemedStyles.style;

  const phoneInput = useRef<PhoneInput>(null);

  useEffect(() => {
    localStore.setPhoneInputRef(phoneInput);
    return () => {
      localStore.setPhoneInputRef(null);
    };
  }, [phoneInput, localStore]);

  const joinAction = useCallback(
    (retry = false) => {
      localStore.joinAction(props.TFA, retry);
    },
    [localStore, props.TFA],
  );

  let joinButtonContent = (
    <Text
      style={[
        theme.colorPrimaryText,
        theme.padding,
        !localStore.canJoin()
          ? theme.colorSecondaryText
          : theme.colorPrimaryText,
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
      disabled={!localStore.canJoin()}
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
});

export default InputNumber;
