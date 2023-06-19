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
    platformName: 'iOS',
    maxInstances: 1,
    // For W3C the appium capabilities need to have an extension prefix
    // This is `appium:` for all Appium Capabilities which can be found here
    // http://appium.io/docs/en/writing-running-appium/caps/
    'appium:deviceName': process.env.IOS_DEVICE_NAME,
    'appium:platformVersion': process.env.IOS_PLATFORM_VERSION,
    'appium:orientation': 'PORTRAIT',
    'appium:automationName': 'XCUITest',
    'appium:autoAcceptAlerts': true,
    // @ts-ignore
    'appium:settings[snapshotMaxDepth]': 60,
    // The path to the app
    'appium:app': join(process.cwd(), './apps/Minds.app'),
    'appium:newCommandTimeout': 240,
  },
];

if (config.cucumberOpts) {
  config.cucumberOpts.tagExpression = 'not @android';
}

exports.config = config;
