'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1]
          return t[1]
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this
        }),
      g
    )
    function verb(n) {
      return function (v) {
        return step([n, v])
      }
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.')
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t
          if (((y = 0), t)) op = [op[0] & 2, t.value]
          switch (op[0]) {
            case 0:
            case 1:
              t = op
              break
            case 4:
              _.label++
              return { value: op[1], done: false }
            case 5:
              _.label++
              y = op[1]
              op = [0]
              continue
            case 7:
              op = _.ops.pop()
              _.trys.pop()
              continue
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0
                continue
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1]
                break
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1]
                t = op
                break
              }
              if (t && _.label < t[2]) {
                _.label = t[2]
                _.ops.push(op)
                break
              }
              if (t[2]) _.ops.pop()
              _.trys.pop()
              continue
          }
          op = body.call(thisArg, _)
        } catch (e) {
          op = [6, e]
          y = 0
        } finally {
          f = t = 0
        }
      if (op[0] & 5) throw op[1]
      return { value: op[0] ? op[1] : void 0, done: true }
    }
  }
Object.defineProperty(exports, '__esModule', { value: true })
var pretty_1 = require('../tools/pretty')
var spinner_1 = require('../tools/spinner')
module.exports = {
  dashed: true,
  description: 'Setup the previewer app',
  run: function (toolbox) {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!toolbox.verifyMobileFolder()) {
              ;(0, pretty_1.warning)(
                'Run this command in the mobile app folder'
              )
              return [2 /*return*/]
            }
            ;(0, pretty_1.heading)('Preparing the previewer app')
            return [
              4 /*yield*/,
              (0, spinner_1.spinnerAction)(
                'Adding main to package.json',
                function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          return [
                            4 /*yield*/,
                            toolbox.patching.update(
                              'package.json',
                              function (config) {
                                config.main = 'preview/index.js'
                                return config
                              }
                            ),
                          ]
                        case 1:
                          _a.sent()
                          return [2 /*return*/]
                      }
                    })
                  })
                }
              ),
            ]
          case 1:
            _a.sent()
            return [
              4 /*yield*/,
              (0, spinner_1.spinnerAction)(
                'Moving previewer tenant files',
                function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          return [
                            4 /*yield*/,
                            toolbox.filesystem.copy('./preview/tenant', './', {
                              overwrite: true,
                            }),
                          ]
                        case 1:
                          _a.sent()
                          return [2 /*return*/]
                      }
                    })
                  })
                }
              ),
            ]
          case 2:
            _a.sent()
            ;(0, pretty_1.p)('Previewer app setup completed!')
            return [2 /*return*/]
        }
      })
    })
  },
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAtcHJldmlld2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL3NldHVwLXByZXZpZXdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDBDQUFxRDtBQUNyRCw0Q0FBZ0Q7QUFFaEQsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNmLE1BQU0sRUFBRSxJQUFJO0lBQ1osV0FBVyxFQUFFLHlCQUF5QjtJQUN0QyxHQUFHLEVBQUUsVUFBTyxPQUF1Qjs7OztvQkFDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO3dCQUNqQyxJQUFBLGdCQUFPLEVBQUMsMkNBQTJDLENBQUMsQ0FBQTt3QkFDcEQsc0JBQU07cUJBQ1A7b0JBRUQsSUFBQSxnQkFBTyxFQUFDLDZCQUE2QixDQUFDLENBQUE7b0JBQ3RDLHFCQUFNLElBQUEsdUJBQWEsRUFBQyw2QkFBNkIsRUFBRTs7OzRDQUNqRCxxQkFBTSxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsVUFBQyxNQUFNOzRDQUNuRCxNQUFNLENBQUMsSUFBSSxHQUFHLGtCQUFrQixDQUFBOzRDQUNoQyxPQUFPLE1BQU0sQ0FBQTt3Q0FDZixDQUFDLENBQUMsRUFBQTs7d0NBSEYsU0FHRSxDQUFBOzs7OzZCQUNILENBQUMsRUFBQTs7b0JBTEYsU0FLRSxDQUFBO29CQUVGLHFCQUFNLElBQUEsdUJBQWEsRUFBQywrQkFBK0IsRUFBRTs7OzRDQUNuRCxxQkFBTSxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLEVBQUU7NENBQ3RELFNBQVMsRUFBRSxJQUFJO3lDQUNoQixDQUFDLEVBQUE7O3dDQUZGLFNBRUUsQ0FBQTs7Ozs2QkFDSCxDQUFDLEVBQUE7O29CQUpGLFNBSUUsQ0FBQTtvQkFFRixJQUFBLFVBQUMsRUFBQyxnQ0FBZ0MsQ0FBQyxDQUFBOzs7O1NBQ3BDO0NBQ0YsQ0FBQSJ9
