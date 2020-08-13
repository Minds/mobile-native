//@ts-nocheck
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, Text } from 'react-native';
import ThemedStyle from '../../styles/ThemedStyles';
import validatePassword from '../helpers/validatePassword';
import i18n from '../services/i18n.service';

const checked = (value) => {
  return (
    <Icon
      size={25}
      name="md-checkmark-sharp"
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
        <Text style={[theme.fontL, theme.paddingLeft2x, props.textStyle]}>
          {i18n.t('settings.passwordFormatMinCharacters')}
        </Text>
      </View>
      <View style={[theme.rowJustifyStart, theme.alignCenter]}>
        {checked(val.specialCharCheck)}
        <Text style={[theme.fontL, theme.paddingLeft2x, props.textStyle]}>
          {i18n.t('settings.passwordFormatSpecialCharacters')}
        </Text>
      </View>
      <View style={[theme.rowJustifyStart, theme.alignCenter]}>
        {checked(val.mixedCaseCheck)}
        <Text style={[theme.fontL, theme.paddingLeft2x, props.textStyle]}>
          {i18n.t('settings.passwordFormatMixedCase')}
        </Text>
      </View>
      <View style={[theme.rowJustifyStart, theme.alignCenter]}>
        {checked(val.numbersCheck)}
        <Text style={[theme.fontL, theme.paddingLeft2x, props.textStyle]}>
          {i18n.t('settings.passwordFormatNumber')}
        </Text>
      </View>
      <View style={[theme.rowJustifyStart, theme.alignCenter]}>
        {checked(val.spacesCheck)}
        <Text style={[theme.fontL, theme.paddingLeft2x, props.textStyle]}>
          {i18n.t('settings.passwordFormatNoSpaces')}
        </Text>
      </View>
    </View>
  );
}
