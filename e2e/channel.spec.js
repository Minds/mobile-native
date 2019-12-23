import { waitForElement, waitForAndType, tapElement, waitForAndTap } from './helpers/waitFor';
import { deletePost } from './actions/capturePoster';
import login from './actions/login';

/**
 * Uses process.env.userDisplayName:
 * export userDisplayName="Something Something"
 */
describe('Channel Flow', () => {
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
    await waitForElement(by.id('usernameInput'));
    await login(process.env.loginUser, process.env.loginPass);
    await waitForAndTap(by.id('AvatarButton'));
  });

  it('channel header should be render correctly', async () => {
    const beVisible = true;
    await waitForElement(by.id('SubscribersView'));
    await waitForElement(by.id('ViewsView'));
    await waitForElement(by.id('ChannelNameView'));
    await waitForElement(by.id('SubscribeButton'), !beVisible);
    await waitForElement(by.id('SendMessageButton'), !beVisible);
    await waitForElement(by.id('EditButton'));
    await waitForElement(by.id('WireButton'), !beVisible);
    await waitForElement(by.id('MoreButton'), !beVisible);
  });

  it('should be able to change display name', async () => {
    const displayNameTest = "New Display Name";
    const replaceText = true;

    // new display name
    await waitForAndTap(by.id('EditButton'));
    await waitForAndType(by.id('ChannelNameTextInput'), displayNameTest, replaceText);
    await tapElement(by.id('EditButton'));
    await waitForElement(by.id('ChannelNameView'));

    // display name back to normal
    await waitForAndTap(by.id('EditButton'));
    await waitForAndType(by.id('ChannelNameTextInput'), process.env.userDisplayName, replaceText);
    await tapElement(by.id('EditButton'));
    await waitForElement(by.id('ChannelNameView'));
  });

  it('should be able to create a post', async () => {
    const text = 'e2eTest';

    await waitForAndTap(by.id('captureFab'));

    // create post
    await waitForAndType(by.id('PostInput'), text);
    await tapElement(by.id('CapturePostButton'));

    // wait for channelscreen
    await waitForElement(by.id('ChannelScreen'));
    
    await deletePost();

  });

  it('should be move between tabs', async () => {
    // wait for channelscreen
    await waitForElement(by.id('ChannelScreen'));

    await tapElement(by.id('ImagesButton'));

    await tapElement(by.id('VideosButton'));

    await tapElement(by.id('BlogsButton'));

    await tapElement(by.id('FeedButton'));

  });

});
