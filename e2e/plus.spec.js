import login from './actions/login';
import { capturePoster } from './actions/capturePoster';
import { waitForAndTap, waitForAndType } from './helpers/waitFor';

const done = () => {
  await waitForAndTap(by.id('topBarDone'));
  await waitForAndTap(by.id('topBarDone'));
  await waitForAndTap(by.id('topBarDone'));
};

describe('Login Flow', () => {
  beforeEach(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: {
        notifications: 'YES',
      },
    });
    await login(process.env.loginUser, process.env.loginPass);
    await capturePoster();
    await waitForAndType(by.id('PostInput'), 'e2eTest');
    await waitForAndTap(by.id('postOptionsButton'));
    await waitForAndTap(by.id('monetizeButton'));
  });

  it('should create a plus post', async () => {
    await waitForAndTap(by.id('monetizePlus'));
    await element(by.id('checkbox')).tapAtPoint({ x: 0, y: 0 });
    done();
  });

  it('should create a Membership post', async () => {
    await waitForAndTap(by.id('monetizeMemberships'));
    await waitForAndTap(by.id('membership'));
    done();
  });

  it('should create a Custom post', async () => {
    await waitForAndTap(by.id('monetizeCustom'));
    await waitForAndTap(by.id('enablePaywall'));
    await waitForAndType(by.id('tokensInput'), '1');
    done();
  });
});
