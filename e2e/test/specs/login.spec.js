import LoginPage from '../pageobjects/login.page';

describe('Login Page Test Cases', () => {
  // Before Each method - updates settings.
  beforeEach('Update App Settings...', async () => {
    //driver.updateSettings({snapshotMaxDepth: 5000});
  });

  // Test Case to successfully login a valid user.
  it('Should successfully login a valid user..', async () => {
    await LoginPage.loginButton.waitForDisplayed();
    await LoginPage.login(LoginPage.validUser, LoginPage.validPassword);
    await LoginPage.homeButton.waitForDisplayed();
    const homeButtonDisplayed = LoginPage.homeButton.isDisplayed();
    expect(homeButtonDisplayed).toBeTruthy('Login was not successful!');
  });

  // After All method - closes the mobile app.
  afterAll('Close the browser...', async () => {
    //browser.closeApp();
  });
});
