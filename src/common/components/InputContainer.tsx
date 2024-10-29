import React, { forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';

import Input, { PropsType as InputPropsType } from './Input';
import sp from '~/services/serviceProvider';

export interface InputContainerPropsType extends InputPropsType {
  noBottomBorder?: boolean;
  containerStyle?: ViewStyle | Array<ViewStyle>;
}

export interface InputContainerImperativeHandle {
  focus: () => void;
}

const InputContainer = (
  props: InputContainerPropsType,
  ref: React.Ref<InputContainerImperativeHandle>,
) => {
  const theme = sp.styles.style;
  const { style, noBottomBorder, ...otherProps } = props;
  const inputRef = React.useRef<Input>(null);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => inputRef.current?.focus(),
    }),
    [inputRef],
  );

  return (
    <View
      style={[
        theme.paddingHorizontal4x,
        theme.paddingTop2x,
        theme.bgPrimaryBackgroundHighlight,
        theme.borderTop,
        noBottomBorder ? null : theme.borderBottom,
        theme.bcolorPrimaryBorder,
        props.containerStyle,
      ]}>
      <Pressable accessible={false} onPress={() => inputRef.current?.focus()}>
        <Input
          ref={inputRef}
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

export default forwardRef(InputContainer);

const styles = StyleSheet.create({
  input: {
    paddingVertical: 6,
    paddingHorizontal: 0,
    marginBottom: 7,
    borderWidth: 0,
  },
});
