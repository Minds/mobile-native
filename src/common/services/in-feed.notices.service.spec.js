import { InFeedNoticesService } from './in-feed.notices.service';
import { when } from 'mobx';
import { storagesService } from './storage/storages.service';
import { sessionService } from './session.service';
import apiService from './api.service';

jest.mock('./storage/storages.service');
jest.mock('./session.service');
jest.mock('./api.service');

apiService.get.mockResolvedValue({
  status: 'success',
  notices: [
    { key: 'verify-email', location: 'top', should_show: false },
    { key: 'build-your-algorithm', location: 'inline', should_show: true },
    { key: 'invite-friends', location: 'inline', should_show: true },
  ],
});

describe('InFeedNoticesService', () => {
  let onLoginCB, onLogoutCB;

  sessionService.onLogin.mockImplementation(onLogin => {
    console.log('onLogin', onLogin);
    onLoginCB = onLogin;
  });
  sessionService.onLogout.mockImplementation(onLogout => {
    console.log('onLogout', onLogout);
    onLogoutCB = onLogout;
  });

  /**
   * Prepare tests
   */
  beforeEach(() => {
    onLoginCB = null;
    onLogoutCB = null;
    storagesService.user?.getObject.mockClear();
    storagesService.user?.getObject
      .mockReturnValueOnce([
        { key: 'verify-email', location: 'top', should_show: true },
        { key: 'build-your-algorithm', location: 'inline', should_show: false },
      ])
      .mockReturnValueOnce(null);
  });
  test('service instantiation', () => {
    const service = new InFeedNoticesService();
    expect(service).toBeInstanceOf(InFeedNoticesService);
  });
  test('service initialization onLogin and clean-up onLogout', async () => {
    const service = new InFeedNoticesService();
    const init = jest.spyOn(service, 'init');

    service.init();

    await onLoginCB();

    // init called
    expect(init).toHaveBeenCalled();
    expect(storagesService.user?.getObject).toHaveBeenCalled();

    // formatted data
    expect(service.data).toEqual([
      { key: 'verify-email', location: 'top', should_show: false },
      { key: 'build-your-algorithm', location: 'inline', should_show: true },
      { key: 'invite-friends', location: 'inline', should_show: true },
    ]);

    onLogoutCB();

    expect(service.data).toBeNull();
  });

  test('service visible method', async () => {
    const service = new InFeedNoticesService();
    service.init();

    await onLoginCB();

    // formatted data
    expect(service.visible('verify-email')).toBeFalsy();
    expect(service.visible('build-your-algorithm')).toBeTruthy();
  });

  // test('service visible method observability', async () => {
  //   const service = new InFeedNoticesService();

  //   // false, not initialized
  //   expect(service.visible('verify-email')).toBeFalsy();

  //   onLoginCB();

  //   // should fire observer when it reads the internal storage
  //   await when(() => service.visible('verify-email'));

  //   // should fire observer when it update from endpoint
  //   await when(() => service.visible('verify-email'));
  //   expect(service.visible('verify-email')).toBeFalsy();
  // });

  test('notice dismissal', async () => {
    const service = new InFeedNoticesService();
    service.init();

    await onLoginCB();

    expect(service.visible('build-your-algorithm')).toBeTruthy();

    service.dismiss('build-your-algorithm');

    expect(service.visible('build-your-algorithm')).toBeFalsy();
  });
});
