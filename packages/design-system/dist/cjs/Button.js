'use strict';
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toCommonJS = mod =>
  __copyProps(__defProp({}, '__esModule', { value: true }), mod);
var Button_exports = {};
__export(Button_exports, {
  Button: () => Button2,
  ButtonFrame: () => ButtonFrame,
  ButtonText: () => ButtonText,
  buttonStaticConfig: () => buttonStaticConfig,
  useButton: () => useButton,
});
module.exports = __toCommonJS(Button_exports);
var import_jsx_runtime = require('react/jsx-runtime');
var import_core = require('@tamagui/core');
var import_font_size = require('@tamagui/font-size');
var import_get_button_sized = require('@tamagui/get-button-sized');
var import_helpers_tamagui = require('@tamagui/helpers-tamagui');
var import_stacks = require('@tamagui/stacks');
var import_text = require('@tamagui/text');
var import_react2 = require('react');
const NAME = 'Button';
const ButtonFrame = (0, import_core.styled)(import_stacks.ThemeableStack, {
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
      '...size': import_get_button_sized.getButtonSized,
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
const ButtonText = (0, import_core.styled)(import_text.SizableText, {
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
  const isNested = import_core.isRSC
    ? false
    : (0, import_react2.useContext)(import_core.ButtonNestingContext);
  const mediaActiveProps = (0, import_core.useMediaPropsActive)(props);
  const size = mediaActiveProps.size || '$b';
  const iconSize =
    (typeof size === 'number'
      ? size * 0.5
      : (0, import_font_size.getFontSize)('$b')) * scaleIcon;
  const getThemedIcon = (0, import_helpers_tamagui.useGetThemedIcon)({
    size: iconSize,
    color,
  });
  const [themedIcon, themedIconAfter] = [icon, iconAfter].map(getThemedIcon);
  const spaceSize = (0, import_core.getVariableValue)(iconSize) * scaleSpace;
  const contents = (0, import_text.wrapChildrenInText)(Text, mediaActiveProps);
  const inner =
    themedIcon || themedIconAfter
      ? (0, import_core.spacedChildren)({
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
      children: import_core.isRSC
        ? inner
        : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_core.ButtonNestingContext.Provider,
            { value: true, children: inner },
          ),
    },
  };
}
const ButtonComponent = (0, import_react2.forwardRef)(function Button(
  props,
  ref,
) {
  const { props: buttonProps } = useButton(props);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ButtonFrame, {
    ...buttonProps,
    ref,
  });
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
  (0, import_core.themeable)(ButtonComponent, ButtonFrame.staticConfig),
  buttonStaticConfig,
);
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    Button,
    ButtonFrame,
    ButtonText,
    buttonStaticConfig,
    useButton,
  });
//# sourceMappingURL=Button.js.map
