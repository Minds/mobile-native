require('dotenv').config();
var browserstack = require('browserstack-local');

const localIdentifier = `foobar_${Date.now()}`;

exports.config = {
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,

  updateJob: false,
  specs: ['./e2e/test/specs/login.spec.js'],
  exclude: [],
  services: ['browserstack'],

  capabilities: [
    {
      project: 'Minds Android WebdriverIO Test Project',
      build: 'Minds Android Build',
      name: 'smoke_test',
      device: 'Google Pixel 6',
      os_version: '12.0',
      app: process.env.BROWSERSTACK_ANDROID_APP_ID,
      autoGrantPermissions: 'true',
      'browserstack.localIdentifier': localIdentifier,
      'browserstack.local': true,
      'browserstack.debug': true,
    },
  ],

  logLevel: 'info',
  coloredLogs: true,
  screenshotPath: './errorShots/',
  baseUrl: '',
  waitforTimeout: 30000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,

  framework: 'jasmine',
  jasmineOpts: {
    defaultTimeoutInterval: 300000,
  },

  // Code to start browserstack local before start of test
  onPrepare: (config, capabilities) => {
    console.log('Connecting local...');
    return new Promise((resolve, reject) => {
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start(
        { localIdentifier, key: exports.config.key },
        error => {
          if (error) {
            return reject(error);
          }
          console.log('Connected. Now testing...');

          resolve();
        },
      );
    });
  },

  // Code to stop browserstack local after end of test
  onComplete: (capabilties, specs) => {
    console.log('Closing local tunnel...');
    return new Promise((resolve, reject) => {
      exports.bs_local.stop(error => {
        if (error) {
          return reject(error);
        }
        console.log('Stopped BrowserStackLocal...');

        resolve();
      });
    });
  },
};
