
import wd from 'wd';
import reporterFactory from '../tests-helpers/browserstack-reporter.factory';
import post from './actions/post';
import login from './actions/login';
import { driver, capabilities} from './config';
import sleep from '../src/common/helpers/sleep';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
const data = {sessiondID: null};

jasmine.getEnv().addReporter(reporterFactory(data));
//TODO: add support for ios to this test (xpath)

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

  it('should post a text and see it in the newsfeed', async () => {
    const str = 'My e2e post #mye2epost';

    // make the post
    await post(driver, str);

    // should post and return to the newsfeed
    await driver.waitForElementByAccessibilityId('Newsfeed Screen', wd.asserters.isDisplayed, 10000);

    // the first element of the list should be the post
    const textElement = await driver.waitForElementByXPath('//android.view.ViewGroup[@content-desc="Newsfeed Screen"]/android.view.ViewGroup[1]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.widget.TextView[2]');

    expect(await textElement.text()).toBe(str);
  });

  it('should post an image and see it in the newsfeed', async () => {
    const str = 'My e2e post image #mye2epostimage';

    // make the post with image and no permissions wait
    await post(driver, str, true, false);

    // should post and return to the newsfeed
    await driver.waitForElementByAccessibilityId('Newsfeed Screen', wd.asserters.isDisplayed, 10000);

    // the first element of the list should be the post
    const textElement = await driver.waitForElementByXPath('//android.view.ViewGroup[@content-desc="Newsfeed Screen"]/android.view.ViewGroup[1]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.widget.TextView[2]');

    expect(await textElement.text()).toBe(str);
  });

  it('should upload an image and cancel it', async () => {
    // tap the post button
    const button = await driver.waitForElementByAccessibilityId('CaptureButton', wd.asserters.isDisplayed, 10000);
    button.click();

    // post screen must be shown
    const postInput = await driver.waitForElementByAccessibilityId('PostInput', wd.asserters.isDisplayed, 5000);
    await postInput.type('My e2e image post');

    const firstImage = await driver.waitForElementByAccessibilityId('Gallery Image 0', wd.asserters.isDisplayed, 5000);
    await firstImage.click();

    await sleep(5000);

    // we press post button
    const deleteButton = await driver.elementByAccessibilityId('Attachment Delete Button');
    await deleteButton.click();

    await sleep(1000);

    // should fail to find the delete button
    return expect(driver.elementByAccessibilityId('Attachment Delete Button')).rejects.toHaveProperty('status', 7);
  });

  it('should return to the newsfeed', async () => {
    // tap the post button
    await driver.back();

    // should open the newsfeed
    await driver.waitForElementByAccessibilityId('Newsfeed Screen', wd.asserters.isDisplayed, 5000);
  });
});