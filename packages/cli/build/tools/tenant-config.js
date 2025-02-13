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
exports.clearAllMobileAppVersions =
  exports.setMobileProductionAppVersion =
  exports.getTenantConfig =
    void 0
var graphql_request_1 = require('graphql-request')
var jwt_1 = require('./jwt')
var tenantMobileQuery =
  '\nquery GetMobileConfig($tenantId: Int!) {\n  appReadyMobileConfig(tenantId: $tenantId) {\n    APP_NAME\n    TENANT_ID\n    APP_HOST\n    APP_SPLASH_RESIZE\n    ACCENT_COLOR_LIGHT\n    PRODUCTION_APP_VERSION\n    ACCENT_COLOR_DARK\n    WELCOME_LOGO\n    THEME\n    API_URL\n    APP_SLUG\n    APP_SCHEME\n    EAS_PROJECT_ID\n    APP_IOS_BUNDLE\n    APP_ANDROID_PACKAGE\n    APP_TRACKING_MESSAGE_ENABLED\n    APP_TRACKING_MESSAGE\n    IS_NON_PROFIT\n    assets {\n      key\n      value\n    }\n    __typename\n  }\n}\n'
// we query the tenant config to get the loggedInLandingPageIdMobile, maybe we should move this to the mobile config query
var tenantQuery =
  '\nquery GetMultiTenantConfig {\n  multiTenantConfig {\n    siteName\n    siteEmail\n    colorScheme\n    primaryColor\n    canEnableFederation\n    federationDisabled\n    replyEmail\n    boostEnabled\n    customHomePageEnabled\n    customHomePageDescription\n    walledGardenEnabled\n    digestEmailEnabled\n    welcomeEmailEnabled\n    loggedInLandingPageIdMobile\n    nsfwEnabled\n  }\n}\n'
function getHeaders(tenantId) {
  return {
    cookie: 'staging=1;',
    Token: (0, jwt_1.generateToken)({ TENANT_ID: tenantId }),
  }
}
function getTenantConfig(id) {
  return __awaiter(this, void 0, void 0, function () {
    var graphqlURL, headers, mobileConfig, config
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          graphqlURL =
            process.env.GRAPHQL_URL || 'https://www.minds.com/api/graphql'
          headers = getHeaders(id)
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
function setMobileProductionAppVersion(tenantId, productionAppVersion) {
  return __awaiter(this, void 0, void 0, function () {
    var graphqlURL, headers, mutation, response
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          graphqlURL =
            process.env.GRAPHQL_URL || 'https://www.minds.com/api/graphql'
          headers = getHeaders(tenantId)
          mutation =
            '\n  mutation SetMobileProductionAppVersion {\n    mobileProductionAppVersion(tenantId: '
              .concat(tenantId, ', productionAppVersion: "')
              .concat(productionAppVersion, '")\n  }\n  ')
          return [
            4 /*yield*/,
            (0, graphql_request_1.request)(graphqlURL, mutation, {}, headers),
          ]
        case 1:
          response = _a.sent()
          return [2 /*return*/, response]
      }
    })
  })
}
exports.setMobileProductionAppVersion = setMobileProductionAppVersion
function clearAllMobileAppVersions() {
  return __awaiter(this, void 0, void 0, function () {
    var graphqlURL, headers, mutation
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          graphqlURL =
            process.env.GRAPHQL_URL || 'https://www.minds.com/api/graphql'
          headers = getHeaders('1')
          mutation =
            '\n  mutation  ClearAllMobileAppVersions {\n    clearAllMobileAppVersions\n  }\n  '
          return [
            4 /*yield*/,
            (0, graphql_request_1.request)(graphqlURL, mutation, {}, headers),
          ]
        case 1:
          return [2 /*return*/, _a.sent()]
      }
    })
  })
}
exports.clearAllMobileAppVersions = clearAllMobileAppVersions
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVuYW50LWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90b29scy90ZW5hbnQtY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG1EQUF5QztBQUN6Qyw2QkFBcUM7QUFFckMsSUFBTSxpQkFBaUIsR0FBVyx1Z0JBNEJqQyxDQUFBO0FBRUQsMEhBQTBIO0FBQzFILElBQU0sV0FBVyxHQUFXLDBZQW9CM0IsQ0FBQTtBQUNELFNBQVMsVUFBVSxDQUFDLFFBQWdCO0lBQ2xDLE9BQU87UUFDTCxNQUFNLEVBQUUsWUFBWTtRQUNwQixLQUFLLEVBQUUsSUFBQSxtQkFBYSxFQUFDLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxDQUFDO0tBQzlDLENBQUE7QUFDSCxDQUFDO0FBRUQsU0FBc0IsZUFBZSxDQUFDLEVBQVU7Ozs7OztvQkFDeEMsVUFBVSxHQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxJQUFJLG1DQUFtQyxDQUFBO29CQUUxRCxPQUFPLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUc3QixxQkFBTSxJQUFBLHlCQUFPLEVBQ1gsVUFBVSxFQUNWLGlCQUFpQixFQUNqQixFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQzlCLE9BQU8sQ0FDUixFQUFBOztvQkFORyxZQUFZLEdBQUcsQ0FDbkIsU0FLQyxDQUNGLENBQUMsb0JBQW9CO29CQUdwQixxQkFBTSxJQUFBLHlCQUFPLEVBQ1gsWUFBWSxDQUFDLE9BQU8sR0FBRyxhQUFhLEVBQ3BDLFdBQVcsRUFDWCxFQUFFLEVBQ0YsT0FBTyxDQUNSLEVBQUE7O29CQU5HLE1BQU0sR0FBRyxDQUNiLFNBS0MsQ0FDRixDQUFDLGlCQUFpQjtvQkFFbkIsWUFBWSxDQUFDLDBCQUEwQixHQUFHLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQTtvQkFFNUUsc0JBQU8sWUFBWSxFQUFBOzs7O0NBQ3BCO0FBM0JELDBDQTJCQztBQUVELFNBQXNCLDZCQUE2QixDQUNqRCxRQUFnQixFQUNoQixvQkFBNEI7Ozs7OztvQkFFdEIsVUFBVSxHQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxJQUFJLG1DQUFtQyxDQUFBO29CQUUxRCxPQUFPLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUUvQixRQUFRLEdBQUcsaUdBRXdCLFFBQVEsdUNBQTRCLG9CQUFvQixpQkFFaEcsQ0FBQTtvQkFFZ0IscUJBQU0sSUFBQSx5QkFBTyxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFBOztvQkFBM0QsUUFBUSxHQUFHLFNBQWdEO29CQUNqRSxzQkFBTyxRQUFRLEVBQUE7Ozs7Q0FDaEI7QUFqQkQsc0VBaUJDO0FBRUQsU0FBc0IseUJBQXlCOzs7Ozs7b0JBQ3ZDLFVBQVUsR0FDZCxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsSUFBSSxtQ0FBbUMsQ0FBQTtvQkFFMUQsT0FBTyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFFMUIsUUFBUSxHQUFHLG1GQUloQixDQUFBO29CQUVNLHFCQUFNLElBQUEseUJBQU8sRUFBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBQTt3QkFBdkQsc0JBQU8sU0FBZ0QsRUFBQTs7OztDQUN4RDtBQWJELDhEQWFDIn0=
