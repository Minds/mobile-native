
import wd from 'wd';
import reporterFactory from '../tests-helpers/browserstack-reporter.factory';
import login from './actions/login';
import { driver, capabilities} from './config';
import sleep from '../src/common/helpers/sleep';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
const data = {sessiondID: null};

jasmine.getEnv().addReporter(reporterFactory(data));
//TODO: add support for ios to this test (xpath)

describe('Top-bar tests', () => {

  beforeAll(async () => {
    await driver.init(capabilities);
    data.sessiondID = await driver.getSessionId();
    console.log('BROWSERSTACK_SESSION: ' + data.sessiondID);
    await driver.waitForElementByAccessibilityId('username input', wd.asserters.isDisplayed, 5000);
    // we should login
    await login(driver);
  });

  afterAll(async () => {
    await driver.quit();
  });

  it('should open the boost console', async () => {
    const button = await driver.waitForElementByAccessibilityId('boost-console button', wd.asserters.isDisplayed, 7000);
    await button.click();
    const textElement = await driver.waitForElementByXPath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup[2]/android.widget.TextView');

    expect(await textElement.text()).toBe('Boost Console');

    const back = await driver.waitForElementByXPath('//android.widget.Button[@content-desc="Go back"]/android.view.ViewGroup/android.widget.ImageView');
    back.click();
  });

  it('should open the users profile on clicking the profile avatar', async () => {
    const button = await driver.waitForElementByAccessibilityId('topbar avatar button', wd.asserters.isDisplayed, 5000);
    await button.click();
    await driver.waitForElementByXPath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup[3]/android.widget.ImageView');

    const back = await driver.waitForElementByXPath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup[2]/android.widget.TextView');    back.click();
  });

  it('should open the menu when clicking the hamburger menu', async () => {
    const button = await driver.waitForElementByAccessibilityId('Main menu button', wd.asserters.isDisplayed, 5000);
    await button.click();
    const logoutButton = await driver.waitForElementByXPath('//android.view.ViewGroup[@content-desc="Logout"]/android.widget.TextView[2]');
    expect(await logoutButton.text()).toBe('Logout');

    const back = await driver.waitForElementByXPath('//android.widget.Button[@content-desc="Go back"]/android.view.ViewGroup/android.widget.ImageView');
    back.click();
  });

});
