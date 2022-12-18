/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  ButtonNestingContext,
  GetProps,
  TamaguiElement,
  ThemeableProps,
  getVariableValue,
  isRSC,
  spacedChildren,
  styled,
  themeable,
  useMediaPropsActive,
} from '@tamagui/core';
import { getFontSize } from '@tamagui/font-size';
import { getButtonSized } from '@tamagui/get-button-sized';
import { useGetThemedIcon } from '@tamagui/helpers-tamagui';
import { ThemeableStack } from '@tamagui/stacks';
import {
  SizableText,
  TextParentStyles,
  wrapChildrenInText,
} from '@tamagui/text';
import { FunctionComponent, forwardRef, useContext } from 'react';

type ButtonIconProps = { color?: string; size?: number };
type IconProp = JSX.Element | FunctionComponent<ButtonIconProps> | null;

export type ButtonProps = Omit<TextParentStyles, 'TextComponent'> &
  GetProps<typeof ButtonFrame> &
  ThemeableProps & {
    /**
     * add icon before, passes color and size automatically if Component
     */
    icon?: IconProp;
    /**
     * add icon after, passes color and size automatically if Component
     */
    iconAfter?: IconProp;
    /**
     * adjust icon relative to size
     */
    /**
     * default: -1
     */
    scaleIcon?: number;
    /**
     * make the spacing elements flex
     */
    spaceFlex?: number | boolean;
    /**
     * adjust internal space relative to icon size
     */
    scaleSpace?: number;
  };

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

    active: {
      true: {
        hoverStyle: {
          backgroundColor: '$background',
        },
      },
    },

    disabled: {
      true: {
        pointerEvents: 'none',
        backgroundColor: '$backgroundDisabled',
        opacity: 0.65,
      },
    },
  } as const,

  defaultVariants: {
    size: '$3',
  },
});

// see TODO breaking types
// type x = GetProps<typeof ButtonFrame>
// type y = x['size']

export const ButtonText = styled(SizableText, {
  color: '$color',
  userSelect: 'none',
  cursor: 'pointer',
  // flexGrow 1 leads to inconsistent native style where text pushes to start of view
  flexGrow: 0,
  flexShrink: 1,
  ellipse: true,

  size: '$b',
  fontFamily: '$body',
  fontWeight: '500',
});

export function useButton(
  props: ButtonProps,
  { Text = ButtonText }: { Text: any } = { Text: ButtonText },
) {
  // careful not to desctructure and re-order props, order is important
  const {
    children,
    icon,
    iconAfter,
    noTextWrap,
    theme: themeName,
    space,
    spaceFlex,
    scaleIcon = 1,
    scaleSpace = 0.66,
    separator,

    // text props
    color,
    fontWeight,
    letterSpacing,
    fontSize,
    fontFamily,
    textAlign,
    textProps,
    ...rest
  } = props;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isNested = isRSC ? false : useContext(ButtonNestingContext);
  const mediaActiveProps = useMediaPropsActive(props);
  const size = mediaActiveProps.size || '$b';
  const iconSize =
    (typeof size === 'number' ? size * 0.5 : getFontSize('$b')) * scaleIcon;
  const getThemedIcon = useGetThemedIcon({ size: iconSize, color });
  const [themedIcon, themedIconAfter] = [icon, iconAfter].map(getThemedIcon);
  const spaceSize = getVariableValue(iconSize) * scaleSpace;
  const contents = wrapChildrenInText(Text, mediaActiveProps);
  const inner =
    themedIcon || themedIconAfter
      ? spacedChildren({
          // a bit arbitrary but scaling to font size is necessary so long as button does
          space: spaceSize,
          spaceFlex,
          separator,
          direction:
            props.flexDirection === 'column' ||
            props.flexDirection === 'column-reverse'
              ? 'vertical'
              : 'horizontal',
          children: [themedIcon, contents, themedIconAfter],
        })
      : contents;

  return {
    spaceSize,
    isNested,
    props: {
      ...(props.disabled && {
        // in rnw - false still has keyboard tabIndex, undefined = not actually focusable
        focusable: undefined,
        // even with tabIndex unset, it will keep focusStyle on web so disable it here
        focusStyle: {
          borderColor: '$background',
        },
      }),
      // fixes SSR issue + DOM nesting issue of not allowing button in button
      ...(isNested
        ? {
            tag: 'span',
          }
        : {}),
      ...rest,
      children: isRSC ? (
        inner
      ) : (
        <ButtonNestingContext.Provider value={true}>
          {inner}
        </ButtonNestingContext.Provider>
      ),
    },
  };
}

const ButtonComponent = forwardRef<TamaguiElement, ButtonProps>(function Button(
  props,
  ref,
) {
  const { props: buttonProps } = useButton(props);
  return <ButtonFrame {...buttonProps} ref={ref} />;
});

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
