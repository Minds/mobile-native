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
var media_exports = {};
__export(media_exports, {
  media: () => media,
});
module.exports = __toCommonJS(media_exports);
var import_react_native_media_driver = require('@tamagui/react-native-media-driver');
const media = (0, import_react_native_media_driver.createMedia)({
  xs: { maxWidth: 320 },
  sm: { maxWidth: 480 },
  md: { maxWidth: 640 },
  lg: { maxWidth: 960 },
  xl: { maxWidth: 1024 },
  gtXs: { minWidth: 320 + 1 },
  gtSm: { minWidth: 480 + 1 },
  gtMd: { minWidth: 640 + 1 },
  gtLg: { minWidth: 960 + 1 },
  gtXl: { minWidth: 1024 + 1 },
  short: { maxHeight: 480 },
  tall: { minHeight: 820 },
  hoverNone: { hover: 'none' },
  pointerCoarse: { pointer: 'coarse' },
});
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    media,
  });
//# sourceMappingURL=media.js.map
