import bsSharedConfig from './wdio.shared.bs.conf';

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
bsSharedConfig.capabilities = [
  {
    build: 'Minds Android Build',
    name: 'Smoke test',
    device: 'Google Pixel 6',
    os_version: '12.0',
    app: process.env.BROWSERSTACK_ANDROID_APP_ID,
    autoGrantPermissions: true,
  },
];

exports.config = bsSharedConfig;
