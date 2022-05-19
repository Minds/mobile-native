import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import Input, { PropsType as InputPropsType } from './Input';

export interface InputContainerPropsType extends InputPropsType {
  noBottomBorder?: boolean;
  containerStyle?: ViewStyle | Array<ViewStyle>;
}

const InputContainer = (props: InputContainerPropsType) => {
  const theme = ThemedStyles.style;
  const { style, noBottomBorder, ...otherProps } = props;
  const ref = React.useRef<Input>(null);
  return (
    <View
      style={[
        theme.paddingHorizontal4x,
        theme.paddingTop2x,
        theme.bgSecondaryBackground,
        theme.borderTop,
        noBottomBorder ? null : theme.borderBottom,
        theme.bcolorPrimaryBorder,
        props.containerStyle,
      ]}>
      <Pressable onPress={() => ref.current?.focus()}>
        <Input
          ref={ref}
          style={[
            styles.input,
            theme.paddingLeft0x,
            theme.fontXL,
            theme.colorPrimaryText,
            style,
          ]}
          labelStyle={[
            theme.colorSecondaryText,
            theme.fontL,
            theme.paddingLeft0x,
            props.labelStyle,
          ]}
          {...otherProps}
        />
      </Pressable>
    </View>
  );
};

export default InputContainer;

const styles = StyleSheet.create({
  input: {
    paddingVertical: 6,
    paddingHorizontal: 0,
    marginBottom: 7,
    borderWidth: 0,
  },
});
