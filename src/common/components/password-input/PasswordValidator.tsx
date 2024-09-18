import React from 'react';
import Icon from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';
import validatePassword from '../../helpers/validatePassword';
import MText from '../MText';
import sp from '~/services/serviceProvider';

const checked = value => {
  const theme = sp.styles.style;
  return (
    <Icon
      size={25}
      name="checkmark-sharp"
      style={value ? theme.colorGreen : theme.colorTransparent}
    />
  );
};

/**
 * Password validation component
 * @param {Object} props
 */
export default function (props) {
  const theme = sp.styles.style;
  const i18n = sp.i18n;

  const val = validatePassword(props.password);

  return (
    <View>
      <View style={[theme.rowJustifyStart, theme.alignCenter]}>
        {checked(val.lengthCheck)}
        <MText style={[theme.fontL, theme.paddingLeft2x, props.textStyle]}>
          {i18n.t('settings.passwordFormatMinCharacters')}
        </MText>
      </View>
      <View style={[theme.rowJustifyStart, theme.alignCenter]}>
        {checked(val.specialCharCheck)}
        <MText style={[theme.fontL, theme.paddingLeft2x, props.textStyle]}>
          {i18n.t('settings.passwordFormatSpecialCharacters')}
        </MText>
      </View>
      <View style={[theme.rowJustifyStart, theme.alignCenter]}>
        {checked(val.mixedCaseCheck)}
        <MText style={[theme.fontL, theme.paddingLeft2x, props.textStyle]}>
          {i18n.t('settings.passwordFormatMixedCase')}
        </MText>
      </View>
      <View style={[theme.rowJustifyStart, theme.alignCenter]}>
        {checked(val.numbersCheck)}
        <MText style={[theme.fontL, theme.paddingLeft2x, props.textStyle]}>
          {i18n.t('settings.passwordFormatNumber')}
        </MText>
      </View>
      <View style={[theme.rowJustifyStart, theme.alignCenter]}>
        {checked(val.spacesCheck)}
        <MText style={[theme.fontL, theme.paddingLeft2x, props.textStyle]}>
          {i18n.t('settings.passwordFormatNoSpaces')}
        </MText>
      </View>
    </View>
  );
}
