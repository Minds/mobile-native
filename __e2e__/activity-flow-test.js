
import wd from 'wd';
import reporterFactory from '../tests-helpers/browserstack-reporter.factory';
import post from './actions/post';
import login from './actions/login';
import { driver, capabilities} from './config';
import sleep from '../src/common/helpers/sleep';
import pressCapture from './actions/pressCapture';
import acceptPermissions from './actions/acceptPermissions';
import attachPostGalleryImage from './actions/attachPostGalleryImage';
import selectNsfw from './actions/selectNsfw';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
const data = {sessiondID: null};

jasmine.getEnv().addReporter(reporterFactory(data));
//TODO: add support for ios to this test (xpath)

describe('Activity flow tests', () => {
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
    const str = 'My e2e activity';

    // press capture button
    await pressCapture(driver);

    // accept gallery permissions
    await acceptPermissions(driver);

    // make the post
    await post(driver, str);

    // should post and return to the newsfeed
    await driver.waitForElementByAccessibilityId('Newsfeed Screen', wd.asserters.isDisplayed, 10000);

    // the first element of the list should be the post
    const textElement = await driver.waitForElementByXPath('//android.view.ViewGroup[@content-desc="Newsfeed Screen"]/android.view.ViewGroup[1]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.widget.TextView[2]');

    expect(await textElement.text()).toBe(str);
  });

  it('should like the post', async() => {
    const likeButton = await driver.waitForElementByAccessibilityId('Thumb up activity button', 5000);

    await likeButton.click();

    const likeCount = await driver.waitForElementByAccessibilityId('Thumb up count', 5000);

    expect(await likeCount.text()).toBe('1');
  });

  it('should unlike the post', async() => {
    const likeButton = await driver.waitForElementByAccessibilityId('Thumb down activity button', 5000);

    await likeButton.click();

    const likeCount = await driver.waitForElementByAccessibilityId('Thumb down count', 5000);

    expect(await likeCount.text()).toBe('1');
  });
});