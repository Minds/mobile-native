import sleep from '../src/common/helpers/sleep';
import capturePoster from './actions/capturePoster';
import { waitForElement, waitForAndType, tapElement, waitForAndTap } from './helpers/waitFor';

const deletePost = async () => {
  await waitForAndTap(by.id, 'ActivityMoreButton');
  await waitForAndTap(by.id, 'deleteOption');
  await waitForAndTap(by.text, 'Ok');
  await waitForAndTap(by.text, 'Ok');
}

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
    await waitForAndType(by.id, 'PostInput', text);
    await tapElement(by.id, 'CapturePostButton');

    // wait for newsfeed
    await waitForElement(by.id, 'NewsfeedScreen');
    
    await deletePost();
    
  });
});
