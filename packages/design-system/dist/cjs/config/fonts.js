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
var fonts_exports = {};
__export(fonts_exports, {
  fonts: () => fonts,
  useFontsLoaded: () => useFontsLoaded,
});
module.exports = __toCommonJS(fonts_exports);
var import_core = require('@tamagui/core');
var import_expo_font = require('expo-font');
const regularFont = 'Roboto-Regular';
const mediumFont = 'Roboto-Medium';
const boldFont = 'Roboto-Bold';
const blackFont = 'Roboto-Black';
const italicFont = 'Roboto-italic';
const body = (0, import_core.createFont)({
  family: regularFont,
  size: {
    b3: 13,
    b2: 14,
    b1: 16,
    b: 16,
    h4: 18,
    h3: 20,
    h2: 24,
    h1: 30,
  },
  lineHeight: {
    b3: 16,
    b2: 20,
    b1: 24,
    b: 24,
    h4: 28,
    h3: 28,
    h2: 32,
    h1: 36,
  },
  letterSpacing: {
    b: 0,
  },
  weight: {
    b: '400',
  },
  face: {
    400: { normal: regularFont, italic: italicFont },
    500: { normal: mediumFont, italic: italicFont },
    700: { normal: boldFont, italic: italicFont },
    900: { normal: blackFont, italic: italicFont },
  },
});
const fonts = {
  body,
};
const useFontsLoaded = () =>
  (0, import_expo_font.useFonts)({
    'Roboto-Regular': require('../assets/Roboto/Roboto-Regular.ttf'),
    'Roboto-Medium': require('../assets/Roboto/Roboto-Medium.ttf'),
    'Roboto-Bold': require('../assets/Roboto/Roboto-Bold.ttf'),
    'Roboto-Black': require('../assets/Roboto/Roboto-Black.ttf'),
    'Roboto-Italic': require('../assets/Roboto/Roboto-Italic.ttf'),
  });
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    fonts,
    useFontsLoaded,
  });
//# sourceMappingURL=fonts.js.map
