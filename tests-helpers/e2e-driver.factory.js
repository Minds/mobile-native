import wd from 'wd';
import path from 'path';

const settings = {
  // install the current debug build
  "androidLocal": {
    "platformName": "Android",
    "automationName": "UIAutomator2",
    "deviceName": "Android Emulator",
    "app": path.normalize(__dirname+'/../android/app/build/outputs/apk/debug/app-debug.apk')
  },
  // use the current installed binary (production/debug)
  "androidLocalInstalled": {
    "platformName": 'Android',
    "deviceName": 'Android Emulator',
    "appPackage": "com.minds.mobile",
    "appActivity": "com.minds.mobile.MainActivity"
  },
  "iOSLocal": {
    "platformName": 'iOS',
    "platformVersion": '12.1',
    "deviceName": 'iPhone X',
    "automationName": 'XCUITest',
    "app": path.normalize(__dirname+'/../Minds.app.zip'),
  },
  // run on browserstack devices
  "browserStack": {
    'browserstack.user' : process.env.bsUSER,
    'browserstack.key' : process.env.bsKEY,
    'browserstack.networkLogs': true,
    'build' : 'v3.4.0',
    'name': 'single_test',
    'app' : process.env.bsAPP,
    'browserstack.debug' : true
  }
}

const factory = function(name, overwrite) {
  if (!settings[name]) {
    throw new Error('Capability not defined');
  }

  const capabilities = settings[name];

  if (overwrite) Object.assign(capabilities, overwrite);

  let driver;
  if (name === 'browserStack') {
    driver = wd.promiseRemote("http://hub-cloud.browserstack.com/wd/hub");
  } else {
    driver = wd.promiseChainRemote('localhost', 4723);
  }

  return [driver, capabilities];
}

export default factory;