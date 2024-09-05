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
exports.getTenantConfig = void 0
var graphql_request_1 = require('graphql-request')
var jwt_1 = require('./jwt')
var tenantMobileQuery =
  '\nquery GetMobileConfig($tenantId: Int!) {\n  appReadyMobileConfig(tenantId: $tenantId) {\n    APP_NAME\n    TENANT_ID\n    APP_HOST\n    APP_SPLASH_RESIZE\n    ACCENT_COLOR_LIGHT\n    ACCENT_COLOR_DARK\n    WELCOME_LOGO\n    THEME\n    API_URL\n    APP_SLUG\n    APP_SCHEME\n    EAS_PROJECT_ID\n    APP_IOS_BUNDLE\n    APP_ANDROID_PACKAGE\n    APP_TRACKING_MESSAGE_ENABLED\n    APP_TRACKING_MESSAGE\n    IS_NON_PROFIT\n    assets {\n      key\n      value\n    }\n    __typename\n  }\n}\n'
// we query the tenant config to get the loggedInLandingPageIdMobile, maybe we should move this to the mobile config query
var tenantQuery =
  '\nquery GetMultiTenantConfig {\n  multiTenantConfig {\n    siteName\n    siteEmail\n    colorScheme\n    primaryColor\n    canEnableFederation\n    federationDisabled\n    replyEmail\n    boostEnabled\n    customHomePageEnabled\n    customHomePageDescription\n    walledGardenEnabled\n    digestEmailEnabled\n    welcomeEmailEnabled\n    loggedInLandingPageIdMobile\n    nsfwEnabled\n  }\n}\n'
function getTenantConfig(id) {
  return __awaiter(this, void 0, void 0, function () {
    var graphqlURL, headers, mobileConfig, config
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          graphqlURL =
            process.env.GRAPHQL_URL || 'https://www.minds.com/api/graphql'
          headers = {
            cookie: 'staging=1;',
            Token: (0, jwt_1.generateToken)({ TENANT_ID: id }),
          }
          return [
            4 /*yield*/,
            (0, graphql_request_1.request)(
              graphqlURL,
              tenantMobileQuery,
              { tenantId: parseInt(id, 10) },
              headers
            ),
          ]
        case 1:
          mobileConfig = _a.sent().appReadyMobileConfig
          return [
            4 /*yield*/,
            (0, graphql_request_1.request)(
              mobileConfig.API_URL + 'api/graphql',
              tenantQuery,
              {},
              headers
            ),
          ]
        case 2:
          config = _a.sent().multiTenantConfig
          mobileConfig.APP_LANDING_PAGE_LOGGED_IN =
            config.loggedInLandingPageIdMobile
          return [2 /*return*/, mobileConfig]
      }
    })
  })
}
exports.getTenantConfig = getTenantConfig
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVuYW50LWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90b29scy90ZW5hbnQtY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG1EQUF5QztBQUN6Qyw2QkFBcUM7QUFFckMsSUFBTSxpQkFBaUIsR0FBVywyZUEyQmpDLENBQUE7QUFFRCwwSEFBMEg7QUFDMUgsSUFBTSxXQUFXLEdBQVcsMFlBb0IzQixDQUFBO0FBRUQsU0FBc0IsZUFBZSxDQUFDLEVBQVU7Ozs7OztvQkFDeEMsVUFBVSxHQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxJQUFJLG1DQUFtQyxDQUFBO29CQUUxRCxPQUFPLEdBQUc7d0JBQ2QsTUFBTSxFQUFFLFlBQVk7d0JBQ3BCLEtBQUssRUFBRSxJQUFBLG1CQUFhLEVBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLENBQUM7cUJBQ3hDLENBQUE7b0JBR0MscUJBQU0sSUFBQSx5QkFBTyxFQUNYLFVBQVUsRUFDVixpQkFBaUIsRUFDakIsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUM5QixPQUFPLENBQ1IsRUFBQTs7b0JBTkcsWUFBWSxHQUFHLENBQ25CLFNBS0MsQ0FDRixDQUFDLG9CQUFvQjtvQkFHcEIscUJBQU0sSUFBQSx5QkFBTyxFQUNYLFlBQVksQ0FBQyxPQUFPLEdBQUcsYUFBYSxFQUNwQyxXQUFXLEVBQ1gsRUFBRSxFQUNGLE9BQU8sQ0FDUixFQUFBOztvQkFORyxNQUFNLEdBQUcsQ0FDYixTQUtDLENBQ0YsQ0FBQyxpQkFBaUI7b0JBRW5CLFlBQVksQ0FBQywwQkFBMEIsR0FBRyxNQUFNLENBQUMsMkJBQTJCLENBQUE7b0JBRTVFLHNCQUFPLFlBQVksRUFBQTs7OztDQUNwQjtBQTlCRCwwQ0E4QkMifQ==
