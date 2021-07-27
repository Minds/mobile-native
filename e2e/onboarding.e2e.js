/* eslint-env detox/detox, jest */
import { waitForElement } from './helpers/waitFor';

import login from './actions/login';

describe('Onboarding Flow', () => {
  const username = process.env.loginUser;
  const password = process.env.loginPass;

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
          '("https://cdn.minds.com/fs/v1/thumbnail/*/*/")',
      },
    });
    await login(username, password);
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should set up channel', async () => {
    await waitForElement(by.id('startOnboarding'));
  });
});
