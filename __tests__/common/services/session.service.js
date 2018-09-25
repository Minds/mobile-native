
import service from '../../../src/common/services/session.service';
import AppStores from '../../../AppStores';
import sessionStorage from '../../../src/common/services/session.storage.service';
jest.mock('../../../src/common/services/session.storage.service');
jest.mock('../../../AppStores');


/**
 * Tests
 */
describe('Session service', () => {

  it('should have initial values', async () => {
    now = Date.now() + 3600;
    expect(service.initialScreen).toEqual('Tabs');
    expect(service.token).toEqual('');
    sessionStorage.getAccessToken.mockResolvedValue({access_token:'1111', access_token_expires: now});
    sessionStorage.getRefreshToken.mockResolvedValue({refresh_token:'2222', refresh_token_expires: now});
    sessionStorage.getUser.mockResolvedValue({guid:'guid1'});
    AppStores.user.load.mockResolvedValue({guid:'guid1'});
    await service.init();
    expect(service.guid).toBe('guid1');
    expect(sessionStorage.getAccessToken).toHaveBeenCalled();

    // set initial screen
    service.setInitialScreen('screen1');
    expect(service.initialScreen).toBe('screen1');

    // login
    await service.login({access_token: '1111a', refresh_token: '2222a'});

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