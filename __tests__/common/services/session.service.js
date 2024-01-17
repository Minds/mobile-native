import { SessionService } from '../../../src/common/services/session.service';
import { SessionStorageService } from '../../../src/common/services/storage/session.storage.service';
import { getStores } from '../../../AppStores';
jest.mock('../../../AppStores');

/**
 * Tests
 */
describe('Session service', () => {
  it('should have initial values', async () => {
    const sessionStorage = new SessionStorageService();
    const service = new SessionService(sessionStorage);
    const appStores = { user: { load: jest.fn(), setUser: jest.fn() } };
    getStores.mockReturnValue(appStores);

    const now = Date.now() + 3600;
    expect(service.initialScreen).toEqual('');
    expect(service.cookies).toEqual(undefined);
    appStores.user.load.mockResolvedValue({ guid: 'guid1' });
    await service.init();

    // set initial screen
    service.setInitialScreen('screen1');
    expect(service.initialScreen).toBe('screen1');

    // login
    await service.login();

    service.onSession(() => {});

    service.onLogin(() => {});
    expect(service.userLoggedIn).toBe(true);
    service.logout(false);

    service.onLogout(() => {});
    expect(service.guid).toBe(null);

    service.onSession(() => {});

    service.onLogin(() => {});
  });
});
