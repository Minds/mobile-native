import RegistrationPage from '../pageobjects/registration.page';

describe('Registration Page Test Cases', () => {
  // Before Each method - gets registration page.
  beforeEach('Open Register Page...', async () => {
    await RegistrationPage.joinNowButton.waitForDisplayed();
    await RegistrationPage.joinNowButton.click();
  });

  // Test Case to register with empty credentials.
  it('Should not register with empty credentials..', async () => {
    await RegistrationPage.usernameField.waitForDisplayed();
    await RegistrationPage.usernameField.setValue('');
    await RegistrationPage.emailField.setValue('');
    await RegistrationPage.passwordField.setValue('');
    await RegistrationPage.checkboxes.atIndex(0).click();
    await RegistrationPage.registerButton.click();
    await RegistrationPage.emptyCredentialsError.waitForDisplayed();
    const emptyCredentialsErrorDisplayed = RegistrationPage.emptyCredentialsError.isDisplayed();
    expect(emptyCredentialsErrorDisplayed).toBeTruthy(
      'Empty credentials error did not show up as expected!',
    );
  });

  // Test Case to register with invalid password.
  it('Should not register with invalid password..', async () => {
    await RegistrationPage.usernameField.waitForDisplayed();
    await RegistrationPage.usernameField.setValue(RegistrationPage.validUser);
    await RegistrationPage.emailField.setValue(RegistrationPage.validEmail);
    await RegistrationPage.passwordField.setValue(
      RegistrationPage.invalidPassword,
    );
    await RegistrationPage.checkboxes.atIndex(0).click();
    await RegistrationPage.registerButton.click();
    await RegistrationPage.invalidPasswordError.waitForDisplayed();
    const invalidPasswordErrorDisplayed = RegistrationPage.invalidPasswordError.isDisplayed();
    //await element(by.id('checkbox')).atIndex(0).tapAtPoint({x:30, y:30});
    expect(invalidPasswordErrorDisplayed).toBeTruthy(
      'Insecure password error did not show up as expected!',
    );
  });

  // Test Case to register with invalid email.
  it('Should not register with invalid email..', async () => {
    await RegistrationPage.usernameField.waitForDisplayed();
    await RegistrationPage.usernameField.setValue(RegistrationPage.validUser);
    await RegistrationPage.emailField.setValue(RegistrationPage.invalidEmail);
    await RegistrationPage.passwordField.setValue(
      RegistrationPage.validPassword,
    );
    await RegistrationPage.checkboxes.atIndex(0).click();
    await RegistrationPage.registerButton.click();
    await RegistrationPage.invalidEmailError.waitForDisplayed();
    const invalidEmailErrorDisplayed = RegistrationPage.invalidEmailError.isDisplayed();
    expect(invalidEmailErrorDisplayed).toBeTruthy(
      'Invalid email error did not show up as expected!',
    );
  });

  // Test Case to register with a duplicate username.
  it('Should not register with a duplicate username..', async () => {
    await RegistrationPage.usernameField.waitForDisplayed();
    await RegistrationPage.usernameField.setValue(
      RegistrationPage.usernameInUse,
    );
    await RegistrationPage.emailField.setValue(RegistrationPage.validEmail);
    await RegistrationPage.passwordField.setValue(
      RegistrationPage.validPassword,
    );
    await RegistrationPage.checkboxes.atIndex(0).click();
    await RegistrationPage.registerButton.click();
    await RegistrationPage.duplicateUsernameError.waitForDisplayed();
    const duplicateUsernameErrorDisplayed = RegistrationPage.duplicateUsernameError.isDisplayed();
    expect(duplicateUsernameErrorDisplayed).toBeTruthy(
      'Username already taken error did not show up as expected!',
    );
  });

  // Test Case to register without TOS accepted.
  it('Should not register without TOS accepted..', async () => {
    await RegistrationPage.usernameField.waitForDisplayed();
    await RegistrationPage.usernameField.setValue(RegistrationPage.validUser);
    await RegistrationPage.emailField.setValue(RegistrationPage.validEmail);
    await RegistrationPage.passwordField.setValue(
      RegistrationPage.validPassword,
    );
    await RegistrationPage.registerButton.click();
    await RegistrationPage.tosNotSelectedError.waitForDisplayed();
    const tosNotSelectedErrorDisplayed = RegistrationPage.tosNotSelectedError.isDisplayed();
    expect(tosNotSelectedErrorDisplayed).toBeTruthy(
      'Terms & Conditions not accepted error did not show up as expected!',
    );
  });

  // Add test for successful registration with captcha bypass and promotions selected - https://gitlab.com/minds/mobile-native/-/issues/4336

  // After All method - logs out of the mobile app.
  // afterAll('Logout the user...', async () => {
  //   await LoginPage.logout();
  //   await LoginPage.loginButton.waitForDisplayed();
  // });
});
