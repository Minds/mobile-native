import bsSharedConfig from './wdio.shared.bs.conf';

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
bsSharedConfig.capabilities = [
  {
    build: 'Minds iOS Build',
    name: 'Smoke test',
    device: 'iPhone 13',
    os_version: '15.0',
    app: process.env.BROWSERSTACK_IOS_APP_ID,
    autoAcceptAlerts: true,
  },
];

exports.config = bsSharedConfig;
