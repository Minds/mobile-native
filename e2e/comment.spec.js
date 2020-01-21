import sleep from '../src/common/helpers/sleep';

import { waitForElement, waitForAndType, tapElement, waitForAndTap } from './helpers/waitFor';
import { capturePoster, deletePost } from './actions/capturePoster';

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
    await waitForAndType(by.id('PostInput'), text);
    await tapElement(by.id('CapturePostButton'));

    // wait for newsfeed
    await waitForElement(by.id('NewsfeedScreen'));

    // add comment
    await waitForAndTap(by.id('ActivityCommentButton'));
    await waitForAndType(by.id('CommentText'), commentText);
    await tapElement(by.id('PostCommentButton'));

    // add reply
    await waitForAndTap(by.id('ReplyCommentButton'));
    await waitForAndType(by.id('CommentText').withAncestor(by.id('CommentParentView')), replyText);
    await tapElement(by.id('PostCommentButton').withAncestor(by.id('CommentParentView')));

    // check reply
    await waitForElement(by.label(`@${process.env.loginUser} ${replyText}`));
    
    // finish
    await deletePost();
    
  });

});
