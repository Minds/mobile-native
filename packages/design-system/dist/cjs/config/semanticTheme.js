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
var semanticTheme_exports = {};
__export(semanticTheme_exports, {
  createSemanticTheme: () => createSemanticTheme,
  sematicThemes: () => sematicThemes,
});
module.exports = __toCommonJS(semanticTheme_exports);
var import_core = require('@tamagui/core');
var import_tokens = require('./tokens');
const semanticNames = [
  'basic',
  'primary',
  'info',
  'success',
  'warning',
  'danger',
];
const createSemanticTheme = theme =>
  (0, import_core.createTheme)({
    background: import_tokens.tokens.color[`color-${theme}-500`],
    backgroundPress: import_tokens.tokens.color[`color-${theme}-600`],
    backgroundFocus: import_tokens.tokens.color[`color-${theme}-700`],
    backgroundHover: import_tokens.tokens.color[`color-${theme}-800`],
    backgroundDisabled:
      import_tokens.tokens.color[`color-${theme}-transparent-500`],
    borderColor: import_tokens.tokens.color[`color-${theme}-500`],
    borderColorPress: import_tokens.tokens.color[`color-${theme}-600`],
    borderColorFocus: import_tokens.tokens.color[`color-${theme}-700`],
    borderColorHover: import_tokens.tokens.color[`color-${theme}-800`],
    color:
      import_tokens.tokens.color[
        `color-basic-${theme === 'basic' ? '800' : '100'}`
      ],
    colorFocus:
      import_tokens.tokens.color[
        `color-basic-${theme === 'basic' ? '700' : '200'}`
      ],
    colorPress:
      import_tokens.tokens.color[
        `color-basic-${theme === 'basic' ? '800' : '300'}`
      ],
    colorHover:
      import_tokens.tokens.color[
        `color-basic-${theme === 'basic' ? '900' : '400'}`
      ],
  });
const sematicThemes = {
  dark_basic: createSemanticTheme('basic'),
  light_basic: createSemanticTheme('basic'),
  dark_primary: createSemanticTheme('primary'),
  light_primary: createSemanticTheme('primary'),
  dark_info: createSemanticTheme('info'),
  light_info: createSemanticTheme('info'),
  dark_success: createSemanticTheme('success'),
  light_success: createSemanticTheme('success'),
  dark_warning: createSemanticTheme('warning'),
  light_warning: createSemanticTheme('warning'),
  dark_danger: createSemanticTheme('danger'),
  light_danger: createSemanticTheme('danger'),
};
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    createSemanticTheme,
    sematicThemes,
  });
//# sourceMappingURL=semanticTheme.js.map
