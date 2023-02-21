/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FunctionComponent, useContext } from 'react';
import { getButtonSized } from '@tamagui/get-button-sized';
import {
  ButtonNestingContext,
  FontSizeTokens,
  GetProps,
  getVariableValue,
  isRSC,
  SizeTokens,
  spacedChildren,
  ThemeableProps,
  useMediaPropsActive,
} from '@tamagui/core';
import { getFontSize } from '@tamagui/font-size';
import { useGetThemedIcon } from '@tamagui/helpers-tamagui';
import { TextParentStyles, wrapChildrenInText } from '@tamagui/text';
import { ThemeableStack } from '@tamagui/stacks';
import { VariantSpreadExtras } from '@tamagui/core';

type ButtonIconProps = { color?: string; size?: number };
type IconProp = JSX.Element | FunctionComponent<ButtonIconProps> | null;

export type ButtonType = 'primary' | 'secondary' | 'warning';

export type ButtonProps = Omit<TextParentStyles, 'TextComponent'> &
  // GetProps<typeof ButtonFrame> &
  GetProps<typeof ThemeableStack> &
  ThemeableProps & {
    size?: SizeTokens;

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
    /**
     * semantic size for buttons to propagate to Text
     */
    sSize?: any;

    /**
     * Semantic type
     */
    type?: ButtonType;
    /**
     * Base mode
     */
    base?: boolean;
    /**
     * outline mode
     */
    outline?: boolean;
  };

export function getButtonStyle(
  val: SizeTokens | number,
  variants: VariantSpreadExtras<any>,
): ReturnType<typeof getButtonSized> {
  const style = getButtonSized(val, variants);
  style.borderRadius = 10000; //round buttons
  return style;
}

export function useButton(propsIn: ButtonProps, Text: any) {
  // careful not to desctructure and re-order props, order is important
  const {
    children,
    icon,
    iconAfter,
    noTextWrap,
    space,
    spaceFlex,
    scaleIcon = 2,
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
  } = propsIn;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isNested = isRSC ? false : useContext(ButtonNestingContext);
  const propsActive = useMediaPropsActive(propsIn);

  propsActive.textProps = {
    ...propsActive.textProps,
    ...(propsIn.sSize && { sSize: propsIn.sSize }),
    ...(propsIn.type && { type: propsIn.type }),
  };

  const size = propsActive.size ?? '$3.5';
  const iconSize =
    (typeof size === 'number'
      ? size * 0.5
      : getFontSize(size as FontSizeTokens)) * scaleIcon;
  const getThemedIcon = useGetThemedIcon({ size: iconSize, color });
  const [themedIcon, themedIconAfter] = [icon, iconAfter].map(getThemedIcon);
  const spaceSize = getVariableValue(iconSize) * scaleSpace;
  const contents = wrapChildrenInText(Text, propsActive);
  const inner =
    themedIcon || themedIconAfter
      ? spacedChildren({
          // a bit arbitrary but scaling to font size is necessary so long as button does
          space: spaceSize,
          spaceFlex,
          separator,
          direction:
            propsActive.flexDirection === 'column' ||
            propsActive.flexDirection === 'column-reverse'
              ? 'vertical'
              : 'horizontal',
          children: [themedIcon, contents, themedIconAfter],
        })
      : contents;

  const props = {
    ...(propsActive.disabled && {
      // in rnw - false still has keyboard tabIndex, undefined = not actually focusable
      focusable: undefined,
      // even with tabIndex unset, it will keep focusStyle on web so disable it here
      focusStyle: {
        borderColor: '$background',
      },
    }),
    // fixes SSR issue + DOM nesting issue of not allowing button in button
    tag: isNested ? 'span' : undefined,
    ...rest,
    children: isRSC ? (
      inner
    ) : (
      <ButtonNestingContext.Provider value={true}>
        {inner}
      </ButtonNestingContext.Provider>
    ),
  };

  return {
    spaceSize,
    isNested,
    props,
  };
}
