import login from "./actions/login";
import sleep from '../src/common/helpers/sleep';

describe('Login Flow', () => {
  beforeEach(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: {
        notifications: 'YES',
      },
    });
  });

  it('should show error', async () => {
    // should login successfully
    await expect(element(by.id('usernameInput'))).toBeVisible();

    // we moved the login logic to an action to avoid code duplication
    await login('bad', 'credentials');

    await sleep(1000);

    // it should show the error message
    // according to the detox docs it should be toHaveText but it only works with toHaveLabel
    await expect(element(by.id('loginMsg'))).toHaveLabel('The user credentials were incorrect.');
  });

  it('should login successfully', async () => {
    // should login successfully
    await expect(element(by.id('usernameInput'))).toBeVisible();

    // we moved the login logic to an action to avoid code duplication
    await login(process.env.loginUser, process.env.loginPass);

    // it should show the newsfeed screen
    await expect(element(by.id('NewsfeedScreen'))).toBeVisible();
  });
});
