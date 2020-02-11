import deleteUser from './helpers/deleteUser';
import sleep from '../src/common/helpers/sleep';

describe.skip('Register Flow', () => {
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
    await waitFor(element(by.id('usernameInput')))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id('registerButton')).tap();

    // email filed should be visible
    await waitFor(element(by.id('registerEmailInput')))
      .toBeVisible()
      .withTimeout(2000);

    // disable sync to prevent long waits for animations
    await device.disableSynchronization();

    // accept terms
    await element(by.id('checkbox')).atIndex(0).tapAtPoint({x:30, y:30});

    // fill the form
    await element(by.id('registerUsernameInput')).typeText(username);
    await element(by.id('registerEmailInput')).typeText('mye2e@minds.com');
    await element(by.id('registerPasswordInput')).typeText(password);
    await element(by.id('registerPasswordConfirmInput')).typeText(password);

    // press register
    const registerButton = await element(by.id('registerCreateButton'));
    await registerButton.tap();
    await registerButton.tap();

    await device.enableSynchronization();

    // is the onboarding visible?
    await waitFor(element(by.id('artTestID')))
      .toBeVisible()
      .withTimeout(5000);

    // select art hashtag
    await element(by.id('artTestID')).tap();

    // move to next step
    await element(by.id('wizardNext')).tap();

    // wait for the suggested users list
    await waitFor(element(by.id('suggestedUser0SubscriptionButton')))
      .toBeVisible()
      .withTimeout(10000);

    // subscribe to the first user of the list
    await element(by.id('suggestedUser0SubscriptionButton')).tap();

    // move to next step
    await element(by.id('wizardNext')).tap();

    // wait for the channel setup
    await waitFor(element(by.id('selectAvatar')))
      .toBeVisible()
      .withTimeout(10000);

    // tap the select avatar button
    await element(by.id('selectAvatar')).tap();

    await sleep(3000);

    // move to next step
    await element(by.id('wizardNext')).tap();

     // wait for the channel setup
    await waitFor(element(by.id('RewardsOnboarding')))
      .toBeVisible()
      .withTimeout(10000);

    // move to next step
    await element(by.id('wizardNext')).tap();

    // newsfeed should be visible
    await waitFor(element(by.id('NewsfeedScreen')))
      .toBeVisible()
      .withTimeout(10000);
  });

});
