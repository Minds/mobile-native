const jsonwebtoken = require('jsonwebtoken')
/**
 * Generate a JWT
 */
export function generateToken(payload: Object, secret?: string) {
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
    {
      iss: process.env.JWT_ISS,
      aud: process.env.AUDIENCE,
      ...payload,
    },
    secret || process.env.JWT_SECRET,
    {
      expiresIn: 30, // seconds
    }
  )
}
