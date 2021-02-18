import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import Input, { PropsType as InputPropsType } from './Input';

export interface PropsType extends InputPropsType {
  noBottomBorder?: boolean;
  containerStyle?: ViewStyle | Array<ViewStyle>;
}

const InputContainer = (props: PropsType) => {
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
        style={[
          styles.input,
          theme.paddingLeft0x,
          theme.fontXL,
          style,
          // heightStyle,
        ]}
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
    paddingTop: 10,
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 0,
    marginBottom: 7,
    borderWidth: 0,
  },
});
