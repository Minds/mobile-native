import React from 'react';
import { GetProps, Stack, styled, withStaticProperties } from '@tamagui/core';
import { XStack } from '@tamagui/stacks';
import { AnimatePresence } from '@tamagui/animate-presence';

import { Text } from '../Text';

const RadioFrame = styled(XStack, {
  name: 'Radio',
  tag: 'button',
});

const exitStyle = {
  scale: 0.2,
  opacity: 0,
};
const enterStyle = {
  scale: 1,
  opacity: 1,
};

const StyledBullet = styled(Stack, {
  name: 'Radio',
  tag: 'radio',
  width: '$1.5',
  height: '$1.5',
  borderRadius: 1000,
  padding: '$0.5',
  variants: {
    disabled: {
      false: {
        backgroundColor: '$grey-600',
      },
      true: {
        backgroundColor: '$grey-500',
      },
    },
  } as const,

  defaultVariants: {
    disabled: false,
  },
});

type RadioButtonProps = GetProps<typeof RadioFrame>;

type RadioGroupProps = {
  onValueChange: (string) => void;
  initialValue?: string;
  children?: React.ReactNode;
};

type ContextType = {
  value: string;
  setValue: (string) => void;
} | null;

const RadioContext = React.createContext<ContextType>(null);

export type RadioProps = RadioButtonProps & {
  value: string;
  label?: string;
};

const Item = ({ value, label = '' }: RadioProps) => {
  const context = React.useContext(RadioContext);
  const enabled = value === context?.value;
  return (
    <XStack onPress={() => context?.setValue(value)}>
      <StyledBullet>
        <AnimatePresence>
          {enabled && (
            <Stack
              key="enabledBullet"
              animation="quick"
              width="$1"
              height="$1"
              borderColor="$grey-600"
              borderWidth="$0.5"
              backgroundColor={'$action'}
              borderRadius={1000}
              enterStyle={enterStyle}
              exitStyle={exitStyle}
            />
          )}
        </AnimatePresence>
      </StyledBullet>
      {/* @ts-ignore TODO: fix TS errors of tamagui */}
      <Text pl="$2" size="$b1">
        {label}
      </Text>
    </XStack>
  );
};

export const RadioGroup = withStaticProperties(
  ({ onValueChange, initialValue, children }: RadioGroupProps) => {
    const [value, setValueState] = React.useState(initialValue ?? '');
    const setValue = (newValue: string) => {
      if (value !== newValue) {
        setValueState(newValue);
        onValueChange(newValue);
      }
    };

    return (
      <RadioContext.Provider value={{ value, setValue }}>
        {children}
      </RadioContext.Provider>
    );
  },
  {
    Item,
  },
);
