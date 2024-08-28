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
  dashed: true,
  alias: ['see'],
  description: 'Shows the configuration of the tenant',
  run: function (toolbox) {
    return __awaiter(void 0, void 0, void 0, function () {
      var parameters, tenantID, isURL, result_1, result, error_1
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            parameters = toolbox.parameters
            tenantID = ''.concat(parameters.first)
            if (!tenantID) {
              ;(0, pretty_1.warning)(
                'Please specify the ID of the network or the URL of the site: '
              )
              ;(0, pretty_1.p)()
              ;(0, pretty_1.command)('mobile setup-tenant', '<network-id>', [
                'mobile setup-tenant 1',
                'mobile setup-tenant 1 --preview',
              ])
              return [2 /*return*/]
            }
            isURL = toolbox.validUrl(tenantID)
            _a.label = 1
          case 1:
            _a.trys.push([1, 5, , 6])
            if (!isURL) return [3 /*break*/, 3]
            return [
              4 /*yield*/,
              (0, spinner_1.spinnerAction)(
                'Getting tenant ID from the site',
                function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    var config
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          return [
                            4 /*yield*/,
                            toolbox.http
                              .create({ baseURL: tenantID })
                              .get('api/v1/minds/config'),
                          ]
                        case 1:
                          config = _a.sent()
                          return [2 /*return*/, config.data.tenant_id]
                      }
                    })
                  })
                }
              ),
            ]
          case 2:
            result_1 = _a.sent()
            if (typeof result_1 === 'number' && isFinite(result_1)) {
              tenantID = ''.concat(result_1)
            } else {
              ;(0, pretty_1.warning)(
                'Unable to get the tenant ID from the site'
              )
            }
            _a.label = 3
          case 3:
            return [
              4 /*yield*/,
              (0, spinner_1.spinnerAction)(
                'Getting tenant config',
                function () {
                  return (0, tenant_config_1.getTenantConfig)(tenantID)
                }
              ),
            ]
          case 4:
            result = _a.sent()
            ;(0,
            pretty_1.heading)('Tenant '.concat(tenantID, ' configuration:'))
            toolbox.print.info((0, pretty_1.prettyJson)(result))
            ;(0, pretty_1.p)()
            ;(0,
            pretty_1.p)('Network link:' + (0, pretty_1.link)(result.API_URL))
            ;(0, pretty_1.p)()
            return [3 /*break*/, 6]
          case 5:
            error_1 = _a.sent()
            ;(0, pretty_1.warning)(error_1.message)
            return [2 /*return*/]
          case 6:
            return [2 /*return*/]
        }
      })
    })
  },
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VlLXRlbmFudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9zZWUtdGVuYW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsMENBQWdGO0FBQ2hGLDRDQUFnRDtBQUNoRCx3REFBd0Q7QUFFeEQsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNmLE1BQU0sRUFBRSxJQUFJO0lBQ1osS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQ2QsV0FBVyxFQUFFLHVDQUF1QztJQUNwRCxHQUFHLEVBQUUsVUFBTyxPQUF1Qjs7Ozs7b0JBQ3pCLFVBQVUsR0FBSyxPQUFPLFdBQVosQ0FBWTtvQkFHMUIsUUFBUSxHQUFHLFVBQUcsVUFBVSxDQUFDLEtBQUssQ0FBRSxDQUFBO29CQUVwQyxJQUFJLENBQUMsUUFBUSxFQUFFO3dCQUNiLElBQUEsZ0JBQU8sRUFBQywrREFBK0QsQ0FBQyxDQUFBO3dCQUN4RSxJQUFBLFVBQUMsR0FBRSxDQUFBO3dCQUNILElBQUEsZ0JBQU8sRUFBQyxxQkFBcUIsRUFBRSxjQUFjLEVBQUU7NEJBQzdDLHVCQUF1Qjs0QkFDdkIsaUNBQWlDO3lCQUNsQyxDQUFDLENBQUE7d0JBQ0Ysc0JBQU07cUJBQ1A7b0JBRUssS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUE7Ozs7eUJBR2xDLEtBQUssRUFBTCx3QkFBSztvQkFDUSxxQkFBTSxJQUFBLHVCQUFhLEVBQ2hDLGlDQUFpQyxFQUNqQzs7Ozs0Q0FDaUIscUJBQU0sT0FBTyxDQUFDLElBQUk7NkNBQzlCLE1BQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsQ0FBQzs2Q0FDN0IsR0FBRyxDQUF3QixxQkFBcUIsQ0FBQyxFQUFBOzt3Q0FGOUMsTUFBTSxHQUFHLFNBRXFDO3dDQUNwRCxzQkFBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBQTs7OzZCQUM3QixDQUNGLEVBQUE7O29CQVJLLFdBQVMsU0FRZDtvQkFDRCxJQUFJLE9BQU8sUUFBTSxLQUFLLFFBQVEsSUFBSSxRQUFRLENBQUMsUUFBTSxDQUFDLEVBQUU7d0JBQ2xELFFBQVEsR0FBRyxVQUFHLFFBQU0sQ0FBRSxDQUFBO3FCQUN2Qjt5QkFBTTt3QkFDTCxJQUFBLGdCQUFPLEVBQUMsMkNBQTJDLENBQUMsQ0FBQTtxQkFDckQ7O3dCQUdZLHFCQUFNLElBQUEsdUJBQWEsRUFBQyx1QkFBdUIsRUFBRTt3QkFDMUQsT0FBTyxJQUFBLCtCQUFlLEVBQUMsUUFBUSxDQUFDLENBQUE7b0JBQ2xDLENBQUMsQ0FBQyxFQUFBOztvQkFGSSxNQUFNLEdBQUcsU0FFYjtvQkFFRixJQUFBLGdCQUFPLEVBQUMsaUJBQVUsUUFBUSxvQkFBaUIsQ0FBQyxDQUFBO29CQUU1QyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFBLG1CQUFVLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtvQkFDdEMsSUFBQSxVQUFDLEdBQUUsQ0FBQTtvQkFDSCxJQUFBLFVBQUMsRUFBQyxlQUFlLEdBQUcsSUFBQSxhQUFJLEVBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7b0JBQ3pDLElBQUEsVUFBQyxHQUFFLENBQUE7Ozs7b0JBRUgsSUFBQSxnQkFBTyxFQUFDLE9BQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtvQkFDdEIsc0JBQU07Ozs7U0FFVDtDQUNGLENBQUEifQ==
