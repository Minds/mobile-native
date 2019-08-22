import wd from 'wd';
import reporterFactory from '../tests-helpers/browserstack-reporter.factory';
import { driver, capabilities} from './config';
import post from './actions/post';
import login from './actions/login';
import sleep from '../src/common/helpers/sleep';
import pressCapture from './actions/pressCapture';
import acceptPermissions from './actions/acceptPermissions';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
const data = {sessiondID: null};
jasmine.getEnv().addReporter(reporterFactory(data));

describe('Discovery post edit flow', () => {
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

  it('should post a text and go to discovery', async () => {
    const str = 'My e2e post #mye2epost';

    await pressCapture(driver);

    await acceptPermissions(driver);

    // make the post
    await post(driver, str);

    // move to discovery
    const discoveryTab = await driver.waitForElementByAccessibilityId('Discovery tab button', wd.asserters.isDisplayed, 10000);
    await discoveryTab.click();
  });

  it('should search for the post', async () => {

    // select all list
    const all = await driver.waitForElementByAccessibilityId('Discovery All', wd.asserters.isDisplayed, 5000);
    await all.click();

    await sleep(500);

    // select latest filter
    const latest = await driver.waitForElementByAccessibilityId('Filter latest button', wd.asserters.isDisplayed, 1000);
    await latest.click();

    await sleep(500);

    // search the post
    const search = await driver.waitForElementByAccessibilityId('Discovery Search Input', wd.asserters.isDisplayed, 10000);
    await search.type('mye2epost');

    await sleep(4000);

    // activity menu button
    const activityMenu = await driver.waitForElementByAccessibilityId('Activity Menu button', wd.asserters.isDisplayed, 5000);
    await activityMenu.click();

    await sleep(500);

    // tap edit
    const edit = await driver.waitForElementByAndroidUIAutomator('new UiSelector().text("Edit")', wd.asserters.isDisplayed, 5000);
    await edit.click();

    // change the text
    const editorInput = await driver.waitForElementByAccessibilityId('Post editor input', wd.asserters.isDisplayed, 5000);
    await editorInput.type(' edited!');

    // tap save
    const save = await driver.waitForElementByAccessibilityId('Post editor save button', wd.asserters.isDisplayed, 5000);
    await save.click();

    // confirm activity text changed
    await driver.waitForElementByAndroidUIAutomator('new UiSelector().text("My e2e post #mye2epost edited!")', wd.asserters.isDisplayed, 5000);
  });
});