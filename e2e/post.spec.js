import sleep from '../src/common/helpers/sleep';
import { waitForElement, waitForAndType, tapElement, waitForAndTap } from './helpers/waitFor';
import { deletePost, capturePoster } from './actions/capturePoster';

describe('Post Flow', () => {
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

    // create post
    await waitForAndType(by.id('PostInput'), text);
    await tapElement(by.id('CapturePostButton'));

    // wait for newsfeed
    await waitForElement(by.id('NewsfeedScreen'));
    
    await deletePost();
    
  });

  it('should be able to create a nsfw post with text', async () => {
    const text = 'e2eTest';

    // create post
    await waitForAndType(by.id('PostInput'), text);
    await tapElement(by.id('NsfwToggle'));
    await tapElement(by.id('NsfwToggle'));
    await waitForAndTap(by.id('NsfwReasonNudity'));
    await tapElement(by.id('NsfwToggle'));
    await tapElement(by.id('CapturePostButton'));

    // wait for newsfeed
    await waitForElement(by.id('NewsfeedScreen'));
    
    await deletePost();
    
  });

  it('should be able to create a text and image post', async () => {
    const text = 'e2eTest';

    // create post
    await waitForAndType(by.id('PostInput'), text);
    await tapElement(by.id('GalleryImage0'));
    await tapElement(by.id('GalleryImage0'));

    await waitFor(element(by.id('CapturePostButton'))).toBeVisible().withTimeout(120000);
    await tapElement(by.id('CapturePostButton'));

    // wait for newsfeed
    await waitForElement(by.id('NewsfeedScreen'));
    
    await deletePost();
    
  });

  it('should be able to cancel image upload and then post', async () => {
    const text = 'e2eTest';

    // create post
    await waitForAndType(by.id('PostInput'), text);
    await tapElement(by.id('GalleryImage0'));
    await tapElement(by.id('GalleryImage0'));

    await waitForAndTap(by.id('AttachmentDeleteButton'));
    await tapElement(by.id('CapturePostButton'));

    // wait for newsfeed
    await waitForElement(by.id('NewsfeedScreen'));
    
    await deletePost();
    
  });


});
