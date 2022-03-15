import React from 'react';
import { observer } from 'mobx-react';
import { ColorValue, ViewStyle, TextStyle, View } from 'react-native';
import Tooltip from '../Tooltip';
import PasswordValidator from './PasswordValidator';
import ThemedStyles from '../../../styles/ThemedStyles';
import InputContainer from '../InputContainer';
import i18n from '../../services/i18n.service';
import Icon from 'react-native-vector-icons/Ionicons';
import { IS_IOS } from '../../../config/Config';
import { PropsType as InputPropsType } from '../Input';

type StoreType = {
  password: string;
  focused: boolean;
  hidePassword: boolean;
  focus: () => void;
  blur: () => void;
  setPassword: (string) => void;
} & any;

type PropsType = {
  store: StoreType;
  tooltipBackground: ColorValue;
  inputContainerStyle?: ViewStyle | ViewStyle[];
  inputStyle?: any;
  inputProps?: InputPropsType;
  inputLabelStyle?: TextStyle | TextStyle[];
};

const PasswordInput = observer(({ store, ...props }: PropsType) => {
  const theme = ThemedStyles.style;

  return (
    <View>
      {!!store.password && store.focused && (
        <Tooltip
          bottom={12}
          backgroundColor={props.tooltipBackground}
          containerStyle={theme.paddingLeft2x}>
          <PasswordValidator
            password={store.password}
            textStyle={validatorText}
          />
        </Tooltip>
      )}
      <InputContainer
        containerStyle={props.inputContainerStyle}
        style={props.inputStyle}
        labelStyle={props.inputLabelStyle}
        placeholder={i18n.t('auth.password')}
        secureTextEntry={store.hidePassword}
        onChangeText={store.setPassword}
        value={store.password}
        testID="passwordInput"
        onFocus={store.focus}
        onBlur={store.blur}
        {...props.inputProps}
      />
      <Icon
        name={store.hidePassword ? 'md-eye' : 'md-eye-off'}
        size={25}
        onPress={store.toggleHidePassword}
        style={iconStyle}
      />
    </View>
  );
});

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
