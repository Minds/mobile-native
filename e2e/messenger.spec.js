import sleep from '../src/common/helpers/sleep';
import { waitForElement, waitForAndType, tapElement, waitForAndTap } from './helpers/waitFor';
import login from './actions/login';

describe('Messenger Flow', () => {
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
    await waitFor(element(by.id('usernameInput'))).toBeVisible().withTimeout(5000);
    await login(process.env.loginUser, process.env.loginPass);
    await expect(element(by.id('NewsfeedScreen'))).toBeVisible();
  });

  it('should be able to open messenger, unblock and send message', async () => {
    const userName = 'JUANMSOLARO_TEST5';
    const messageText = 'This is an auto generated message for testing purpose';
    
    // wait for newsfeed
    await waitForElement(by.id('NewsfeedScreen'));
    await tapElement(by.id('MessengerTabButton'));
    await waitForAndType(by.id('MessengerContactText'), userName);
    await waitForAndTap(by.id(userName));
    await tapElement(by.id(userName));
    await waitForAndType(by.id('MessengerSetupText'), process.env.messengerpass);
    await tapElement(by.id('NavNextButton'));
    await waitForAndType(by.id('ConversationTextInput'), messageText);
    await tapElement(by.id('ConversationSendButton'));
    await waitForElement(by.label(messageText));
  });

});
