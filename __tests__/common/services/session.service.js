import service from '../../../src/common/services/session.service';
import { getStores } from '../../../AppStores';
import sessionStorage from '../../../src/common/services/session.storage.service';
jest.mock('../../../src/common/services/session.storage.service');
jest.mock('../../../AppStores');

/**
 * Tests
 */
describe('Session service', () => {
  it('should have initial values', async () => {
    const appStores = { user: { load: jest.fn(), setUser: jest.fn()  } };
    getStores.mockReturnValue(appStores);

    const now = Date.now() + 3600;
    expect(service.initialScreen).toEqual('Capture');
    expect(service.token).toEqual('');
    sessionStorage.getAll.mockResolvedValue([
      { access_token: '1111', access_token_expires: now },
      { refresh_token: '2222', refresh_token_expires: now },
      { guid: 'guid1' },
    ]);
    appStores.user.load.mockResolvedValue({ guid: 'guid1' });
    await service.init();
    expect(service.guid).toBe('guid1');
    expect(sessionStorage.getAll).toHaveBeenCalled();

    // set initial screen
    service.setInitialScreen('screen1');
    expect(service.initialScreen).toBe('screen1');

    // login
    await service.login({ access_token: '1111a', refresh_token: '2222a' });

    expect(service.guid).toBe('guid1');

    service.onSession(() => {});

    service.onLogin(() => {});
    expect(sessionStorage.setAccessToken).toHaveBeenCalled();
    expect(service.isLoggedIn()).toBe(true);
    service.logout();

    service.onLogout(() => {});
    expect(service.guid).toBe(null);
    expect(sessionStorage.clear).toHaveBeenCalled();

    service.onSession(() => {});

    service.onLogin(() => {});
    service.clearMessengerKeys();
    expect(sessionStorage.clearPrivateKey).toHaveBeenCalled();
  });
});
