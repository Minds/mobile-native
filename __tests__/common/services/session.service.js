
import service from '../../../src/common/services/session.service';
import sessionStorage from '../../../src/common/services/session.storage.service';
jest.mock('../../../src/common/services/session.storage.service');
/**
 * Tests
 */
describe('Session service', () => {

  it('should have initial values', async () => {
    
    expect(service.initialScreen).toEqual('Tabs');
    expect(service.token).toEqual('');
    sessionStorage.getAccessToken.mockResolvedValue({guid:1, token:'aaaab'});
    await service.init();
    expect(sessionStorage.getAccessToken).toHaveBeenCalled();
    service.setInitialScreen('screen1');

    expect(service.initialScreen).toBe('screen1');
    service.login('token1', 'guid1');

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