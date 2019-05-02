
import wd from 'wd';
import reporterFactory from '../tests-helpers/browserstack-reporter.factory';
import { driver, capabilities} from './config';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
const data = {sessiondID: null};
jasmine.getEnv().addReporter(reporterFactory(data));

describe('Login flow', () => {

  let username, password, loginButton;

  beforeAll(async () => {
    await driver.init(capabilities);
    data.sessiondID = await driver.getSessionId();
    console.log('BROWSERSTACK_SESSION: ' + data.sessiondID);
    await driver.waitForElementByAccessibilityId('username input', wd.asserters.isDisplayed, 5000);
  });
  afterAll(async () => {
    await driver.quit();
  });

  it('should shows login error on wrong credentials', async () => {
    expect(await driver.hasElementByAccessibilityId('username input')).toBe(true);
    expect(await driver.hasElementByAccessibilityId('password input')).toBe(true);

    username = await driver.elementByAccessibilityId('username input');

    await username.type('myuser');

    password = await driver.elementByAccessibilityId('password input');
    await password.type('mypass');

    loginButton = await driver.elementByAccessibilityId('login button');
    await loginButton.click();

    // message should appear
    await driver.waitForElementByAccessibilityId('loginMsg', wd.asserters.isDisplayed, 5000);

    const textElement = await driver.elementByAccessibilityId('loginMsg');
    expect(await textElement.text()).toBe('The user credentials were incorrect.');

  });

  it('should go to newsfeed on successful login', async () => {
    // try successfull login
    await username.type(process.env.loginUser);
    await password.type(process.env.loginPass);
    await loginButton.click();

    // should open the newsfeed
    await driver.waitForElementByAccessibilityId('Newsfeed Screen', wd.asserters.isDisplayed, 5000);
  });

  it('should go to login after logout', async () => {

    const menu = await driver.elementByAccessibilityId('Main menu button');
    // tap menu button
    await menu.click();

    const logout = await driver.waitForElementByAccessibilityId('Logout', wd.asserters.isDisplayed, 5000);
    // tap logout
    logout.click();

    await driver.waitForElementByAccessibilityId('username input', wd.asserters.isDisplayed, 5000);
  })
});