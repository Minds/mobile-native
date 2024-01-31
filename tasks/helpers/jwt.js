const jsonwebtoken = require('jsonwebtoken');
/**
 * Generate a JWT
 */
function generateToken(payload, secret) {
  return jsonwebtoken.sign(
    {
      iss: process.env.JWT_ISS,
      aud: process.env.AUDIENCE,
      ...payload,
    },
    secret || process.env.JWT_SECRET,
    {
      expiresIn: 30, // seconds
    },
  );
}

module.exports = { generateToken };
