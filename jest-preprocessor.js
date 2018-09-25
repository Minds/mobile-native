/**
 * workaround in order to get jest working without break the app building
 * (without this jest works with babel.config.js instead of .babelrc, but this change break the app
 * https://github.com/facebook/react-native/issues/20614#issuecomment-421405255
 */
const fs = require("fs")

const config = fs.readFileSync("./.babelrc")

module.exports = require("babel-jest").createTransformer(JSON.parse(config))