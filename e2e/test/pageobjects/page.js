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
  get menuButton() {
    return this.selectElement('id', 'Messenger tab button');
  }
  get multiUserButton() {
    return this.selectElement('id', 'multiUserIcon');
  }
  get userDropdownButton() {
    return this.selectElement('id', 'userDropdownMenu');
  }
  get logoutButton() {
    return this.selectElement('text', 'Logout');
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
  }

  async logout() {
    await this.menuButton.waitForDisplayed();
    await this.menuButton.click();
    await this.multiUserButton.waitForDisplayed();
    await this.multiUserButton.click();
    await this.userDropdownButton.waitForDisplayed();
    await this.userDropdownButton.click();
    await this.logoutButton.waitForDisplayed();
    await this.logoutButton.click();
  }
}
