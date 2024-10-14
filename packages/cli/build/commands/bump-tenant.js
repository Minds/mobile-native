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
  name: 'bump-tenant',
  alias: ['bump'],
  description: 'Bump the tenant to the next patch version',
  run: function (toolbox) {
    return __awaiter(void 0, void 0, void 0, function () {
      var parameters, tenantID, error_1
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            parameters = toolbox.parameters
            if (!toolbox.verifyMobileFolder()) {
              ;(0, pretty_1.warning)(
                'Run this command in the mobile app folder'
              )
              return [2 /*return*/]
            }
            tenantID = ''.concat(parameters.first)
            if (!tenantID) {
              ;(0, pretty_1.warning)('Please specify the ID of the network: ')
              ;(0, pretty_1.p)()
              ;(0, pretty_1.command)('mobile bump-tenant', '<network-id>', [
                'mobile bump-tenant 1',
              ])
              return [2 /*return*/]
            }
            ;(0, pretty_1.heading)('Setting bumping network ' + tenantID)
            _a.label = 1
          case 1:
            _a.trys.push([1, 3, , 4])
            return [4 /*yield*/, bumpTenant(tenantID, toolbox)]
          case 2:
            _a.sent()
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
function bumpTenant(tenantID, toolbox) {
  return __awaiter(this, void 0, void 0, function () {
    var constants,
      tenantConfig,
      currentVersion,
      _a,
      major,
      minor,
      patch,
      newVersion_1,
      error_2
    var _this = this
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          constants = require('../../../../app.constants')
          _b.label = 1
        case 1:
          _b.trys.push([1, 5, , 6])
          return [
            4 /*yield*/,
            (0, spinner_1.spinnerAction)('Getting tenant config', function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  return [
                    2 /*return*/,
                    (0, tenant_config_1.getTenantConfig)(tenantID),
                  ]
                })
              })
            }),
          ]
        case 2:
          tenantConfig = _b.sent()
          currentVersion =
            tenantConfig.PRODUCTION_APP_VERSION || constants.APP_VERSION
          ;(0, pretty_1.p)('   Current app version: ' + constants.APP_VERSION)
          ;(0,
          pretty_1.p)('   Current TENANT version: ' + tenantConfig.PRODUCTION_APP_VERSION)
          ;(_a = currentVersion.split('.').map(Number)),
            (major = _a[0]),
            (minor = _a[1]),
            (patch = _a[2])
          newVersion_1 = ''
            .concat(major, '.')
            .concat(minor, '.')
            .concat(patch + 1)
          ;(0, pretty_1.p)('   New version: ' + (0, pretty_1.em)(newVersion_1))
          return [
            4 /*yield*/,
            (0, spinner_1.spinnerAction)(
              'Setting new tenant version',
              function () {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    return [
                      2 /*return*/,
                      toolbox.patching.replace(
                        'app.constants.js',
                        "APP_VERSION: '".concat(constants.APP_VERSION, "'"),
                        "APP_VERSION: '".concat(newVersion_1, "'")
                      ),
                    ]
                  })
                })
              }
            ),
          ]
        case 3:
          _b.sent()
          return [
            4 /*yield*/,
            (0, spinner_1.spinnerAction)('Saving tenant version', function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  return [
                    2 /*return*/,
                    (0, tenant_config_1.setMobileProductionAppVersion)(
                      tenantID,
                      newVersion_1
                    ),
                  ]
                })
              })
            }),
          ]
        case 4:
          _b.sent()
          ;(0, pretty_1.p)()
          ;(0, pretty_1.p)('Tenant version bumped to ' + newVersion_1)
          return [3 /*break*/, 6]
        case 5:
          error_2 = _b.sent()
          console.log(error_2)
          return [3 /*break*/, 6]
        case 6:
          return [2 /*return*/]
      }
    })
  })
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVtcC10ZW5hbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvYnVtcC10ZW5hbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSwwQ0FBa0U7QUFDbEUsNENBQWdEO0FBQ2hELHdEQUcrQjtBQUUvQixNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsSUFBSSxFQUFFLGFBQWE7SUFDbkIsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDO0lBQ2YsV0FBVyxFQUFFLDJDQUEyQztJQUN4RCxHQUFHLEVBQUUsVUFBTyxPQUF1Qjs7Ozs7b0JBQ3pCLFVBQVUsR0FBSyxPQUFPLFdBQVosQ0FBWTtvQkFFOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO3dCQUNqQyxJQUFBLGdCQUFPLEVBQUMsMkNBQTJDLENBQUMsQ0FBQTt3QkFDcEQsc0JBQU07cUJBQ1A7b0JBR0ssUUFBUSxHQUFHLFVBQUcsVUFBVSxDQUFDLEtBQUssQ0FBRSxDQUFBO29CQUV0QyxJQUFJLENBQUMsUUFBUSxFQUFFO3dCQUNiLElBQUEsZ0JBQU8sRUFBQyx3Q0FBd0MsQ0FBQyxDQUFBO3dCQUNqRCxJQUFBLFVBQUMsR0FBRSxDQUFBO3dCQUNILElBQUEsZ0JBQU8sRUFBQyxvQkFBb0IsRUFBRSxjQUFjLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUE7d0JBQ3ZFLHNCQUFNO3FCQUNQO29CQUVELElBQUEsZ0JBQU8sRUFBQywwQkFBMEIsR0FBRyxRQUFRLENBQUMsQ0FBQTs7OztvQkFHNUMscUJBQU0sVUFBVSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBQTs7b0JBQW5DLFNBQW1DLENBQUE7Ozs7b0JBRW5DLElBQUEsZ0JBQU8sRUFBQyxPQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7b0JBQ3RCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7OztvQkFFakIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTs7OztTQUNoQjtDQUNGLENBQUE7QUFFRCxTQUFlLFVBQVUsQ0FBQyxRQUFnQixFQUFFLE9BQXVCOzs7Ozs7O29CQUMzRCxTQUFTLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUE7Ozs7b0JBRS9CLHFCQUFNLElBQUEsdUJBQWEsRUFDdEMsdUJBQXVCLEVBQ3ZCOzRCQUFZLHNCQUFBLElBQUEsK0JBQWUsRUFBQyxRQUFRLENBQUMsRUFBQTtpQ0FBQSxDQUN0QyxFQUFBOztvQkFISyxZQUFZLEdBQUcsU0FHcEI7b0JBRUssY0FBYyxHQUNsQixZQUFZLENBQUMsc0JBQXNCLElBQUksU0FBUyxDQUFDLFdBQVcsQ0FBQTtvQkFFOUQsSUFBQSxVQUFDLEVBQUMsMEJBQTBCLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFBO29CQUNyRCxJQUFBLFVBQUMsRUFBQyw2QkFBNkIsR0FBRyxZQUFZLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtvQkFFaEUsS0FBd0IsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQTVELEtBQUssUUFBQSxFQUFFLEtBQUssUUFBQSxFQUFFLEtBQUssUUFBQSxDQUF5QztvQkFDN0QsZUFBYSxVQUFHLEtBQUssY0FBSSxLQUFLLGNBQUksS0FBSyxHQUFHLENBQUMsQ0FBRSxDQUFBO29CQUVuRCxJQUFBLFVBQUMsRUFBQyxrQkFBa0IsR0FBRyxJQUFBLFdBQUUsRUFBQyxZQUFVLENBQUMsQ0FBQyxDQUFBO29CQUV0QyxxQkFBTSxJQUFBLHVCQUFhLEVBQUMsNEJBQTRCLEVBQUU7O2dDQUNoRCxzQkFBQSxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FDdEIsa0JBQWtCLEVBQ2xCLHdCQUFpQixTQUFTLENBQUMsV0FBVyxNQUFHLEVBQ3pDLHdCQUFpQixZQUFVLE1BQUcsQ0FDL0IsRUFBQTs7NkJBQUEsQ0FDRixFQUFBOztvQkFORCxTQU1DLENBQUE7b0JBRUQscUJBQU0sSUFBQSx1QkFBYSxFQUFDLHVCQUF1QixFQUFFOzRCQUMzQyxzQkFBQSxJQUFBLDZDQUE2QixFQUFDLFFBQVEsRUFBRSxZQUFVLENBQUMsRUFBQTtpQ0FBQSxDQUNwRCxFQUFBOztvQkFGRCxTQUVDLENBQUE7b0JBRUQsSUFBQSxVQUFDLEdBQUUsQ0FBQTtvQkFDSCxJQUFBLFVBQUMsRUFBQywyQkFBMkIsR0FBRyxZQUFVLENBQUMsQ0FBQTs7OztvQkFFM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFLLENBQUMsQ0FBQTs7Ozs7O0NBRXJCIn0=
