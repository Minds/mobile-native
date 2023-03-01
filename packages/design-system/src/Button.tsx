import React, { forwardRef } from 'react';
import { TamaguiElement, styled, themeable } from '@tamagui/core';
import { YStack } from '@tamagui/stacks';
import { SizableText } from '@tamagui/text';
import { ButtonProps, getButtonStyle, useButton } from './buttonHelpers';

const NAME = 'Button';

export const ButtonFrame = styled(YStack, {
  name: NAME,
  tag: 'button',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'nowrap',
  flexDirection: 'row',
  // if we wanted this only when pressable = true, we'd need to merge variants?
  cursor: 'pointer',

  variants: {
    size: {
      '...size': getButtonStyle,
    },
    sSize: {
      xl: (_, extra) => getButtonStyle('$5', extra),
      l: (_, extra) => getButtonStyle('$4', extra),
      m: (_, extra) => getButtonStyle('$3.5', extra),
      s: (_, extra) => getButtonStyle('$3', extra),
      xs: (_, extra) => getButtonStyle('$2.5', extra),
    },
    circular: {
      true: {
        size: '$2.5',
        width: '$2.5',
        paddingHorizontal: '$0',
      },
    },
    disabled: {
      true: {
        pointerEvents: 'none',
        opacity: 0.5,
      },
    },
    mode: {
      solid: {},
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
      },
      base: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'transparent',
      },
    },
    type: {
      primary: {
        backgroundColor: '$backgroundPrimary',
        borderColor: '$borderColorPrimary',
        color: '$colorPrimary',
        focusStyle: {
          backgroundColor: '$backgroundFocusPrimary',
          borderColor: '$borderColorFocusPrimary',
        },
        pressStyle: {
          backgroundColor: '$backgroundPressPrimary',
          borderColor: '$borderColorPressPrimary',
        },
        hoverStyle: {
          backgroundColor: '$backgroundHoverPrimary',
          borderColor: '$borderColorHoverPrimary',
        },
      },
      secondary: {
        backgroundColor: '$backgroundSecondary',
        borderColor: '$borderColorSecondary',

        focusStyle: {
          backgroundColor: '$backgroundFocusSecondary',
          borderColor: '$borderColorFocusSecondary',
        },
        pressStyle: {
          backgroundColor: '$backgroundPressSecondary',
          borderColor: '$borderColorPressSecondary',
        },
        hoverStyle: {
          backgroundColor: '$backgroundHoverSecondary',
          borderColor: '$borderColorHoverSecondary',
        },
      },
      warning: {
        backgroundColor: '$backgroundWarning',
        borderColor: '$borderColorWarning',

        focusStyle: {
          backgroundColor: '$backgroundFocusWarning',
          borderColor: '$borderColorFocusWarning',
        },
        pressStyle: {
          backgroundColor: '$backgroundPressWarning',
          borderColor: '$borderColorPressWarning',
        },
        hoverStyle: {
          backgroundColor: '$backgroundHoverWarning',
          borderColor: '$borderColorHoverWarning',
        },
      },
    },
  } as const,

  defaultVariants: {
    type: 'primary',
    mode: 'solid',
    sSize: 'm',
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
    mode: {
      solid: {},
      outline: {},
      base: {},
    },
    type: (type, { props }) =>
      ({
        primary: {
          color:
            props['mode'] === 'solid'
              ? '$colorPrimaryInverted'
              : '$colorPrimary',
        },
        secondary: {
          color: '$colorSecondary',
        },
        warning: {
          color: '$colorWarning',
        },
      }[type]),
  } as const,
  defaultVariants: {
    sSize: 'm',
    type: 'primary',
    mode: 'solid',
  },
});

const ButtonComponent = forwardRef<TamaguiElement, ButtonProps>(
  (props, ref) => {
    const { props: buttonProps } = useButton(props, ButtonText);
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
