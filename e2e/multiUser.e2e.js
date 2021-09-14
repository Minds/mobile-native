/* eslint-env detox/detox, jest */
import { expect } from 'detox';
import login from './actions/login';
import { tapElement, waitForAndTap, waitForElement } from './helpers/waitFor';

describe('Multi User Login Flow', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should login two differents users successfully', async () => {
    // login user #1
    await waitFor(element(by.id('usernameInput')))
      .toBeVisible()
      .withTimeout(10000);

    await login(process.env.loginUser, process.env.loginPass);

    await waitForAndTap(by.id('topbarAvatar'));

    await waitForElement(by.id('channelUsername'));
    await expect(element(by.id('channelUsername'))).toHaveText(
      `@${process.env.loginUser}`,
    );

    await tapElement(by.id('multiUserIcon'));
    await waitForElement(by.id(`username${process.env.loginUser}`));
    await tapElement(by.id('multiUserLogin'));

    // login user #2
    await waitFor(element(by.id('usernameInput')))
      .toBeVisible()
      .withTimeout(10000);

    await login(process.env.loginUser2, process.env.loginPass);

    await waitForAndTap(by.id('topbarAvatar'));

    await waitForElement(by.id('channelUsername'));
    await expect(element(by.id('channelUsername'))).toHaveText(
      `@${process.env.loginUser2}`,
    );

    // the two users should be listed...
    await tapElement(by.id('multiUserIcon'));
    await expect(element(by.id(`username${process.env.loginUser}`))).toHaveText(
      `@${process.env.loginUser}`,
    );
    await expect(
      element(by.id(`username${process.env.loginUser2}`)),
    ).toHaveText(`@${process.env.loginUser2}`);
  });
});
