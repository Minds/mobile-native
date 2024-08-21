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
var graphql_request_1 = require('graphql-request')
var node_fetch_1 = require('node-fetch')
var spinner_1 = require('../tools/spinner')
var tenant_config_1 = require('../tools/tenant-config')
module.exports = {
  name: 'setup-tenant',
  alias: ['s'],
  description:
    'Fetch the tenant configuration and assets for production or a preview',
  run: function (toolbox) {
    return __awaiter(void 0, void 0, void 0, function () {
      var parameters, tenantID, preview, error_1
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            parameters = toolbox.parameters
            tenantID = ''.concat(parameters.first)
            if (!tenantID) {
              ;(0, pretty_1.warning)('Please specify the ID of the network: ')
              ;(0, pretty_1.p)()
              ;(0, pretty_1.command)('mobile setup-tenant', '<network-id>', [
                'mobile setup-tenant 1',
                'mobile setup-tenant 1 --preview',
              ])
              return [2 /*return*/]
            }
            if (!toolbox.verifyMobileFolder()) {
              ;(0, pretty_1.warning)(
                'Run this command in the mobile app folder'
              )
              return [2 /*return*/]
            }
            preview = parameters.options.preview || false
            _a.label = 1
          case 1:
            _a.trys.push([1, 3, , 4])
            return [4 /*yield*/, setupTenant(tenantID, preview, toolbox)]
          case 2:
            _a.sent()
            return [3 /*break*/, 4]
          case 3:
            error_1 = _a.sent()
            ;(0, pretty_1.warning)(error_1.message)
            process.exit(1)
            return [3 /*break*/, 4]
          case 4:
            ;(0, pretty_1.p)()
            ;(0,
            pretty_1.p)('Network'.concat(parameters.options.preview ? ' preview ' : ' ', 'set up completed!'))
            process.exit(0)
            return [2 /*return*/]
        }
      })
    })
  },
}
/**
 * Generate tenant config
 *
 * 0 for minds preview
 * > 0 for tenant id
 */
function setupTenant(id, preview, toolbox) {
  return __awaiter(this, void 0, void 0, function () {
    var isMinds, config, GetNavigationItemsDocument_1, addAdaptiveIcon_1
    var _this = this
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          ;(0, pretty_1.heading)('Setting up network ' + typeof id)
          isMinds = id.trim() === '0'
          return [
            4 /*yield*/,
            (0, spinner_1.spinnerAction)(
              'Fetching tenant configuration',
              function () {
                return __awaiter(_this, void 0, void 0, function () {
                  var data, _a
                  return __generator(this, function (_b) {
                    switch (_b.label) {
                      case 0:
                        if (!isMinds) return [3 /*break*/, 1]
                        _a = require('../../../../tenant.json')
                        return [3 /*break*/, 3]
                      case 1:
                        return [
                          4 /*yield*/,
                          (0, tenant_config_1.getTenantConfig)(id),
                        ]
                      case 2:
                        _a = _b.sent()
                        _b.label = 3
                      case 3:
                        data = _a
                        if (!isMinds) {
                          data.POSTHOG_API_KEY =
                            'phc_Vm1E7gX6he2WNulsVc4G6sh5IAiYSLku1McMKM0oADP'
                        }
                        return [2 /*return*/, data]
                    }
                  })
                })
              }
            ),
          ]
        case 1:
          config = _a.sent()
          return [
            4 /*yield*/,
            (0, spinner_1.spinnerAction)('Generating tenant.json', function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  generateTenantJSON(config, preview, toolbox)
                  return [2 /*return*/]
                })
              })
            }),
          ]
        case 2:
          _a.sent()
          if (!!isMinds) return [3 /*break*/, 10]
          // download the assets
          return [
            4 /*yield*/,
            (0, spinner_1.spinnerAction)('Downloading assets', function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [
                        4 /*yield*/,
                        downloadAssets(config.assets, toolbox),
                      ]
                    case 1:
                      _a.sent()
                      return [2 /*return*/]
                  }
                })
              })
            }),
          ]
        case 3:
          // download the assets
          _a.sent()
          GetNavigationItemsDocument_1 = toolbox.filesystem.read(
            './src/modules/navigation/gql/get-custom-navigation.api.graphql',
            'utf8'
          )
          return [
            4 /*yield*/,
            (0, spinner_1.spinnerAction)(
              'Fetching custom navigation',
              function () {
                return __awaiter(_this, void 0, void 0, function () {
                  var md5, customNav
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        md5 = require('md5')
                        return [
                          4 /*yield*/,
                          (0, graphql_request_1.request)(
                            'https://'.concat(
                              md5(id),
                              '.networks.minds.com/api/graphql'
                            ),
                            GetNavigationItemsDocument_1,
                            {}
                          ),
                        ]
                      case 1:
                        customNav = _a.sent()
                        toolbox.filesystem.write(
                          './src/modules/navigation/service/custom-navigation.json',
                          customNav.customNavigationItems
                        )
                        return [2 /*return*/]
                    }
                  })
                })
              }
            ),
          ]
        case 4:
          _a.sent()
          if (!preview) return [3 /*break*/, 6]
          return [
            4 /*yield*/,
            (0, spinner_1.spinnerAction)(
              'Copy expo-update override',
              function () {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    toolbox.filesystem.copy(
                      './preview/tenant/patches',
                      './patches',
                      {
                        overwrite: true,
                      }
                    )
                    return [2 /*return*/]
                  })
                })
              }
            ),
          ]
        case 5:
          _a.sent()
          return [3 /*break*/, 8]
        case 6:
          addAdaptiveIcon_1 = require('../tools/generate-icons').addAdaptiveIcon
          return [
            4 /*yield*/,
            (0, spinner_1.spinnerAction)(
              'Generating adaptive icon',
              function () {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        // generate the adaptive icon using the provided icon
                        return [4 /*yield*/, addAdaptiveIcon_1()]
                      case 1:
                        // generate the adaptive icon using the provided icon
                        _a.sent()
                        return [2 /*return*/]
                    }
                  })
                })
              }
            ),
          ]
        case 7:
          _a.sent()
          _a.label = 8
        case 8:
          if (!config.APP_TRACKING_MESSAGE_ENABLED) return [3 /*break*/, 10]
          return [
            4 /*yield*/,
            (0, spinner_1.spinnerAction)(
              'Adding tracking-transparency package',
              function () {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [
                          4 /*yield*/,
                          toolbox.packageManager.add(
                            'expo-tracking-transparency',
                            {
                              force: 'yarn',
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
        case 9:
          _a.sent()
          _a.label = 10
        case 10:
          return [2 /*return*/]
      }
    })
  })
}
function generateTenantJSON(data, preview, toolbox) {
  if (preview) {
    var previewerTenant = toolbox.filesystem.read(
      './preview/tenant/tenant.json',
      'json'
    )
    data.APP_SLUG = previewerTenant.APP_SLUG
    data.APP_SCHEME = previewerTenant.APP_SCHEME
    data.EAS_PROJECT_ID = previewerTenant.EAS_PROJECT_ID
    data.APP_IOS_BUNDLE = previewerTenant.APP_IOS_BUNDLE
    data.APP_ANDROID_PACKAGE = previewerTenant.APP_ANDROID_PACKAGE
    data.APP_IOS_BUNDLE = previewerTenant.APP_IOS_BUNDLE
    // disable app tracking for previews
    data.APP_TRACKING_MESSAGE_ENABLED = false
  }
  var light_background = data.BACKGROUND_COLOR_LIGHT || '#FFFFFF'
  var dark_background = data.BACKGROUND_COLOR_DARK || '#010101'
  var tenant = {
    APP_NAME: data.APP_NAME || 'Minds Network',
    APP_SCHEME: data.APP_SCHEME,
    APP_SLUG: data.APP_SLUG,
    APP_HOST: data.APP_HOST,
    APP_IOS_BUNDLE: data.APP_IOS_BUNDLE,
    APP_SPLASH_RESIZE: data.APP_SPLASH_RESIZE,
    APP_ANDROID_PACKAGE: data.APP_ANDROID_PACKAGE,
    IS_PREVIEW: preview,
    ACCENT_COLOR_LIGHT: data.ACCENT_COLOR_LIGHT || '#1b85d6',
    ACCENT_COLOR_DARK: data.ACCENT_COLOR_DARK || '#1b85d6',
    BACKGROUND_COLOR_LIGHT: light_background,
    BACKGROUND_COLOR_DARK: dark_background,
    WELCOME_LOGO: data.WELCOME_LOGO,
    ADAPTIVE_ICON: './assets/images/icon_adaptive.png',
    ADAPTIVE_COLOR: data.THEME === 'light' ? light_background : dark_background,
    THEME: data.THEME || 'light',
    TENANT_ID: data.TENANT_ID,
    API_URL: data.API_URL,
    APP_TRACKING_MESSAGE_ENABLED: data.APP_TRACKING_MESSAGE_ENABLED,
    APP_TRACKING_MESSAGE: data.APP_TRACKING_MESSAGE,
    APP_LANDING_PAGE_LOGGED_IN: data.APP_LANDING_PAGE_LOGGED_IN || 'newsfeed',
    EAS_PROJECT_ID: data.EAS_PROJECT_ID,
    POSTHOG_API_KEY: data.POSTHOG_API_KEY,
  }
  toolbox.filesystem.write('tenant.json', JSON.stringify(tenant, null, 2))
}
function downloadAssets(assets, toolbox) {
  return __awaiter(this, void 0, void 0, function () {
    var _i, assets_1, asset, response, filename, buffer
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          ;(_i = 0), (assets_1 = assets)
          _a.label = 1
        case 1:
          if (!(_i < assets_1.length)) return [3 /*break*/, 5]
          asset = assets_1[_i]
          return [4 /*yield*/, (0, node_fetch_1.default)(asset.value)]
        case 2:
          response = _a.sent()
          filename = assetsMap[asset.key]
          return [4 /*yield*/, response.buffer()]
        case 3:
          buffer = _a.sent()
          toolbox.filesystem.write('./assets/images/'.concat(filename), buffer)
          _a.label = 4
        case 4:
          _i++
          return [3 /*break*/, 1]
        case 5:
          toolbox.filesystem.copy(
            './assets/images/logo_horizontal.png',
            './assets/images/logo_horizontal_dark.png',
            { overwrite: true }
          )
          return [2 /*return*/]
      }
    })
  })
}
var assetsMap = {
  square_logo: 'logo_square.png',
  splash: 'splash.png',
  horizontal_logo: 'logo_horizontal.png',
  icon: 'icon.png',
  icon_mono: 'icon_mono.png',
  monographic_icon: 'icon_mono.png',
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAtdGVuYW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL3NldHVwLXRlbmFudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDBDQUE4RDtBQUM5RCxtREFBeUM7QUFDekMseUNBQWtDO0FBQ2xDLDRDQUFnRDtBQUNoRCx3REFBd0Q7QUFFeEQsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNmLElBQUksRUFBRSxjQUFjO0lBQ3BCLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQztJQUNaLFdBQVcsRUFDVCx1RUFBdUU7SUFDekUsR0FBRyxFQUFFLFVBQU8sT0FBdUI7Ozs7O29CQUN6QixVQUFVLEdBQUssT0FBTyxXQUFaLENBQVk7b0JBR3hCLFFBQVEsR0FBRyxVQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUUsQ0FBQTtvQkFFdEMsSUFBSSxDQUFDLFFBQVEsRUFBRTt3QkFDYixJQUFBLGdCQUFPLEVBQUMsd0NBQXdDLENBQUMsQ0FBQTt3QkFDakQsSUFBQSxVQUFDLEdBQUUsQ0FBQTt3QkFDSCxJQUFBLGdCQUFPLEVBQUMscUJBQXFCLEVBQUUsY0FBYyxFQUFFOzRCQUM3Qyx1QkFBdUI7NEJBQ3ZCLGlDQUFpQzt5QkFDbEMsQ0FBQyxDQUFBO3dCQUNGLHNCQUFNO3FCQUNQO29CQUVELElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsRUFBRTt3QkFDakMsSUFBQSxnQkFBTyxFQUFDLDJDQUEyQyxDQUFDLENBQUE7d0JBQ3BELHNCQUFNO3FCQUNQO29CQUVLLE9BQU8sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUE7Ozs7b0JBR2pELHFCQUFNLFdBQVcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUFBOztvQkFBN0MsU0FBNkMsQ0FBQTs7OztvQkFFN0MsSUFBQSxnQkFBTyxFQUFDLE9BQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtvQkFDdEIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTs7O29CQUVqQixJQUFBLFVBQUMsR0FBRSxDQUFBO29CQUNILElBQUEsVUFBQyxFQUNDLGlCQUNFLFVBQVUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsc0JBQzdCLENBQ3BCLENBQUE7b0JBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTs7OztTQUNoQjtDQUNGLENBQUE7QUFFRDs7Ozs7R0FLRztBQUNILFNBQWUsV0FBVyxDQUN4QixFQUFVLEVBQ1YsT0FBZ0IsRUFDaEIsT0FBdUI7Ozs7Ozs7b0JBRXZCLElBQUEsZ0JBQU8sRUFBQyxxQkFBcUIsR0FBRyxPQUFPLEVBQUUsQ0FBQyxDQUFBO29CQUNwQyxPQUFPLEdBQVksRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsQ0FBQTtvQkFFM0IscUJBQU0sSUFBQSx1QkFBYSxFQUNoQywrQkFBK0IsRUFFL0I7Ozs7OzZDQUNlLE9BQU8sRUFBUCx3QkFBTzt3Q0FDaEIsS0FBQSxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQTs7NENBQ2xDLHFCQUFNLElBQUEsK0JBQWUsRUFBQyxFQUFFLENBQUMsRUFBQTs7d0NBQXpCLEtBQUEsU0FBeUIsQ0FBQTs7O3dDQUZ2QixJQUFJLEtBRW1CO3dDQUU3QixJQUFJLENBQUMsT0FBTyxFQUFFOzRDQUNaLElBQUksQ0FBQyxlQUFlLEdBQUcsaURBQWlELENBQUE7eUNBQ3pFO3dDQUNELHNCQUFPLElBQUksRUFBQTs7OzZCQUNaLENBQ0YsRUFBQTs7b0JBYkssTUFBTSxHQUFHLFNBYWQ7b0JBQ0QscUJBQU0sSUFBQSx1QkFBYSxFQUFDLHdCQUF3QixFQUFFOztnQ0FDNUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTs7OzZCQUM3QyxDQUFDLEVBQUE7O29CQUZGLFNBRUUsQ0FBQTt5QkFFRSxDQUFDLE9BQU8sRUFBUix5QkFBUTtvQkFDVixzQkFBc0I7b0JBQ3RCLHFCQUFNLElBQUEsdUJBQWEsRUFBQyxvQkFBb0IsRUFBRTs7OzRDQUN4QyxxQkFBTSxjQUFjLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsRUFBQTs7d0NBQTVDLFNBQTRDLENBQUE7Ozs7NkJBQzdDLENBQUMsRUFBQTs7b0JBSEYsc0JBQXNCO29CQUN0QixTQUVFLENBQUE7b0JBRUksK0JBQTZCLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUN4RCxnRUFBZ0UsRUFDaEUsTUFBTSxDQUNQLENBQUE7b0JBRUQscUJBQU0sSUFBQSx1QkFBYSxFQUFDLDRCQUE0QixFQUFFOzs7Ozt3Q0FDMUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTt3Q0FDUixxQkFBTSxJQUFBLHlCQUFPLEVBQzdCLGtCQUFXLEdBQUcsQ0FBQyxFQUFFLENBQUMsb0NBQWlDLEVBQ25ELDRCQUEwQixFQUMxQixFQUFFLENBQ0gsRUFBQTs7d0NBSkssU0FBUyxHQUFHLFNBSWpCO3dDQUVELE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUN0Qix5REFBeUQsRUFDekQsU0FBUyxDQUFDLHFCQUFxQixDQUNoQyxDQUFBOzs7OzZCQUNGLENBQUMsRUFBQTs7b0JBWkYsU0FZRSxDQUFBO3lCQUVFLE9BQU8sRUFBUCx3QkFBTztvQkFDVCxxQkFBTSxJQUFBLHVCQUFhLEVBQUMsMkJBQTJCLEVBQUU7O2dDQUMvQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQywwQkFBMEIsRUFBRSxXQUFXLEVBQUU7b0NBQy9ELFNBQVMsRUFBRSxJQUFJO2lDQUNoQixDQUFDLENBQUE7Ozs2QkFDSCxDQUFDLEVBQUE7O29CQUpGLFNBSUUsQ0FBQTs7O29CQUVNLG9CQUFvQixPQUFPLENBQUMseUJBQXlCLENBQUMsZ0JBQXZDLENBQXVDO29CQUM5RCxxQkFBTSxJQUFBLHVCQUFhLEVBQUMsMEJBQTBCLEVBQUU7Ozs7b0NBQzlDLHFEQUFxRDtvQ0FDckQscUJBQU0saUJBQWUsRUFBRSxFQUFBOzt3Q0FEdkIscURBQXFEO3dDQUNyRCxTQUF1QixDQUFBOzs7OzZCQUN4QixDQUFDLEVBQUE7O29CQUhGLFNBR0UsQ0FBQTs7O3lCQUdBLE1BQU0sQ0FBQyw0QkFBNEIsRUFBbkMseUJBQW1DO29CQUNyQyxxQkFBTSxJQUFBLHVCQUFhLEVBQUMsc0NBQXNDLEVBQUU7Ozs0Q0FDMUQscUJBQU0sT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEVBQUU7NENBQzdELEtBQUssRUFBRSxNQUFNO3lDQUNkLENBQUMsRUFBQTs7d0NBRkYsU0FFRSxDQUFBOzs7OzZCQUNILENBQUMsRUFBQTs7b0JBSkYsU0FJRSxDQUFBOzs7Ozs7Q0FHUDtBQUVELFNBQVMsa0JBQWtCLENBQ3pCLElBQVMsRUFDVCxPQUFnQixFQUNoQixPQUF1QjtJQUV2QixJQUFJLE9BQU8sRUFBRTtRQUNYLElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUM3Qyw4QkFBOEIsRUFDOUIsTUFBTSxDQUNQLENBQUE7UUFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUE7UUFDeEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxlQUFlLENBQUMsVUFBVSxDQUFBO1FBQzVDLElBQUksQ0FBQyxjQUFjLEdBQUcsZUFBZSxDQUFDLGNBQWMsQ0FBQTtRQUNwRCxJQUFJLENBQUMsY0FBYyxHQUFHLGVBQWUsQ0FBQyxjQUFjLENBQUE7UUFDcEQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQTtRQUM5RCxJQUFJLENBQUMsY0FBYyxHQUFHLGVBQWUsQ0FBQyxjQUFjLENBQUE7UUFDcEQsb0NBQW9DO1FBQ3BDLElBQUksQ0FBQyw0QkFBNEIsR0FBRyxLQUFLLENBQUE7S0FDMUM7SUFFRCxJQUFNLGdCQUFnQixHQUFXLElBQUksQ0FBQyxzQkFBc0IsSUFBSSxTQUFTLENBQUE7SUFDekUsSUFBTSxlQUFlLEdBQVcsSUFBSSxDQUFDLHFCQUFxQixJQUFJLFNBQVMsQ0FBQTtJQUV2RSxJQUFNLE1BQU0sR0FBRztRQUNiLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxJQUFJLGVBQWU7UUFDMUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO1FBQzNCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtRQUN2QixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7UUFDdkIsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjO1FBQ25DLGlCQUFpQixFQUFFLElBQUksQ0FBQyxpQkFBaUI7UUFDekMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLG1CQUFtQjtRQUM3QyxVQUFVLEVBQUUsT0FBTztRQUNuQixrQkFBa0IsRUFBRSxJQUFJLENBQUMsa0JBQWtCLElBQUksU0FBUztRQUN4RCxpQkFBaUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCLElBQUksU0FBUztRQUN0RCxzQkFBc0IsRUFBRSxnQkFBZ0I7UUFDeEMscUJBQXFCLEVBQUUsZUFBZTtRQUN0QyxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7UUFDL0IsYUFBYSxFQUFFLG1DQUFtQztRQUNsRCxjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxlQUFlO1FBQzNFLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxJQUFJLE9BQU87UUFDNUIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1FBQ3pCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztRQUNyQiw0QkFBNEIsRUFBRSxJQUFJLENBQUMsNEJBQTRCO1FBQy9ELG9CQUFvQixFQUFFLElBQUksQ0FBQyxvQkFBb0I7UUFDL0MsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLDBCQUEwQixJQUFJLFVBQVU7UUFDekUsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjO1FBQ25DLGVBQWUsRUFBRSxJQUFJLENBQUMsZUFBZTtLQUN0QyxDQUFBO0lBRUQsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzFFLENBQUM7QUFFRCxTQUFlLGNBQWMsQ0FDM0IsTUFBd0MsRUFDeEMsT0FBdUI7Ozs7OzswQkFFRyxFQUFOLGlCQUFNOzs7eUJBQU4sQ0FBQSxvQkFBTSxDQUFBO29CQUFmLEtBQUs7b0JBQ0cscUJBQU0sSUFBQSxvQkFBUyxFQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBQTs7b0JBQXZDLFFBQVEsR0FBRyxTQUE0QjtvQkFDdkMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7b0JBRXRCLHFCQUFNLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBQTs7b0JBQWhDLE1BQU0sR0FBRyxTQUF1QjtvQkFFdEMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsMEJBQW1CLFFBQVEsQ0FBRSxFQUFFLE1BQU0sQ0FBQyxDQUFBOzs7b0JBTjdDLElBQU0sQ0FBQTs7O29CQVMxQixPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FDckIscUNBQXFDLEVBQ3JDLDBDQUEwQyxFQUMxQyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FDcEIsQ0FBQTs7Ozs7Q0FDRjtBQUVELElBQU0sU0FBUyxHQUE4QjtJQUMzQyxXQUFXLEVBQUUsaUJBQWlCO0lBQzlCLE1BQU0sRUFBRSxZQUFZO0lBQ3BCLGVBQWUsRUFBRSxxQkFBcUI7SUFDdEMsSUFBSSxFQUFFLFVBQVU7SUFDaEIsU0FBUyxFQUFFLGVBQWU7SUFDMUIsZ0JBQWdCLEVBQUUsZUFBZTtDQUNsQyxDQUFBIn0=
