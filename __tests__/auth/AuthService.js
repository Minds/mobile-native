import api, { isNetworkError } from '../../src/common/services/api.service';
import authService from '../../src/auth/AuthService';
import delay from '../../src/common/helpers/delay';
import sessionService, {
  SessionService,
} from '../../src/common/services/session.service';
import { SessionStorageService } from '../../src/common/services/storage/session.storage.service';

jest.mock('../../src/common/services/api.service');
jest.mock('../../src/common/helpers/delay', () => jest.fn());

describe('auth service login', () => {
  const sessionStorage = new SessionStorageService();
  const session = new SessionService(sessionStorage);
  beforeEach(() => {
    api.post.mockClear();
    delay.mockClear();
    delay.mockResolvedValue();
  });

  xit('login calls oauth2/token api and returns token', async () => {
    const response = { access_token: 'a1', refresh_token: 'a2' };

    api.post.mockResolvedValue(response);

    const promise = authService.login('user', 'pass');

    const res = await promise;

    // assert on the response
    expect(res).toEqual(response);
    // call api post one time
    expect(api.post.mock.calls.length).toEqual(1);
    // with login url
    expect(api.post.mock.calls[0][0]).toEqual('api/v3/oauth/token');
  });

  xit('login create session on success', async () => {
    const response = { access_token: 'a1', refresh_token: 'a2' };

    api.post.mockResolvedValue(response);

    const promise = authService.login('user', 'pass');

    const res = await promise;
    console.log('res', res);
    // assert on the response
    expect(res).toEqual(response);
  });

  it('login returns errors', async () => {
    const response = { status: 'error', error: 'some error' };

    api.rawPost.mockRejectedValue(response);

    try {
      const promise = authService.login('user', 'pass');

      const res = await promise;
    } catch (err) {
      // assert on the response
      expect(err).toEqual(response);
    }
  });
});

describe('auth service logout', () => {
  beforeEach(() => {
    api.post.mockClear();
  });

  it('logout calls api/v1/logout api and returns', async () => {
    api.post.mockResolvedValue(true);
    sessionService.logout = jest.fn().mockResolvedValue(true);

    const res = await authService.logout();

    //assert on the response
    expect(res).toEqual(true);
  });

  it('logout destroy session on success', async () => {
    api.post.mockResolvedValue(true);

    const res = await authService.logout();

    // assert on the response
    expect(res).toEqual(true);
  });

  it('should clear cookies on logout', async () => {
    api.post.mockResolvedValue(true);

    const res = await authService.logout();

    // assert on the response
    expect(res).toEqual(true);

    // should clear cookies
    expect(api.clearCookies).toBeCalled();
  });

  xit('logout returns errors', async () => {
    const response = { status: 'error', error: 'some error' };

    api.post.mockRejectedValue(response);

    try {
      const res = await authService.logout();
    } catch (err) {
      // assert on the response
      expect(err).toEqual(response);
    }
  });
});

describe('auth service forgot', () => {
  beforeEach(() => {
    api.post.mockClear();
  });

  it('forgot calls api/v1/forgotpassword/request and returns', async () => {
    const response = { status: 'success', user: { name: 'someUser' } };

    api.post.mockResolvedValue(response);

    const res = await authService.forgot('user');

    // assert on the response
    expect(res).toEqual(response);
    // call api post one time
    expect(api.post.mock.calls.length).toEqual(1);
    // with login url
    expect(api.post.mock.calls[0][0]).toEqual('api/v1/forgotpassword/request');
  });

  it('forgot returns errors', async () => {
    const response = { status: 'error', error: 'some error' };

    api.post.mockRejectedValue(response);

    try {
      const res = await authService.forgot('user');
    } catch (err) {
      // assert on the response
      expect(err).toEqual(response);
    }
  });
});
