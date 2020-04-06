import deleteUser from './helpers/deleteUser';
import sleep from '../src/common/helpers/sleep';
import { waitForElement, waitForAndTap, waitForAndType } from './helpers/waitFor';

// eslint-disable-next-line jest/no-disabled-tests
describe('Register Flow', () => {
  const username = 'e2euser' + ((Math.random() * 0xffffff) << 0).toString(16);
  const password = process.env.loginPass;
  beforeEach(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: {
        notifications: 'YES',
        photos: 'YES',
      },
    });
  });

  afterAll(async () => {
    await deleteUser(username, password);
  });

  it('should register correctly', async () => {
    console.log('registering', username);

    // login shoulf be visible
    await waitForElement(by.id('usernameInput'));

    await waitForAndTap(by.id('registerButton'));

    // fill the form
    waitForAndType(by.id('registerUsernameInput'), username + "\n");
    waitForAndType(by.id('registerEmailInput'), 'mye2e@minds.com' + "\n");
    waitForAndType(by.id('registerPasswordInput'), password + "\n");
    waitForAndType(by.id('registerPasswordConfirmInput'), password + "\n");

    // accept terms
    const checkbox = await element(by.id('checkbox')).atIndex(0);

    await waitForAndTap(by.id('checkbox'));

    // press register
    const registerButton = await element(by.id('registerCreateButton'));
    await registerButton.tap();
    //await registerButton.tap();

    // is the onboarding visible? (in new onboarding this is welcome step)
    await waitFor(element(by.id('artTestID')))
      .toBeVisible()
      .withTimeout(5000);

    // move from welcome to hashtag
    await element(by.id('wizardNext')).tap();

    // select art hashtag
    await element(by.id('artTestID')).tap();

    // move to next step
    await element(by.id('wizardNext')).tap();

    // wait for the channel setup
    await waitFor(element(by.id('selectAvatar')))
      .toBeVisible()
      .withTimeout(10000);

    await waitFor(element(by.id('RewardsOnboarding')))
      .toBeVisible()
      .withTimeout(10000);

    // tap the select avatar button
    //await element(by.id('selectAvatar')).tap();

    //await sleep(3000);

    // move to next step
    await element(by.id('wizardNext')).tap();

    // DISABLED wait for the suggested groups list
    /*await waitFor(element(by.id('suggestedGroup0')))
      .toBeVisible()
      .withTimeout(10000);

    // subscribe to the first user of the list
    await element(by.id('suggestedGroup0')).tap();*/

    // move to next step
    //await element(by.id('wizardNext')).tap();

    // wait for the suggested users list
    /* DISABLEDawait waitFor(element(by.id('suggestedUser0SubscriptionButton')))
      .toBeVisible()
      .withTimeout(10000);

    // subscribe to the first user of the list
    await element(by.id('suggestedUser0SubscriptionButton')).tap();*/

    // move to next step
    //await element(by.id('wizardNext')).tap();

    // newsfeed should be visible
    await waitFor(element(by.id('NewsfeedScreen')))
      .toBeVisible()
      .withTimeout(10000);
  });
});
