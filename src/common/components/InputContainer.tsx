import React from 'react';
import { View, StyleSheet } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import Input from './Input';

const InputContainer = (props) => {
  const theme = ThemedStyles.style;

  const { style, noBottomBorder, ...otherProps } = props;
  return (
    <View
      style={[
        theme.paddingLeft4x,
        theme.paddingTop3x,
        theme.backgroundSecondary,
        theme.borderTop,
        noBottomBorder ? null : theme.borderBottom,
        theme.borderPrimary,
      ]}>
      <Input
        style={[styles.input, theme.paddingLeft0x, theme.fontXL, style]}
        labelStyle={[
          theme.colorSecondaryText,
          theme.fontL,
          theme.paddingLeft0x,
        ]}
        {...otherProps}
      />
    </View>
  );
};

export default InputContainer;

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 0,
  },
});
