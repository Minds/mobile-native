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
var commandImp = {
  name: 'mobile',
  alias: ['help'],
  run: function (toolbox) {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        ;(0, pretty_1.p)()
        ;(0,
        pretty_1.heading)('Welcome to Minds Mobile CLI '.concat(toolbox.meta.version(), '!'))
        ;(0, pretty_1.p)()
        ;(0, pretty_1.heading)('Commands')
        ;(0, pretty_1.p)()
        ;(0,
        pretty_1.command)('setup-tenant       ', 'Fetches the tenant configuration and assets for production or a preview', ['mobile setup-tenant 10', 'mobile setup-tenant 10 --preview'])
        ;(0, pretty_1.p)()
        ;(0,
        pretty_1.command)('see-tenant         ', 'Shows the tenant configuration', ['mobile see 10', 'mobile see-tenant https://mynetwork.com'])
        ;(0, pretty_1.p)()
        ;(0,
        pretty_1.command)('setup-previewer    ', 'Prepares the previewer app for building', ['mobile see-tenant 10'])
        ;(0, pretty_1.p)()
        ;(0,
        pretty_1.direction)('If you find any issue please report it to: '.concat((0, pretty_1.link)('https://gitlab.com/minds/mobile-native/-/issues')))
        ;(0, pretty_1.p)()
        return [2 /*return*/]
      })
    })
  },
}
module.exports = commandImp
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9iaWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL21vYmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDBDQUFzRTtBQUV0RSxJQUFNLFVBQVUsR0FBbUI7SUFDakMsSUFBSSxFQUFFLFFBQVE7SUFDZCxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUM7SUFDZixHQUFHLEVBQUUsVUFBTyxPQUFPOztZQUNqQixJQUFBLFVBQUMsR0FBRSxDQUFBO1lBRUgsSUFBQSxnQkFBTyxFQUFDLHNDQUErQixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFHLENBQUMsQ0FBQTtZQUNqRSxJQUFBLFVBQUMsR0FBRSxDQUFBO1lBQ0gsSUFBQSxnQkFBTyxFQUFDLFVBQVUsQ0FBQyxDQUFBO1lBQ25CLElBQUEsVUFBQyxHQUFFLENBQUE7WUFDSCxJQUFBLGdCQUFPLEVBQ0wscUJBQXFCLEVBQ3JCLHlFQUF5RSxFQUN6RSxDQUFDLHdCQUF3QixFQUFFLGtDQUFrQyxDQUFDLENBQy9ELENBQUE7WUFDRCxJQUFBLFVBQUMsR0FBRSxDQUFBO1lBQ0gsSUFBQSxnQkFBTyxFQUFDLHFCQUFxQixFQUFFLGdDQUFnQyxFQUFFO2dCQUMvRCxlQUFlO2dCQUNmLHlDQUF5QzthQUMxQyxDQUFDLENBQUE7WUFDRixJQUFBLFVBQUMsR0FBRSxDQUFBO1lBQ0gsSUFBQSxnQkFBTyxFQUFDLHFCQUFxQixFQUFFLHlDQUF5QyxFQUFFO2dCQUN4RSxzQkFBc0I7YUFDdkIsQ0FBQyxDQUFBO1lBQ0YsSUFBQSxVQUFDLEdBQUUsQ0FBQTtZQUNILElBQUEsa0JBQVMsRUFDUCxxREFBOEMsSUFBQSxhQUFJLEVBQ2hELGlEQUFpRCxDQUNsRCxDQUFFLENBQ0osQ0FBQTtZQUNELElBQUEsVUFBQyxHQUFFLENBQUE7OztTQUNKO0NBQ0YsQ0FBQTtBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFBIn0=
