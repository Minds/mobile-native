import { GetProps, setupReactNative, styled } from '@tamagui/core';
import { focusableInputHOC } from '@tamagui/focusable';
import { TextInput as RNTextInput } from 'react-native';
import { inputSizeVariant } from './input-helper';

setupReactNative({ RNTextInput });

export const defaultStyles = {
  size: '$true',
  fontFamily: '$body',
  borderRadius: 0,
  outlineWidth: 0,
  focusable: true,
  color: '$color',
  fontSize: '$b',
  lineHeight: '$b',
  selectionColor: '$action',
  placeholderTextColor: '$colorTextTertiary',

  // this fixes a flex bug where it overflows container
  minWidth: 0,

  focusStyle: {},
} as const;

export const TextInputFrame = styled(
  RNTextInput,
  {
    name: 'TextInput',
    variants: {
      unstyled: {
        false: defaultStyles,
      },

      size: {
        '...size': inputSizeVariant,
      },
    } as const,

    defaultVariants: {
      unstyled: false,
    },
  },
  {
    isInput: true,
  },
);

export type TextInputProps = GetProps<typeof TextInputFrame>;

export const TextInput = focusableInputHOC(TextInputFrame);
