// @ts-nocheck
const fs = require('fs');

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

  /**
   * Useful when you can't selectElement and want to check how the element
   * looks like without using AppiumInspector
   */
  static async downloadXMLSource() {
    // Capture a screenshot
    const screenshot = await driver.getPageSource();

    // Save the screenshot to a file
    fs.writeFileSync('screenshot.xml', screenshot);
  }
}

export default ActionHelper;
