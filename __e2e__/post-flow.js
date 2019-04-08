
import wd from 'wd';
import factory from '../tests-helpers/e2e-driver.factory';
import reporterFactory from '../tests-helpers/browserstack-reporter.factory';
import { login } from '../tests-helpers/e2e-utility';

const customCapabilities = {
  'device' : 'Samsung Galaxy S9',
  'os_version' : '8.0'
};

const [driver, capabilities] = factory('browserStack', customCapabilities);
// const [driver, capabilities] = factory('androidLocal', {autoAcceptAlerts: true});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

const data = {sessiondID: null};

jasmine.getEnv().addReporter(reporterFactory(data));

describe('post flow tests', () => {
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

  it('should post', async () => {
    // should open the newsfeed
    const button = await driver.waitForElementByAccessibilityId('CaptureButton', wd.asserters.isDisplayed, 10000);
    button.click();

    // should ask for permissions
    const permmision = await driver.waitForElementById('com.android.packageinstaller:id/permission_allow_button', wd.asserters.isDisplayed, 10000)

    // we accept
    permmision.click();

    // post screen must be shown
    const postInput = await driver.waitForElementByAccessibilityId('PostInput', wd.asserters.isDisplayed, 5000);
    await postInput.type('My e2e post');

    // we press post button
    const postButton = await driver.elementByAccessibilityId('Capture Post Button');
    postButton.click();

    // should post and return to the newsfeed
    await driver.waitForElementByAccessibilityId('Newsfeed Screen', wd.asserters.isDisplayed, 10000);

    // the first element of the list should be the post
    const textElement = await driver.waitForElementByXPath('//android.view.ViewGroup[@content-desc="Newsfeed Screen"]/android.view.ViewGroup[1]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.widget.TextView[2]');

    expect(await textElement.text()).toBe('My e2e post');
  });
});