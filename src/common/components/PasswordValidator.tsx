//@ts-nocheck
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, Text } from 'react-native';
import ThemedStyle from '../../styles/ThemedStyles';
import validatePassword from '../helpers/validatePassword';

const checked = value => {
  if (value) {
    return (
      <Icon
        size={34}
        name="ios-checkmark"
        style={ThemedStyle.style.colorGreen}
      />
    );
  } else {
    return (
      <Icon size={34} name="ios-close" style={ThemedStyle.style.colorAlert} />
    );
  }
};

/**
 * Password validation component
 * @param {Object} props
 */
export default function(props) {
  const theme = ThemedStyle.style;

  const val = validatePassword(props.password);

  return (
    <View style={theme.flexColumnStretch}>
      <View style={[theme.rowJustifyStart, theme.alignCenter]}>
        {checked(val.lengthCheck)}
        <Text style={[theme.fontL, theme.paddingLeft2x]}>
          8 or more characters
        </Text>
      </View>
      <View style={[theme.rowJustifyStart, theme.alignCenter]}>
        {checked(val.specialCharCheck)}
        <Text style={[theme.fontL, theme.paddingLeft2x]}>
          At least 1 special character
        </Text>
      </View>
      <View style={[theme.rowJustifyStart, theme.alignCenter]}>
        {checked(val.mixedCaseCheck)}
        <Text style={[theme.fontL, theme.paddingLeft2x]}>Mixed case</Text>
      </View>
      <View style={[theme.rowJustifyStart, theme.alignCenter]}>
        {checked(val.numbersCheck)}
        <Text style={[theme.fontL, theme.paddingLeft2x]}>
          At least 1 number
        </Text>
      </View>
      <View style={[theme.rowJustifyStart, theme.alignCenter]}>
        {checked(val.spacesCheck)}
        <Text style={[theme.fontL, theme.paddingLeft2x]}>
          Doesn't have spaces
        </Text>
      </View>
    </View>
  );
}
