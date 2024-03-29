// @ts-nocheck

class ActionHelper {
  static launchBrowserUrl(urlToLaunch: string) {
    browser.url(urlToLaunch);
  }

  static getTitle() {
    return browser.getTitle();
  }

  static launchApp() {
    return driver.launchApp();
  }

  static goBack() {
    return driver.back();
  }

  static async restartApp() {
    await driver.terminateApp('com.minds.mobile');
    await driver.activateApp('com.minds.mobile');
  }

  static switchToNativeContext() {
    browser.switchContext('NATIVE_APP');
  }

  static pause(seconds: number) {
    // eslint-disable-next-line wdio/no-pause
    return browser.pause(seconds * 1000);
  }

  static isVisible(locator: string) {
    return $(locator).isDisplayed() ? true : false;
  }

  static click(locator) {
    $(locator).click();
  }

  static waitForElement(locator, waitTimeInSeconds) {
    $(locator).waitForDisplayed(waitTimeInSeconds * 1000);
  }

  static clearText(locator) {
    $(locator).clearValue();
  }

  static sendText(locator, inputText) {
    $(locator).addValue(inputText);
  }

  static getText(locator) {
    return $(locator).getText();
  }
}

export default ActionHelper;
