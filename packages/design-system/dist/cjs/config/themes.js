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
var themes_exports = {};
__export(themes_exports, {
  themes: () => themes,
});
module.exports = __toCommonJS(themes_exports);
var import_core = require('@tamagui/core');
var import_tokens = require('./tokens');
var import_semanticTheme = require('./semanticTheme');
var import_buttonThemes = require('./buttonThemes');
const { color } = import_tokens.tokens;
const dark = (0, import_core.createTheme)({
  ...color,
  background: color['color-basic-800'],
  backgroundFocus: color['color-basic-900'],
  backgroundPress: color['color-basic-1000'],
  backgroundHover: color['color-basic-1100'],
  borderColor: color['color-basic-800'],
  borderColorFocus: color['color-basic-900'],
  borderColorPress: color['color-basic-1000'],
  borderColorHover: color['color-basic-1100'],
  color: color['color-basic-100'],
  colorFocus: color['color-basic-200'],
  colorPress: color['color-basic-300'],
  colorHover: color['color-basic-400'],
  colorDisabled: color['color-basic-transparent-600'],
});
const light = (0, import_core.createTheme)({
  ...color,
  background: color['color-basic-100'],
  backgroundFocus: color['color-basic-200'],
  backgroundPress: color['color-basic-300'],
  backgroundHover: color['color-basic-400'],
  borderColor: color['color-basic-100'],
  borderColorFocus: color['color-basic-200'],
  borderColorPress: color['color-basic-300'],
  borderColorHover: color['color-basic-400'],
  color: color['color-basic-800'],
  colorFocus: color['color-basic-900'],
  colorPress: color['color-basic-1000'],
  colorHover: color['color-basic-1100'],
  colorDisabled: color['color-basic-transparent-600'],
});
const allThemes = {
  dark,
  light,
  ...import_buttonThemes.buttonThemes,
  ...import_semanticTheme.sematicThemes,
};
const themes = allThemes;
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    themes,
  });
//# sourceMappingURL=themes.js.map
