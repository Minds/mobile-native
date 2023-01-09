/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FunctionComponent, useContext } from 'react';

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
import { TextParentStyles } from '@tamagui/text';
import { ThemeableStack } from '@tamagui/stacks';

type ButtonIconProps = { color?: string; size?: number };
type IconProp = JSX.Element | FunctionComponent<ButtonIconProps> | null;
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
  };

export function useButton(propsIn: ButtonProps, Text: any) {
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
  } = propsIn;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isNested = isRSC ? false : useContext(ButtonNestingContext);
  const propsActive = useMediaPropsActive(propsIn);
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

type Props = TextParentStyles & {
  children?: React.ReactNode;
  size?: SizeTokens;
  bSize?: any;
};

export function wrapChildrenInText(TextComponent: any, propsIn: Props) {
  const {
    children,
    textProps,
    size,
    noTextWrap,
    color,
    fontFamily,
    fontSize,
    fontWeight,
    letterSpacing,
    textAlign,
    // custom button variants
    bSize,
  } = propsIn;

  if (noTextWrap || !children) {
    return children;
  }

  // in the case of using variables, like so:
  // <ListItem>Hello, {name}</ListItem>
  // it gives us props.children as ['Hello, ', 'name']
  // but we don't want to wrap multiple SizableText around each part
  // so we group them
  const allChildren = React.Children.toArray(children);
  const nextChildren: any[] = [];
  let lastIsString = false;
  const props: any = {};
  // to avoid setting undefined
  if (color) {
    props.color = color;
  }
  if (fontFamily) {
    props.fontFamily = fontFamily;
  }
  if (fontSize) {
    props.fontSize = fontSize;
  }
  if (fontWeight) {
    props.fontWeight = fontWeight;
  }
  if (letterSpacing) {
    props.letterSpacing = letterSpacing;
  }
  if (textAlign) {
    props.textAlign = textAlign;
  }
  if (size) {
    props.size = size;
  }
  // custom button variants
  if (bSize) {
    props.bSize = bSize;
  }

  console.log('props', props, textProps);

  function concatStringChildren() {
    if (!lastIsString) {
      return;
    }
    const index = nextChildren.length - 1;
    const childrenStrings = nextChildren[index];
    nextChildren[index] = (
      <TextComponent key={index} {...props} {...textProps}>
        {childrenStrings}
      </TextComponent>
    );
  }

  for (const child of allChildren) {
    const last = nextChildren[nextChildren.length - 1];
    const isString = typeof child === 'string';
    if (isString) {
      if (lastIsString) {
        last.push(child);
      } else {
        nextChildren.push([child]);
      }
    } else {
      concatStringChildren();
      nextChildren.push(child);
    }
    lastIsString = isString;
  }
  concatStringChildren();

  return nextChildren;
}
