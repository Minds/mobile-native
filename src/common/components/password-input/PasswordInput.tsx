import React from 'react';
import { ColorValue, View } from 'react-native';
import Tooltip from '../Tooltip';
import PasswordValidator from './PasswordValidator';
import ThemedStyles from '../../../styles/ThemedStyles';
import InputContainer, { InputContainerPropsType } from '../InputContainer';
import i18n from '../../services/i18n.service';
import Icon from 'react-native-vector-icons/Ionicons';
import { IS_IOS } from '../../../config/Config';

type PropsType = {
  tooltipBackground?: ColorValue;
  showValidator?: boolean;
} & InputContainerPropsType;

const PasswordInput = ({
  showValidator = false,
  tooltipBackground,
  ...props
}: PropsType) => {
  const theme = ThemedStyles.style;

  const [showPassword, setShowPassword] = React.useState(false);

  const toggle = () => setShowPassword(!showPassword);

  return (
    <View>
      {showValidator && (
        <Tooltip
          bottom={12}
          backgroundColor={tooltipBackground}
          containerStyle={theme.paddingLeft2x}>
          <PasswordValidator password={props.value} textStyle={validatorText} />
        </Tooltip>
      )}
      <InputContainer
        placeholder={i18n.t('auth.password')}
        secureTextEntry={!showPassword}
        {...props}
      />
      <Icon
        name={showPassword ? 'md-eye' : 'md-eye-off'}
        size={25}
        onPress={toggle}
        style={iconStyle}
      />
    </View>
  );
};

export default PasswordInput;

const validatorText = ThemedStyles.combine('colorPrimaryText');

const iconStyle = ThemedStyles.combine(
  {
    position: 'absolute',
    right: 12,
    top: IS_IOS ? 30 : 33,
  },
  'colorSecondaryText',
);
