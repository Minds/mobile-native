/* eslint-env detox/detox, jest */
import {
  waitForAndType,
  waitForElement,
  waitForAndTap,
} from './helpers/waitFor';

describe('Register Flow', () => {
  const username = 'e2euser' + ((Math.random() * 0xffffff) << 0).toString(16);
  const password = process.env.loginPass;

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should register correctly', async () => {
    // login should be visible
    await waitForElement(by.id('usernameInput'));

    // nav to register
    await waitForAndTap(by.id('registerButton'));

    // fill the form
    waitForAndType(by.id('usernameInput'), username);
    waitForAndType(by.id('emailInput'), 'mye2e@minds.com');
    waitForAndType(by.id('passwordInput'), password);

    // accept terms
    const checkbox = element(by.id('checkbox')).atIndex(0);
    await waitFor(checkbox).toBeVisible().withTimeout(10000);
    await checkbox.tap({ x: 1, y: 1 });
  });
});
