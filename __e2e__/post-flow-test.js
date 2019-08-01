
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
import lockPost from './actions/lockPost';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
const data = {sessiondID: null};

jasmine.getEnv().addReporter(reporterFactory(data));
//TODO: add support for ios to this test (xpath)

describe('Post flow tests', () => {
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

  it('should remind the previuos post and see it in the newsfeed', async () => {
    const str = 'Reminding my own post';

    const remindButton = await driver.waitForElementByAccessibilityId('Remind activity button', 5000);

    // tap remind
    await remindButton.click();

    // make the post
    await post(driver, str);

    // should post and return to the newsfeed
    await driver.waitForElementByAccessibilityId('Newsfeed Screen', wd.asserters.isDisplayed, 10000);

    // the first element of the list should be the post
    const textElement = await driver.waitForElementByXPath('//android.view.ViewGroup[@content-desc="Newsfeed Screen"]/android.view.ViewGroup[1]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.widget.TextView[2]');

    expect(await textElement.text()).toBe(str);
  });

  it('should post a nsfw and see it in the newsfeed', async () => {
    const str = 'My e2e post #mye2epost';

    // press capture button
    await pressCapture(driver);

    // select nsfw
    await selectNsfw(driver, ['Nudity', 'Pornography']);

    // make the post
    await post(driver, str);

    // should post and return to the newsfeed
    await driver.waitForElementByAccessibilityId('Newsfeed Screen', wd.asserters.isDisplayed, 10000);

    // the first element of the list should be the post
    const textElement = await driver.waitForElementByXPath('//android.view.ViewGroup[@content-desc="Newsfeed Screen"]/android.view.ViewGroup[1]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.widget.TextView[2]');

    expect(await textElement.text()).toBe(str);
  });

  it('should post paywalled content', async () => {
    // press capture button
    await pressCapture(driver);

    // deselect nsfw
    await selectNsfw(driver, ['Nudity', 'Pornography']);

    const str = 'pay me something';

    await lockPost(driver, '1');

    // make the post with image and no permissions wait
    await post(driver, str);

    await sleep(1000);

    const textElement = await driver.waitForElementByXPath('//android.view.ViewGroup[@content-desc="Newsfeed Screen"]/android.view.ViewGroup[1]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.widget.TextView[3]');

    expect(await textElement.text()).toBe('Locked');
  });

  it('should post an image and see it in the newsfeed', async () => {
    const str = 'My e2e post image #mye2epostimage';

    // press capture button
    await pressCapture(driver);

    // attach image
    await attachPostGalleryImage(driver);

    // make the post with image and no permissions wait
    await post(driver, str);

    // should post and return to the newsfeed
    await driver.waitForElementByAccessibilityId('Newsfeed Screen', wd.asserters.isDisplayed, 10000);

    // the first element of the list should be the post
    const textElement = await driver.waitForElementByXPath('//android.view.ViewGroup[@content-desc="Newsfeed Screen"]/android.view.ViewGroup[1]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.widget.TextView[2]');

    expect(await textElement.text()).toBe(str);
  });

  it('should open the images in full screen after tap', async () => {
    // get the Image touchable
    const imageButton = await driver.waitForElementByAccessibilityId('Posted Image', wd.asserters.isDisplayed, 10000);
    await imageButton.click();
    const image = await driver.waitForElementByXPath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ImageView');

    const goBack = await driver.waitForElementByAccessibilityId('Go back button', wd.asserters.isDisplayed, 10000);
    await goBack.click();
  });

  it('should upload an image and cancel it', async () => {
    // press capture button
    await pressCapture(driver);

    // attach image
    await attachPostGalleryImage(driver);

    await sleep(5000);

    // we press post button
    const deleteButton = await driver.elementByAccessibilityId('Attachment Delete Button');
    await deleteButton.click();

    await sleep(1000);

    // should fail to find the delete button
    return expect(driver.elementByAccessibilityId('Attachment Delete Button')).rejects.toHaveProperty('status', 7);
  });

  it('should return to the newsfeed', async () => {
    // tap the back button
    await driver.back();

    // should open the newsfeed
    await driver.waitForElementByAccessibilityId('Newsfeed Screen', wd.asserters.isDisplayed, 5000);
  });
});