/* eslint-env detox/detox, jest */
import detox, { expect } from 'detox';
import { capturePoster } from './actions/capturePoster';
import login from './actions/login';
import { tapElement, waitForAndTap, waitForAndType } from './helpers/waitFor';

describe('Comment Flow', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await login(process.env.loginUser, process.env.loginPass);
  });

  it('should be able to comment on a post', async () => {
    await capturePoster();
    const text = 'e2eTest';
    await waitForAndTap(by.id('CaptureTextButton'));
    await waitForAndType(by.id('PostInput'), text);
    await tapElement(by.id('topBarDone'));
    await device.disableSynchronization();
    await waitForAndTap(by.id('ActivityCommentButton'));
    await waitForAndType(by.id('CommentTextInput'), text);
    await tapElement(by.id('PostCommentButton'));
  });
});
