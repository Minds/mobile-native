import React, { forwardRef } from 'react';
import { TamaguiElement, styled, themeable, GetProps } from '@tamagui/core';
import { getButtonSized } from '@tamagui/get-button-sized';
import { ThemeableStack } from '@tamagui/stacks';
import { SizableText } from '@tamagui/text';
import { ButtonProps, useButton } from './buttonHelpers';

const NAME = 'Button';

export const ButtonFrame = styled(ThemeableStack, {
  name: NAME,
  tag: 'button',
  focusable: true,
  hoverTheme: true,
  pressTheme: true,
  backgrounded: true,
  borderWidth: 1,
  borderColor: 'transparent',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'nowrap',
  flexDirection: 'row',
  borderRadius: 10000,

  // if we wanted this only when pressable = true, we'd need to merge variants?
  cursor: 'pointer',

  pressStyle: {
    borderColor: 'transparent',
  },

  hoverStyle: {
    borderColor: 'transparent',
  },

  focusStyle: {
    borderColor: '$borderColorFocus',
  },

  variants: {
    size: {
      '...size': getButtonSized,
    },
    sSize: {
      xl: (_, extra) => getButtonSized('$5', extra),
      l: (_, extra) => getButtonSized('$4', extra),
      m: (_, extra) => getButtonSized('$3.5', extra),
      s: (_, extra) => getButtonSized('$3', extra),
    },
    disabled: {
      true: {
        pointerEvents: 'none',
        opacity: 0.5,
      },
    },
  } as const,

  defaultVariants: {
    size: '$3',
  },
});

export const ButtonText = styled(SizableText, {
  name: NAME,
  userSelect: 'none',
  cursor: 'pointer',
  // flexGrow 1 leads to inconsistent native style where text pushes to start of view
  flexGrow: 0,
  flexShrink: 1,
  ellipse: true,

  variants: {
    sSize: {
      xl: {
        size: '$5',
      },
      l: {
        size: '$4',
      },
      m: {
        size: '$3.5',
      },
      s: {
        size: '$3',
      },
    },
  } as const,
  defaultVariants: {
    size: '$3.5',
  },
});

type ButtonFrameProps = GetProps<typeof ButtonFrame>;
const ButtonComponent = forwardRef<TamaguiElement, ButtonFrameProps>(
  (props, ref) => {
    const { props: buttonProps } = useButton(props as ButtonProps, ButtonText);
    return <ButtonFrame {...buttonProps} ref={ref} />;
  },
);

export const buttonStaticConfig = {
  inlineProps: new Set([
    // text props go here (can't really optimize them, but we never fully extract button anyway)
    // may be able to remove this entirely, as the compiler / runtime have gotten better
    'color',
    'fontWeight',
    'fontSize',
    'fontFamily',
    'letterSpacing',
    'textAlign',
  ]),
};

export const Button = ButtonFrame.extractable(
  themeable(ButtonComponent, ButtonFrame.staticConfig),
  buttonStaticConfig,
);
