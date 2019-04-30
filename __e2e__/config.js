import factory from '../tests-helpers/e2e-driver.factory';

const customCapabilities = {
  'device' : 'Samsung Galaxy S9',
  'os_version' : '8.0'
};

let driver, capabilities;

if (process.env.e2elocal) {
  [driver, capabilities] = factory('androidLocal', {});
} else {
  [driver, capabilities] = factory('browserStack', customCapabilities);
}

export {driver, capabilities} ;
