/* eslint-env detox/detox, jest */
import {
  waitForElement,
  waitForAndType,
  tapElement,
  waitForAndTap,
} from './helpers/waitFor';
import login from './actions/login';
import { deletePost, capturePoster } from './actions/capturePoster';

describe('Post Flow', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: {
        notifications: 'YES',
        camera: 'YES',
        medialibrary: 'YES',
        photos: 'YES',
        microphone: 'YES',
      },
      launchArgs: {
        detoxURLBlacklistRegex:
          // eslint-disable-next-line prettier/prettier
          '("https://cdn.minds.com/fs/v1/thumbnail/*/*/"), ("https://sockjs-ap2.pusher.com:443/pusher/app/*")',
      },
    });
    await login(process.env.loginUser, process.env.loginPass);
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await capturePoster();
  });

  it('should be able to create a text only post', async () => {
    const text = 'e2eTest';
    await waitForAndTap(by.id('CaptureTextButton'));
    await waitForAndType(by.id('PostInput'), text);
    await tapElement(by.id('topBarDone'));

    await scrollToPost();

    await deletePost();
  });

  it('should be able to set nsfw to a post', async () => {
    await tapElement(by.id('postOptions'));
    await tapElement(by.id('nsfwButton'));
    await waitForAndTap(by.text('Nudity'));
    await tapElement(by.id('topBarDone'));
    await waitForElement(by.text('Not Safe'));
    await waitForAndTap(by.text('Close'));
    await tapElement(by.id('topbarBack'));
    await tapElement(by.id('floatingBackButton'));
  });

  it('should be able to create a text and image post', async () => {
    const text = 'e2eTest';
    await waitForAndTap(by.id('CaptureTextButton'));
    await waitForAndType(by.id('PostInput'), text);
    await tapElement(by.id('attachImage'));
    await waitFor(element(by.id('topBarDone')))
      .toBeVisible()
      .withTimeout(120000);
    await tapElement(by.id('topBarDone'));
    await scrollToPost();
    await deletePost();
  });

  it('should be able to cancel image upload and then post', async () => {
    await tapElement(by.id('attachImage'));
    await waitForAndTap(by.id('AttachmentDeleteButton'));
  });
});

async function scrollToPost() {
  // scroll up so we have visibility of the created post
  await waitFor(element(by.id('ActivityMoreButton')))
    .toBeVisible()
    .whileElement(by.id('feedlistCMP'))
    .scroll(100, 'up');
}
