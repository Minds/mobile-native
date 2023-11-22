// @ts-nocheck TODO: fix TS errors of tamagui
import React from 'react';
import { View } from 'react-native';
import {
  GetProps,
  getTokens,
  getVariableValue,
  Stack,
  styled,
} from '@tamagui/core';
import { XStack } from '@tamagui/stacks';

const size = getVariableValue(getTokens().size['$1']);

const SwitchFrame = styled(XStack, {
  name: 'Switch',
  tag: 'switch',
  borderRadius: 1000,

  width: '$4.5',
  padding: '$0.5',
  variants: {
    active: {
      false: {
        backgroundColor: '$grey-600',
      },
      true: {
        backgroundColor: '$action',
      },
    },
  } as const,

  defaultVariants: {
    active: false,
  },
});

type SwitchButtonProps = GetProps<typeof SwitchFrame>;

export type SwitchProps = SwitchButtonProps & {
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?(checked: boolean): void;
};

export const Switch = SwitchFrame.extractable(
  React.forwardRef<View, SwitchProps>(
    (
      { checked, defaultChecked, onCheckedChange, ...props }: SwitchProps,
      forwardedRef,
    ) => {
      const [active, setActive] = React.useState(Boolean(defaultChecked));
      const currentValue = checked ?? active;

      if (!props.onPress) {
        props.onPress = () => {
          setActive(!currentValue);
          onCheckedChange?.(!currentValue);
        };
      }

      return (
        <SwitchFrame {...props} active={currentValue} ref={forwardedRef}>
          <Stack
            animation="quick"
            width="$1.5"
            height="$1.5"
            backgroundColor={'$background'}
            borderRadius={1000}
            x={currentValue ? size : 0}
          />
        </SwitchFrame>
      );
    },
  ),
);
