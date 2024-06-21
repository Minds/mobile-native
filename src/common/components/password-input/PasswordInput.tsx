import React, { forwardRef, useImperativeHandle } from 'react';
import { ColorValue, View } from 'react-native';
import Tooltip from '../Tooltip';
import PasswordValidator from './PasswordValidator';
import ThemedStyles from '../../../styles/ThemedStyles';
import InputContainer, {
  InputContainerImperativeHandle,
  InputContainerPropsType,
} from '../InputContainer';
import i18n from '../../services/i18n.service';
import Icon from '@expo/vector-icons/Ionicons';
import { IS_IOS } from '../../../config/Config';
import { AnimatePresence } from 'moti';

type PropsType = {
  tooltipBackground?: ColorValue;
  showValidator?: boolean;
} & InputContainerPropsType;

const PasswordInput = (
  { showValidator = false, tooltipBackground, ...props }: PropsType,
  ref: React.Ref<InputContainerImperativeHandle>,
): JSX.Element => {
  const theme = ThemedStyles.style;
  const inputRef = React.useRef<InputContainerImperativeHandle>(null);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => inputRef.current?.focus(),
    }),
    [inputRef],
  );
  const [showPassword, setShowPassword] = React.useState(false);

  const toggle = () => setShowPassword(!showPassword);

  return (
    <View>
      <AnimatePresence>
        {showValidator && (
          <Tooltip
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            exitTransition={{
              type: 'timing',
              delay: 700,
              duration: 200,
            }}
            transition={{ type: 'timing', duration: 150 }}
            bottom={12}
            backgroundColor={tooltipBackground}
            containerStyle={theme.paddingLeft2x}>
            <PasswordValidator
              password={props.value}
              textStyle={validatorText}
            />
          </Tooltip>
        )}
      </AnimatePresence>
      <InputContainer
        ref={inputRef}
        placeholder={i18n.t('auth.password')}
        secureTextEntry={!showPassword}
        multiline={false}
        {...props}
      />
      <Icon
        name={showPassword ? 'eye' : 'eye-off'}
        size={25}
        onPress={toggle}
        style={iconStyle}
      />
    </View>
  );
};

export default forwardRef(PasswordInput);

const validatorText = ThemedStyles.combine('colorPrimaryText');

const iconStyle = ThemedStyles.combine(
  {
    position: 'absolute',
    right: 12,
    top: IS_IOS ? 30 : 33,
  },
  'colorSecondaryText',
);
