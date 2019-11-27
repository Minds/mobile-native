import sleep from '../src/common/helpers/sleep';
import capturePoster from './actions/capturePoster';
import { waitForElement, waitForAndType, tapElement, waitForAndTap } from './helpers/waitFor';

const deletePost = async () => {
  await waitForAndTap(by.id, 'ActivityMoreButton');
  await waitForAndTap(by.id, 'deleteOption');
  await waitForAndTap(by.text, 'Ok');
  await waitForAndTap(by.text, 'Ok');
}

describe('Comment Flow', () => {
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

  it('should be able to create post and comment', async () => {
    const text = 'e2eTest';
    const commentText = 'commentE2ETest';
    const replyText = 'replyE2ETest';

    // create post
    await waitForAndType(by.id, 'PostInput', text);
    await tapElement(by.id, 'CapturePostButton');

    // wait for newsfeed
    await waitForElement(by.id, 'NewsfeedScreen');

    // add comment
    await waitForAndTap(by.id, 'ActivityCommentButton');
    await waitForAndType(by.id, 'CommentText', commentText);
    await tapElement(by.id, 'PostCommentButton');

    // add reply
    await waitForAndTap(by.id, 'ReplyCommentButton');
    await waitFor(element(by.id('CommentText').withAncestor(by.id('CommentParentView')))).toBeVisible().withTimeout(10000);
    await element(by.id('CommentText').withAncestor(by.id('CommentParentView'))).typeText(replyText);
    await element(by.id('PostCommentButton').withAncestor(by.id('CommentParentView'))).tap();

    // check reply
    await waitFor(element(by.label(`@${process.env.loginUser} ${replyText}`))).toBeVisible().withTimeout(10000);
    
    // finish
    await deletePost();
    
  });

});
