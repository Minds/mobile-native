import login from "./actions/login";

describe('Login Flow', () => {
  beforeEach(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: {
        notifications: 'YES',
      },
    });
  });

  it('should show world screen after tap', async () => {
    await expect(element(by.id('loginscreentext'))).toBeVisible();
  });

  /*it('should show error', async () => {
    // login should be visible
    await waitFor(element(by.id('usernameInput')))
      .toBeVisible()
      .withTimeout(10000);

    // we moved the login logic to an action to avoid code duplication
    await login('bad', 'credentials');

    // wait for the message
    await waitFor(element(by.id('loginMsg')))
      .toBeVisible()
      .withTimeout(10000);

    // it should show the error message
    // according to the detox docs it should be toHaveText but it only works with toHaveLabel
    await expect(element(by.id('loginMsg'))).toHaveText('The user credentials were incorrect.');
  });*/

  /*it('should login successfully', async () => {
    // login should be visible
    await waitFor(element(by.id('usernameInput')))
      .toBeVisible()
      .withTimeout(10000);

    // we moved the login logic to an action to avoid code duplication
    await login(process.env.loginUser, process.env.loginPass);

    // it should show the newsfeed screen
    await expect(element(by.id('NewsfeedScreen'))).toBeVisible();
  });*/
});
