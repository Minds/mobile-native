import bsSharedConfig, { localIdentifier } from './wdio.shared.bs.conf';

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
bsSharedConfig.capabilities = [
  {
    build: 'Minds iOS Build',
    name: 'smoke_test',
    device: 'iPhone 13',
    os_version: '15.0',
    app: process.env.BROWSERSTACK_IOS_APP_ID,
    autoAcceptAlerts: true,
    // @ts-ignore
    'browserstack.localIdentifier': localIdentifier,
    'browserstack.local': false,
    'browserstack.debug': true,
  },
];

exports.config = bsSharedConfig;
