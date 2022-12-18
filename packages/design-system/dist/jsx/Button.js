import {
  ButtonNestingContext,
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
import { SizableText, wrapChildrenInText } from '@tamagui/text';
import { forwardRef, useContext } from 'react';
const NAME = 'Button';
const ButtonFrame = styled(ThemeableStack, {
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
  },
  defaultVariants: {
    size: '$3',
  },
});
const ButtonText = styled(SizableText, {
  color: '$color',
  userSelect: 'none',
  cursor: 'pointer',
  flexGrow: 0,
  flexShrink: 1,
  ellipse: true,
  size: '$b',
  fontFamily: '$body',
  fontWeight: '500',
});
function useButton(props, { Text = ButtonText } = { Text: ButtonText }) {
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
    color,
    fontWeight,
    letterSpacing,
    fontSize,
    fontFamily,
    textAlign,
    textProps,
    ...rest
  } = props;
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
        focusable: void 0,
        focusStyle: {
          borderColor: '$background',
        },
      }),
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
const ButtonComponent = forwardRef(function Button(props, ref) {
  const { props: buttonProps } = useButton(props);
  return <ButtonFrame {...buttonProps} ref={ref} />;
});
const buttonStaticConfig = {
  inlineProps: /* @__PURE__ */ new Set([
    'color',
    'fontWeight',
    'fontSize',
    'fontFamily',
    'letterSpacing',
    'textAlign',
  ]),
};
const Button2 = ButtonFrame.extractable(
  themeable(ButtonComponent, ButtonFrame.staticConfig),
  buttonStaticConfig,
);
export {
  Button2 as Button,
  ButtonFrame,
  ButtonText,
  buttonStaticConfig,
  useButton,
};
//# sourceMappingURL=Button.js.map
