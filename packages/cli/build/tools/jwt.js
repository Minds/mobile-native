'use strict'
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i]
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
        }
        return t
      }
    return __assign.apply(this, arguments)
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.generateToken = void 0
var jsonwebtoken = require('jsonwebtoken')
/**
 * Generate a JWT
 */
function generateToken(payload, secret) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set')
  }
  if (!process.env.JWT_ISS) {
    throw new Error('JWT_ISS is not set')
  }
  if (!process.env.AUDIENCE) {
    throw new Error('AUDIENCE is not set')
  }
  return jsonwebtoken.sign(
    __assign({ iss: process.env.JWT_ISS, aud: process.env.AUDIENCE }, payload),
    secret || process.env.JWT_SECRET,
    {
      expiresIn: 30, // seconds
    }
  )
}
exports.generateToken = generateToken
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Rvb2xzL2p3dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUM1Qzs7R0FFRztBQUNILFNBQWdCLGFBQWEsQ0FBQyxPQUFlLEVBQUUsTUFBZTtJQUM1RCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUU7UUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO0tBQ3pDO0lBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFO1FBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtLQUN0QztJQUNELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRTtRQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUE7S0FDdkM7SUFFRCxPQUFPLFlBQVksQ0FBQyxJQUFJLFlBRXBCLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFDeEIsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxJQUN0QixPQUFPLEdBRVosTUFBTSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUNoQztRQUNFLFNBQVMsRUFBRSxFQUFFLEVBQUUsVUFBVTtLQUMxQixDQUNGLENBQUE7QUFDSCxDQUFDO0FBdEJELHNDQXNCQyJ9
