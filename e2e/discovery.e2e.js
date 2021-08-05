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
  /*beforeAll(async () => {
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
          '("https:\/\/cdn.minds.com\/fs\/v1\/thumbnail\/*\/*\/"), ("https:\/\/sockjs-ap2.pusher.com:443\/pusher\/app\/**")',
      },
    });
    await login(process.env.loginUser, process.env.loginPass);
  });*/

  beforeEach(async () => {
    await device.reloadReactNative();
    await waitForAndTap(by.id('userAvatar'));
    await waitForAndTap(by.id('discovery'));
  });

  it('should be able to create a text only post', async () => {
    await waitForAndTap(by.id('customizeBtn'));
  });
});
