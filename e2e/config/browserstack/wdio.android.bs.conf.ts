import bsSharedConfig, { localIdentifier } from './wdio.shared.bs.conf';

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
bsSharedConfig.capabilities = [
  {
    build: 'Minds Android Build',
    name: 'smoke_test',
    device: 'Google Pixel 6',
    os_version: '12.0',
    app: process.env.BROWSERSTACK_ANDROID_APP_ID,
    autoGrantPermissions: true,
    // @ts-ignore
    'browserstack.localIdentifier': localIdentifier,
    'browserstack.local': false,
    'browserstack.debug': true,
  },
];

exports.config = bsSharedConfig;
