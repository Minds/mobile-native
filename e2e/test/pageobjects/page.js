/* eslint-disable no-undef */
export default class Page {
  /**
   * define elements
   */
  get maxTimeout() {
    return 30000;
  }
  get loginButton() {
    return this.selectElement('text', 'Login');
  }
  get usernameField() {
    return this.selectElement('id', 'usernameInput');
  }
  get passwordField() {
    return this.selectElement('id', 'userPasswordInput');
  }
  get loginButtonAfterCredentials() {
    return this.selectElement('id', 'loginButton');
  }
  get homeButton() {
    return this.selectElement('id', 'Menu tab button');
  }
  /**
   * define or overwrite page methods
   */
  open(path) {
    browser.url(path);
  }

  selectElement(type, text) {
    if (browser.isAndroid && type === 'id') {
      const selector = 'new UiSelector().resourceId("' + text + '")';
      return $(`android=${selector}`);
    } else if (browser.isAndroid && type === 'text') {
      const selector =
        'new UiSelector().text("' +
        text +
        '").className("android.widget.TextView")';
      return $(`android=${selector}`);
    } else {
      return $(`~${text}`);
    }
  }

  async login(username, password) {
    await this.loginButton.waitForDisplayed();
    await this.loginButton.click();
    await this.usernameField.waitForDisplayed();
    await this.usernameField.setValue(username);
    await this.passwordField.waitForDisplayed();
    await this.passwordField.setValue(password);
    await this.loginButtonAfterCredentials.click();
    await this.homeButton.waitForDisplayed({ timeout: this.maxTimeout });
  }

  logout() {
    // Logout function to be defined.
  }
}
