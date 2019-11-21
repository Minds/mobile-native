import sleep from '../src/common/helpers/sleep';
import capturePoster from './actions/capturePoster';

describe('Login Flow', () => {
  beforeEach(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: {
        notifications: 'YES',
        camera: 'YES',
        medialibrary: 'YES',
        photos: 'YES',
      },
    });
    await capturePoster();
  });

  it('should be able to create a text only post', async () => {
    const text = 'e2eTest';
    await expect(element(by.id('PostInput'))).toBeVisible();
    await element(by.id('PostInput')).typeText(text);
    await element(by.id('CapturePostButton')).tap();
    await waitFor(element(by.id('ActivityMoreButton'))).toBeVisible().withTimeout(5000);
    //await element(by.id('ActivityMoreButton')).tap();
  });
});
