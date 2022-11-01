import { join } from 'path';
import config from './wdio.shared.local.conf';

// ============
// Specs
// ============
// config.specs?.push()

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
config.capabilities = [
  {
    // The defaults you need to have in your config
    platformName: 'Android',
    maxInstances: 1,
    // For W3C the appium capabilities need to have an extension prefix
    // http://appium.io/docs/en/writing-running-appium/caps/
    // This is `appium:` for all Appium Capabilities which can be found here
    'appium:deviceName': 'Pixel_4_API_32',
    'appium:platformVersion': '12.0',
    'appium:orientation': 'PORTRAIT',
    'appium:automationName': 'UiAutomator2',
    // The path to the app
    'appium:app': join(process.cwd(), './apps/Minds.apk'),
    'appium:appWaitActivity': 'com.minds.mobile.MainActivity',
    'appium:newCommandTimeout': 240,
  },
];

if (config.cucumberOpts) {
  config.cucumberOpts.tagExpression = 'not @ios';
}

exports.config = config;
