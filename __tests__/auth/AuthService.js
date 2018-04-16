import api from '../../src/common/services/api.service';
import session from '../../src/common/services/session.service';
import authService from '../../src/auth/AuthService';

jest.mock('../../src/common/services/api.service');
jest.mock('../../src/common/services/session.service');

describe('auth service login', () => {
  beforeEach(() => {
    api.post.mockClear();
    session.login.mockClear();
  });

  it('login calls oauth2/token api and returns token', async () => {

    const response = { access_token: 'a1', user_id: 1000 };

    api.post.mockResolvedValue(response);

    const res = await authService.login('user', 'pass');

    // assert on the response
    expect(res).toEqual(response);
    // call api post one time
    expect(api.post.mock.calls.length).toEqual(1);
    // with login url
    expect(api.post.mock.calls[0][0]).toEqual('oauth2/token');
  });

  it('login create session on success', async () => {

    const response = { access_token: 'a1', user_id: 1000 };

    api.post.mockResolvedValue(response);

    const res = await authService.login('user', 'pass');

    // assert on the response
    expect(res).toEqual(response);
    // call session login one time
    expect(session.login.mock.calls.length).toEqual(1);
    // with token and guid
    expect(session.login.mock.calls[0]).toEqual(['a1', 1000]);
  });

  it('login returns errors', async () => {

    const response = {status: 'error', error: 'some error'};

    api.post.mockRejectedValue(response);

    try {
      const res = await authService.login('user', 'pass');
    } catch(err) {
      // assert on the response
      expect(err).toEqual(response);
    }
  });
});

describe('auth service logout', () => {
  beforeEach(() => {
      api.post.mockClear();
      session.logout.mockClear();
  });

  it('logout calls api/v1/logout api and returns', async () => {

    api.post.mockResolvedValue(true);

    const res = await authService.logout();

    //assert on the response
    expect(res).toEqual(true);
    // call api post one time
    expect(api.post.mock.calls.length).toEqual(1);
    // with logout url
    expect(api.post.mock.calls[0][0]).toEqual('api/v1/logout');
  });

  it('logout destroy session on success', async () => {

    api.post.mockResolvedValue(true);

    const res = await authService.logout();

    // assert on the response
    expect(res).toEqual(true);
    // call session logout one time
    expect(session.logout.mock.calls.length).toEqual(1);
  });

  it('logout returns errors', async () => {

    const response = {status: 'error', error: 'some error'};

    api.post.mockRejectedValue(response);

    try {
      const res = await authService.logout();
    } catch(err) {
      // assert on the response
      expect(err).toEqual(response);
    }
  });
});

describe('auth service forgot', () => {
  beforeEach(() => {
    api.post.mockClear();
    session.login.mockClear();
  });

  it('forgot calls api/v1/forgotpassword/request and returns', async () => {

    const response = { status: 'success', user: {name: 'someUser'} };

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

    const response = {status: 'error', error: 'some error'};

    api.post.mockRejectedValue(response);

    try {
      const res = await authService.forgot('user');
    } catch(err) {
      // assert on the response
      expect(err).toEqual(response);
    }
  });
});

