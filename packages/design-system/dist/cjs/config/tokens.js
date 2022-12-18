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
var tokens_exports = {};
__export(tokens_exports, {
  radius: () => radius,
  size: () => size,
  space: () => space,
  tokens: () => tokens,
  zIndex: () => zIndex,
});
module.exports = __toCommonJS(tokens_exports);
var import_core = require('@tamagui/core');
var import_colors = require('./colors');
const size = {
  0: 0,
  0.25: 2,
  0.5: 4,
  0.75: 8,
  1: 20,
  1.5: 24,
  2: 28,
  2.5: 32,
  3: 36,
  3.5: 40,
  4: 44,
  true: 44,
  4.5: 48,
  5: 52,
  6: 64,
  7: 74,
  8: 84,
  9: 94,
  10: 104,
  11: 124,
  12: 144,
  13: 164,
  14: 184,
  15: 204,
  16: 224,
  17: 224,
  18: 244,
  19: 264,
  20: 284,
};
const spaces = Object.entries(size).map(([k, v]) => [
  k,
  Math.max(0, v <= 16 ? Math.round(v * 0.333) : Math.floor(v * 0.7 - 12)),
]);
const spacesNegative = spaces.map(([k, v]) => [`-${k}`, -v]);
const space = {
  ...Object.fromEntries(spaces),
  ...Object.fromEntries(spacesNegative),
};
const zIndex = {
  0: 0,
  1: 100,
  2: 200,
  3: 300,
  4: 400,
  5: 500,
};
const radius = {
  0: 0,
  1: 3,
  2: 5,
  3: 1e5,
  4: 9,
  5: 10,
  6: 16,
  7: 19,
  8: 22,
  9: 26,
  10: 34,
  11: 42,
  12: 50,
};
const tokens = (0, import_core.createTokens)({
  color: import_colors.color,
  radius,
  zIndex,
  space,
  size,
});
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    radius,
    size,
    space,
    tokens,
    zIndex,
  });
//# sourceMappingURL=tokens.js.map
