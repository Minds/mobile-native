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
          ;(0, pretty_1.heading)('Setting up network ' + id)
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
          ;(0, pretty_1.p)('   Tenant: ' + config.APP_NAME)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAtdGVuYW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL3NldHVwLXRlbmFudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDBDQUE4RDtBQUM5RCxtREFBeUM7QUFDekMseUNBQWtDO0FBQ2xDLDRDQUFnRDtBQUNoRCx3REFBd0Q7QUFFeEQsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNmLElBQUksRUFBRSxjQUFjO0lBQ3BCLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQztJQUNaLFdBQVcsRUFDVCx1RUFBdUU7SUFDekUsR0FBRyxFQUFFLFVBQU8sT0FBdUI7Ozs7O29CQUN6QixVQUFVLEdBQUssT0FBTyxXQUFaLENBQVk7b0JBR3hCLFFBQVEsR0FBRyxVQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUUsQ0FBQTtvQkFFdEMsSUFBSSxDQUFDLFFBQVEsRUFBRTt3QkFDYixJQUFBLGdCQUFPLEVBQUMsd0NBQXdDLENBQUMsQ0FBQTt3QkFDakQsSUFBQSxVQUFDLEdBQUUsQ0FBQTt3QkFDSCxJQUFBLGdCQUFPLEVBQUMscUJBQXFCLEVBQUUsY0FBYyxFQUFFOzRCQUM3Qyx1QkFBdUI7NEJBQ3ZCLGlDQUFpQzt5QkFDbEMsQ0FBQyxDQUFBO3dCQUNGLHNCQUFNO3FCQUNQO29CQUVELElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsRUFBRTt3QkFDakMsSUFBQSxnQkFBTyxFQUFDLDJDQUEyQyxDQUFDLENBQUE7d0JBQ3BELHNCQUFNO3FCQUNQO29CQUVLLE9BQU8sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUE7Ozs7b0JBR2pELHFCQUFNLFdBQVcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUFBOztvQkFBN0MsU0FBNkMsQ0FBQTs7OztvQkFFN0MsSUFBQSxnQkFBTyxFQUFD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
