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
        styles.container,
        theme.backgroundSecondary,
        theme.borderTop,
        noBottomBorder ? null : theme.borderBottom,
        theme.borderPrimary,
        props.containerStyle,
      ]}>
      <Input
        style={[styles.input, theme.paddingLeft0x, theme.fontXL, style]}
        labelStyle={[
          theme.colorSecondaryText,
          theme.fontL,
          theme.paddingLeft0x,
          props.labelStyle,
        ]}
        {...otherProps}
      />
    </View>
  );
};

export default InputContainer;

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
  },
  input: {
    padding: 0,
    height: 32,
    marginBottom: 7,
    borderWidth: 0,
  },
});
