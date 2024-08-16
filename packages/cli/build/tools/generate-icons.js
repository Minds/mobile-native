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
var sharp = require('sharp')
function addAdaptiveIcon(imagePath, outputPath, paddingRatio) {
  var _a
  if (imagePath === void 0) {
    imagePath = './assets/images/icon.png'
  }
  if (outputPath === void 0) {
    outputPath = './assets/images/icon_adaptive.png'
  }
  if (paddingRatio === void 0) {
    paddingRatio = 0.25
  }
  return __awaiter(this, void 0, void 0, function () {
    var image,
      metadata,
      padding,
      topLeftPixel,
      backgroundColor,
      imageBuff,
      error_1
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 4, , 5])
          image = sharp(imagePath)
          return [
            4 /*yield*/,
            image.metadata(),
            // Calculate padding
          ]
        case 1:
          metadata = _b.sent()
          padding = Math.round(metadata.width * paddingRatio)
          return [
            4 /*yield*/,
            image
              .extract({ width: 1, height: 1, left: 0, top: 0 })
              .raw()
              .toBuffer(),
            // Convert the pixel data to rgba format for the background color
          ]
        case 2:
          topLeftPixel = _b.sent()
          backgroundColor = 'rgba('
            .concat(topLeftPixel[0], ', ')
            .concat(topLeftPixel[1], ', ')
            .concat(topLeftPixel[2], ', ')
            .concat(
              (_a = topLeftPixel[3]) !== null && _a !== void 0 ? _a : 255,
              ')'
            )
          return [
            4 /*yield*/,
            sharp(imagePath)
              .extend({
                top: padding,
                bottom: padding,
                left: padding,
                right: padding,
                background: backgroundColor,
              })
              .toBuffer(),
            // can't extend and resize in one step
          ]
        case 3:
          imageBuff = _b.sent()
          // can't extend and resize in one step
          sharp(imageBuff).resize(1024, null).toFile(outputPath) // Save the output to a new file
          return [3 /*break*/, 5]
        case 4:
          error_1 = _b.sent()
          console.error('Error processing image:', error_1)
          return [3 /*break*/, 5]
        case 5:
          return [2 /*return*/]
      }
    })
  })
}
// generates 96x96 white only icon using ./assets/images/icon.png
function generateNotificationIcon(imagePath, outputPath) {
  if (imagePath === void 0) {
    imagePath = './assets/images/icon.png'
  }
  if (outputPath === void 0) {
    outputPath = './assets/images/icon_mono.png'
  }
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            sharp(imagePath)
              .resize(96, 96)
              .greyscale() // Convert to grayscale
              // .threshold(240, { grayscale: true }) // Set threshold for white
              .toFile(outputPath),
          ]
        case 1:
          _a.sent()
          return [2 /*return*/]
      }
    })
  })
}
module.exports = {
  addAdaptiveIcon: addAdaptiveIcon,
  generateNotificationIcon: generateNotificationIcon,
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUtaWNvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdG9vbHMvZ2VuZXJhdGUtaWNvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBRTlCLFNBQWUsZUFBZSxDQUM1QixTQUFzQyxFQUN0QyxVQUFnRCxFQUNoRCxZQUFtQjs7SUFGbkIsMEJBQUEsRUFBQSxzQ0FBc0M7SUFDdEMsMkJBQUEsRUFBQSxnREFBZ0Q7SUFDaEQsNkJBQUEsRUFBQSxtQkFBbUI7Ozs7Ozs7b0JBSVgsS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQTtvQkFHYixxQkFBTSxLQUFLLENBQUMsUUFBUSxFQUFFO3dCQUV2QyxvQkFBb0I7c0JBRm1COztvQkFBakMsUUFBUSxHQUFHLFNBQXNCO29CQUdqQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQyxDQUFBO29CQUdwQyxxQkFBTSxLQUFLOzZCQUM3QixPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUM7NkJBQ2pELEdBQUcsRUFBRTs2QkFDTCxRQUFRLEVBQUU7d0JBRWIsaUVBQWlFO3NCQUZwRDs7b0JBSFAsWUFBWSxHQUFHLFNBR1I7b0JBR1AsZUFBZSxHQUFHLGVBQVEsWUFBWSxDQUFDLENBQUMsQ0FBQyxlQUFLLFlBQVksQ0FBQyxDQUFDLENBQUMsZUFDakUsWUFBWSxDQUFDLENBQUMsQ0FBQyxlQUNaLE1BQUEsWUFBWSxDQUFDLENBQUMsQ0FBQyxtQ0FBSSxHQUFHLE1BQUcsQ0FBQTtvQkFHWixxQkFBTSxLQUFLLENBQUMsU0FBUyxDQUFDOzZCQUNyQyxNQUFNLENBQUM7NEJBQ04sR0FBRyxFQUFFLE9BQU87NEJBQ1osTUFBTSxFQUFFLE9BQU87NEJBQ2YsSUFBSSxFQUFFLE9BQU87NEJBQ2IsS0FBSyxFQUFFLE9BQU87NEJBQ2QsVUFBVSxFQUFFLGVBQWU7eUJBQzVCLENBQUM7NkJBQ0QsUUFBUSxFQUFFO3dCQUViLHNDQUFzQztzQkFGekI7O29CQVJQLFNBQVMsR0FBRyxTQVFMO29CQUViLHNDQUFzQztvQkFDdEMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFBLENBQUMsZ0NBQWdDOzs7O29CQUV2RixPQUFPLENBQUMsS0FBSyxDQUFDLHlCQUF5QixFQUFFLE9BQUssQ0FBQyxDQUFBOzs7Ozs7Q0FFbEQ7QUFFRCxpRUFBaUU7QUFDakUsU0FBZSx3QkFBd0IsQ0FDckMsU0FBc0MsRUFDdEMsVUFBNEM7SUFENUMsMEJBQUEsRUFBQSxzQ0FBc0M7SUFDdEMsMkJBQUEsRUFBQSw0Q0FBNEM7Ozs7d0JBRTVDLHFCQUFNLEtBQUssQ0FBQyxTQUFTLENBQUM7eUJBQ25CLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO3lCQUNkLFNBQVMsRUFBRSxDQUFDLHVCQUF1Qjt3QkFDcEMsa0VBQWtFO3lCQUNqRSxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUE7O29CQUpyQixTQUlxQixDQUFBOzs7OztDQUN0QjtBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsRUFBRSxlQUFlLGlCQUFBLEVBQUUsd0JBQXdCLDBCQUFBLEVBQUUsQ0FBQSJ9
