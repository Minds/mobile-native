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
var Text_exports = {};
__export(Text_exports, {
  Text: () => Text,
});
module.exports = __toCommonJS(Text_exports);
var import_core = require('@tamagui/core');
var import_text = require('@tamagui/text');
const Text = (0, import_core.styled)(import_text.Paragraph, {
  tag: 'span',
  name: 'Text',
  fontFamily: '$body',
  size: '$b',
  variants: {
    type: {
      black: {
        fontWeight: '900',
      },
      bold: {
        fontWeight: '700',
      },
      medium: {
        fontWeight: '500',
      },
      regular: {
        fontWeight: '400',
      },
    },
  },
  defaultVariants: {
    fontWeight: '400',
  },
});
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    Text,
  });
//# sourceMappingURL=Text.js.map
