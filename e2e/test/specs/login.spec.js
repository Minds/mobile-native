import LoginPage from '../pageobjects/login.page';

describe('Login Page Test Cases', () => {
  // Before Each method - gets login page.
  beforeEach('Open Login Page...', async () => {
    await LoginPage.loginButton.waitForDisplayed();
    //await driver.updateSettings({ snapshotMaxDepth: 5000 });
  });

  // Test Case to login with empty credentials.
  it('Should not login with empty credentials..', async () => {
    await LoginPage.login('', '');
    await LoginPage.emptyCredentialsError.waitForDisplayed();
    const emptyCredentialsErrorDisplayed = LoginPage.emptyCredentialsError.isDisplayed();
    expect(emptyCredentialsErrorDisplayed).toBeTruthy(
      'Empty credentials error did not show up as expected!',
    );
  });

  // Test Case to login with incorrect credentials.
  it('Should not login with incorrect credentials..', async () => {
    await LoginPage.login(LoginPage.incorrectUser, LoginPage.incorrectPassword);
    await LoginPage.incorrectCredentialsError.waitForDisplayed();
    const incorrectCredentialsErrorDisplayed = LoginPage.incorrectCredentialsError.isDisplayed();
    expect(incorrectCredentialsErrorDisplayed).toBeTruthy(
      'Incorrect credentials error did not show up as expected!',
    );
  });

  // Test Case to login with banned account.
  it('Should not login with banned account..', async () => {
    await LoginPage.login(LoginPage.bannedUser, LoginPage.bannedPassword);
    await LoginPage.incorrectCredentialsError.waitForDisplayed();
    const bannedUserErrorDisplayed = LoginPage.incorrectCredentialsError.isDisplayed();
    expect(bannedUserErrorDisplayed).toBeTruthy(
      'Banned user login error did not show up as expected!',
    );
  });

  // Test Case to login with deleted account.
  it('Should not login with deleted account..', async () => {
    await LoginPage.loginButton.waitForDisplayed();
    await LoginPage.login(LoginPage.deletedUser, LoginPage.deletedPassword);
    await LoginPage.incorrectCredentialsError.waitForDisplayed();
    const deletedUserErrorDisplayed = LoginPage.incorrectCredentialsError.isDisplayed();
    expect(deletedUserErrorDisplayed).toBeTruthy(
      'Banned user login error did not show up as expected!',
    );
  });

  // Test Case to successfully login a valid user.
  it('Should successfully login a valid user..', async () => {
    await LoginPage.login(LoginPage.validUser, LoginPage.validPassword);
    await LoginPage.homeButton.waitForDisplayed({
      timeout: LoginPage.maxTimeout,
    });
    const homeButtonDisplayed = LoginPage.homeButton.isDisplayed();
    expect(homeButtonDisplayed).toBeTruthy('Login was not successful!');
  });

  // After All method - logs out of the mobile app.
  afterAll('Logout the user...', async () => {
    await LoginPage.logout();
  });
});
