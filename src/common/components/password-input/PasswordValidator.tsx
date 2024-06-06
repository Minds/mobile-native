//@ts-nocheck
import React from 'react';
import Icon from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';
import ThemedStyle from '../../../styles/ThemedStyles';
import validatePassword from '../../helpers/validatePassword';
import i18n from '../../services/i18n.service';
import MText from '../MText';

const checked = value => {
  return (
    <Icon
      size={25}
      name="checkmark-sharp"
      style={
        value
          ? ThemedStyle.style.colorGreen
          : ThemedStyle.style.colorTransparent
      }
    />
  );
};

/**
 * Password validation component
 * @param {Object} props
 */
export default function (props) {
  const theme = ThemedStyle.style;

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
