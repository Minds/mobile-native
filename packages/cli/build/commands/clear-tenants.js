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
var tenant_config_1 = require('../tools/tenant-config')
module.exports = {
  name: 'clear-tenants',
  alias: ['clear'],
  description: 'Clear custom versions for all tenant',
  run: function (toolbox) {
    return __awaiter(void 0, void 0, void 0, function () {
      var error_1
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            ;(0, pretty_1.heading)('Custom version reset')
            _a.label = 1
          case 1:
            _a.trys.push([1, 3, , 4])
            return [
              4 /*yield*/,
              (0, spinner_1.spinnerAction)(
                'Clearing custom versions',
                function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      return [
                        2 /*return*/,
                        (0, tenant_config_1.clearAllMobileAppVersions)(),
                      ]
                    })
                  })
                }
              ),
            ]
          case 2:
            _a.sent()
            ;(0, pretty_1.p)()
            ;(0, pretty_1.p)('Custom versions cleared for all tenants')
            return [3 /*break*/, 4]
          case 3:
            error_1 = _a.sent()
            ;(0, pretty_1.warning)(error_1.message)
            process.exit(1)
            return [3 /*break*/, 4]
          case 4:
            process.exit(0)
            return [2 /*return*/]
        }
      })
    })
  },
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xlYXItdGVuYW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9jbGVhci10ZW5hbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsMENBQXFEO0FBQ3JELDRDQUFnRDtBQUNoRCx3REFBa0U7QUFFbEUsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNmLElBQUksRUFBRSxlQUFlO0lBQ3JCLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQztJQUNoQixXQUFXLEVBQUUsc0NBQXNDO0lBQ25ELEdBQUcsRUFBRSxVQUFPLE9BQXVCOzs7OztvQkFDakMsSUFBQSxnQkFBTyxFQUFDLHNCQUFzQixDQUFDLENBQUE7Ozs7b0JBRzdCLHFCQUFNLElBQUEsdUJBQWEsRUFBQywwQkFBMEIsRUFBRTs0QkFDOUMsc0JBQUEsSUFBQSx5Q0FBeUIsR0FBRSxFQUFBO2lDQUFBLENBQzVCLEVBQUE7O29CQUZELFNBRUMsQ0FBQTtvQkFFRCxJQUFBLFVBQUMsR0FBRSxDQUFBO29CQUNILElBQUEsVUFBQyxFQUFDLHlDQUF5QyxDQUFDLENBQUE7Ozs7b0JBRTVDLElBQUEsZ0JBQU8sRUFBQyxPQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7b0JBQ3RCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7OztvQkFFakIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTs7OztTQUNoQjtDQUNGLENBQUEifQ==
