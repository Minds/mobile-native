'use strict';
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, 'default', { value: mod, enumerable: true })
      : target,
    mod,
  )
);
var __toCommonJS = mod =>
  __copyProps(__defProp({}, '__esModule', { value: true }), mod);
var Provider_exports = {};
__export(Provider_exports, {
  UIProvider: () => UIProvider,
});
module.exports = __toCommonJS(Provider_exports);
var import_jsx_runtime = require('react/jsx-runtime');
var import_react = require('react');
var import_core = require('@tamagui/core');
var import_tamagui = __toESM(require('./tamagui.config'));
var import_fonts = require('./config/fonts');
var import_View = require('./View');
var import_Button = require('./Button');
function UIProvider({ children, ...rest }) {
  const [fontsLoaded] = (0, import_fonts.useFontsLoaded)();
  const [theme, setTheme] = (0, import_react.useState)('light');
  if (!fontsLoaded) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_core.TamaguiProvider,
    {
      config: import_tamagui.default,
      disableInjectCSS: true,
      defaultTheme: theme,
      ...rest,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_core.Theme, {
        name: theme,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_View.Layout,
          {
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_Button.Button,
                {
                  circular: true,
                  mt: '$6',
                  mb: '$2',
                  mx: '$3',
                  onPress: () =>
                    setTheme(oldTheme =>
                      oldTheme === 'dark' ? 'light' : 'dark',
                    ),
                  children: theme === 'dark' ? 'L' : 'D',
                },
              ),
              children,
            ],
          },
        ),
      }),
    },
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    UIProvider,
  });
//# sourceMappingURL=Provider.js.map
