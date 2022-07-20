/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';

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
    return this.selectElement('id', 'usernameLoginInput');
  }
  get passwordField() {
    return this.selectElement('id', 'userPasswordInput');
  }
  get captchaInput() {
    return this.selectElement('id', 'captcha');
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

  async completeCaptcha() {
    const sharedKey = process.env.SHARED_KEY;
    const captcha = Date.now();
    const token = jwt.sign({ data: captcha }, sharedKey, {
      expiresIn: '5m',
    });

    await this.captchaInput.waitForDisplayed();
    await this.captchaInput.setValue(captcha);

    browser.setCookies({ name: 'captcha_bypass', value: token });
  }

  async bypassFriendlyCaptcha() {
    const sharedKey = process.env.SHARED_KEY;
    const captcha = 'friendly_captcha_bypass';
    const token = jwt.sign({ data: captcha }, sharedKey, {
      expiresIn: '5m',
    });
    browser.setCookies({ name: 'captcha_bypass', value: token });
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
