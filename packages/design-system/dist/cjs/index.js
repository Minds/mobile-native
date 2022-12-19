'use strict';
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __reExport = (target, mod, secondTarget) => (
  __copyProps(target, mod, 'default'),
  secondTarget && __copyProps(secondTarget, mod, 'default')
);
var __toCommonJS = mod =>
  __copyProps(__defProp({}, '__esModule', { value: true }), mod);
var src_exports = {};
module.exports = __toCommonJS(src_exports);
__reExport(src_exports, require('./tamagui.config'), module.exports);
__reExport(src_exports, require('./Provider'), module.exports);
__reExport(src_exports, require('./Text'), module.exports);
__reExport(src_exports, require('./View'), module.exports);
__reExport(src_exports, require('./Button'), module.exports);
//# sourceMappingURL=index.js.map
