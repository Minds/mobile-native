import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  ApiService,
  TWO_FACTOR_ERROR,
} from '../../../src/common/services/api.service';
import { ApiError } from '../../../src/common/services/ApiErrors';

import session from '../../../src/common/services/session.service';
import auth from '../../../src/auth/AuthService';
import { APP_API_URI } from '../../../src/config/Config';
import { UserError } from '../../../src/common/UserError';
import { getStores } from '../../../AppStores';
import NavigationService from '../../../src/navigation/NavigationService';

jest.mock('../../../src/navigation/NavigationService');

getStores.mockReturnValue({
  user: {
    me: {},
    load: jest.fn().mockReturnValue({ guid: '1' }),
    setUser: jest.fn(),
  },
});

jest.mock('../../../src/auth/AuthService');
jest.mock('~/common/services/analytics.service');

var mock = new MockAdapter(axios);

const axiosInstance = axios.create();
// const axiosMock = new MockAdapter(axios);

const api = new ApiService(null, axiosInstance);

/**
 * POST
 */
describe('api service POST', () => {
  afterEach(() => {
    mock.reset();
    NavigationService.navigate.mockClear();
  });

  it('POST should fetch and return json decoded', async () => {
    const data = { access_token: 'a1', user_id: 1000, status: 'success' };
    const params = { p1: 1, p2: 2 };
    mock.onAny().reply(200, data);

    const p = await api.put('api/path', params);

    // assert on the response
    expect(p).toEqual(data);
  });

  it('POST should return server error with generic message', async () => {
    mock.onAny().reply(500, 'Some server error');

    const params = { p1: 1, p2: 2 };
    try {
      const p = await api.put('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toEqual('Server error 500');
    }
  });

  it('POST should return json error', async () => {
    mock.onAny().reply(200, 'Invalid JSON');

    const params = { p1: 1, p2: 2 };

    try {
      const res = await api.put('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
    }
  });

  it('POST should return api error', async () => {
    mock.onAny().reply(200, { status: 'error', message: 'Some Error' });

    const params = { p1: 1, p2: 2 };
    try {
      const p = await api.put('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toEqual('Some Error');
    }
  });

  it('POST should return api error even for error status', async () => {
    mock.onAny().reply(500, { status: 'error', message: 'Some Error' });

    const params = { p1: 1, p2: 2 };
    try {
      const p = await api.put('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toEqual('Some Error');
    }
  });
});

/**
 * GET
 */
describe('api service GET', () => {
  beforeAll(() => {
    session.addSession({
      access_token: 'sometoken',
      refresh_token: 'sometoken',
    });
  });
  beforeEach(() => {
    NavigationService.getCurrentState.mockClear();
    NavigationService.getCurrentState.mockReturnValue({});
  });
  afterEach(() => {
    mock.reset();
  });
  it('GET should fetch and return json decoded', async () => {
    const data = { access_token: 'a1', user_id: 1000, status: 'success' };
    const params = { p1: 1, p2: 2 };
    mock.onAny().reply(200, data);

    const p = await api.get('api/path', params);

    // assert on the response
    expect(p).toEqual(data);
  });

  it('GET should return server error with generic message', async () => {
    mock.onAny().reply(500, 'Some server error');

    const params = { p1: 1, p2: 2 };
    try {
      const p = await api.get('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toEqual('Server error 500');
    }
  });

  it('GET should return json error', async () => {
    mock.onAny().reply(200, 'Invalid JSON');

    const params = { p1: 1, p2: 2 };

    try {
      const res = await api.get('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
    }
  });

  it('GET should return api error', async () => {
    mock.onAny().reply(200, { status: 'error', message: 'Some Error' });

    const params = { p1: 1, p2: 2 };
    try {
      const p = await api.get('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toEqual('Some Error');
    }
  });

  it('GET should return api error even for error status', async () => {
    mock.onAny().reply(500, { status: 'error', message: 'Some Error' });

    const params = { p1: 1, p2: 2 };
    try {
      const p = await api.get('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toEqual('Some Error');
    }
  });
});

/**
 * DELETE
 */
describe('api service DELETE', () => {
  beforeAll(() => {
    session.addSession({
      access_token: 'sometoken',
      refresh_token: 'sometoken',
    });
  });
  beforeEach(() => {
    NavigationService.getCurrentState.mockClear();
    NavigationService.getCurrentState.mockReturnValue({});
  });
  afterEach(() => {
    mock.reset();
  });

  it('DELETE should fetch and return json decoded', async () => {
    const data = { access_token: 'a1', user_id: 1000, status: 'success' };
    const params = { p1: 1, p2: 2 };
    mock.onAny().reply(200, data);

    const p = await api.post('api/path', params);

    // assert on the response
    expect(p).toEqual(data);
  });

  it('DELETE should return server error with generic message', async () => {
    mock.onAny().reply(500, 'Some server error');

    const params = { p1: 1, p2: 2 };
    try {
      const p = await api.delete('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toEqual('Server error 500');
    }
  });

  it('DELETE should return json error', async () => {
    mock.onAny().reply(200, 'Invalid JSON');

    const params = { p1: 1, p2: 2 };

    try {
      const res = await api.delete('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
    }
  });

  it('DELETE should return api error', async () => {
    mock.onAny().reply(200, { status: 'error', message: 'Some Error' });

    const params = { p1: 1, p2: 2 };
    try {
      const p = await api.delete('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toEqual('Some Error');
    }
  });

  it('DELETE should return api error even for error status', async () => {
    mock.onAny().reply(500, { status: 'error', message: 'Some Error' });

    const params = { p1: 1, p2: 2 };
    try {
      const p = await api.delete('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toEqual('Some Error');
    }
  });
});

/**
 * PUT
 */
describe('api service PUT', () => {
  beforeAll(() => {
    session.addSession({
      access_token: 'sometoken',
      refresh_token: 'sometoken',
    });
  });
  beforeEach(() => {
    NavigationService.getCurrentState.mockClear();
    NavigationService.getCurrentState.mockReturnValue({});
  });
  afterEach(() => {
    mock.reset();
  });

  it('PUT should fetch and return json decoded', async () => {
    const data = { access_token: 'a1', user_id: 1000, status: 'success' };
    const params = { p1: 1, p2: 2 };
    mock.onAny().reply(200, data);

    const p = await api.put('api/path', params);

    // assert on the response
    expect(p).toEqual(data);
  });

  it('PUT should return server error with generic message', async () => {
    mock.onAny().reply(500, 'Some server error');

    const params = { p1: 1, p2: 2 };
    try {
      const p = await api.delete('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toEqual('Server error 500');
    }
  });

  it('PUT should return json error', async () => {
    mock.onAny().reply(200, 'Invalid JSON');

    const params = { p1: 1, p2: 2 };

    try {
      const res = await api.delete('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
    }
  });

  it('PUT should return api error', async () => {
    mock.onAny().reply(200, { status: 'error', message: 'Some Error' });

    const params = { p1: 1, p2: 2 };
    try {
      const p = await api.delete('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toEqual('Some Error');
    }
  });

  it('PUT should return api error even for error status', async () => {
    mock.onAny().reply(500, { status: 'error', message: 'Some Error' });

    const params = { p1: 1, p2: 2 };
    try {
      const p = await api.delete('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toEqual('Some Error');
    }
  });
});

/**
 * GET
 */
describe('api service auth refresh', () => {
  beforeAll(() => {
    return session.addSession({
      access_token: 'sometoken',
      refresh_token: 'sometoken',
    });
  });
  beforeEach(() => {
    NavigationService.getCurrentState.mockClear();
    NavigationService.getCurrentState.mockReturnValue({});
  });
  afterEach(() => {
    mock.reset();
    auth.refreshToken.mockClear();
  });
  it('auth token should be refreshed only once for simultaneous calls', async () => {
    session.refreshTokenExpires = Date.now() / 1000 + 10000;
    session.refreshToken = 'refreshtokenfake';
    const data1 = { user_id: 1, status: 'success' };
    const data2 = { user_id: 2, status: 'success' };
    const data3 = { user_id: 3, status: 'success' };

    auth.refreshToken.mockResolvedValue({
      refresh_token: 'refresh',
      access_token: 'access',
    });

    mock
      .onGet('api/channels/me1')
      .replyOnce(401)
      .onGet('api/channels/me2')
      .replyOnce(401)
      .onGet('api/channels/me3')
      .replyOnce(401)
      .onGet('api/channels/me1')
      .replyOnce(200, data1)
      .onGet('api/channels/me2')
      .replyOnce(200, data2)
      .onGet('api/channels/me3')
      .replyOnce(200, data3);

    const p1 = api.get('api/channels/me1');
    const p2 = api.get('api/channels/me2');
    const p3 = api.get('api/channels/me3');

    const [r1, r2, r3] = await Promise.all([p1, p2, p3]);

    // assert on the response
    expect(r1).toEqual(data1);
    expect(r2).toEqual(data2);
    expect(r3).toEqual(data3);

    expect(auth.refreshToken).toBeCalledTimes(1);
  });

  it('must fail without logout if token refresh fails by connectivity/server error', async () => {
    session.refreshTokenExpires = Date.now() / 1000 + 10000;
    // has session token
    session.token = 'sometoken';
    const data1 = { user_id: 1, status: 'success' };
    const data2 = { user_id: 2, status: 'success' };
    const data3 = { user_id: 3, status: 'success' };
    const data4 = { user_id: 4, status: 'success' };

    const error = new Error('Network error');
    auth.refreshToken.mockRejectedValue(error);

    mock
      .onGet('api/channels/me1')
      .replyOnce(401)
      .onGet('api/channels/me2')
      .replyOnce(401)
      .onGet('api/channels/me3')
      .replyOnce(401)
      .onGet('api/channels/me4')
      .replyOnce(401)
      .onGet('api/channels/me1')
      .replyOnce(200, data1)
      .onGet('api/channels/me2')
      .replyOnce(200, data2)
      .onGet('api/channels/me3')
      .replyOnce(200, data3)
      .onGet('api/channels/me4')
      .replyOnce(200, data4);

    const p1 = api.get('api/channels/me1');
    const p2 = api.get('api/channels/me2');
    const p3 = api.get('api/channels/me3');
    const p4 = api.get('api/channels/me4');

    const [r1, r2, r3, r4] = await Promise.all(
      [p1, p2, p3, p4].map(p => p.catch(e => e)),
    );
    // assert on the response
    expect(r1).toBe(error); //
    expect(r2).toBe(error);
    expect(r3).toBe(error);
    expect(r4).toBe(error);

    expect(auth.refreshToken).toBeCalledTimes(1);
  });

  it('should logout if refresh fails with response is 401', async () => {
    // not expired session token
    session.refreshTokenExpires = Date.now() / 1000 + 10000;
    // has session token
    session.token = 'sometoken';

    const data1 = { user_id: 1, status: 'success' };
    const data2 = { user_id: 2, status: 'success' };

    const error = { response: { status: 401 } };
    auth.refreshToken.mockRejectedValue(error);

    mock
      .onGet('api/channels/me1')
      .replyOnce(401)
      .onGet('api/channels/me2')
      .replyOnce(401)
      .onGet('api/channels/me1')
      .replyOnce(200, data1)
      .onGet('api/channels/me2')
      .replyOnce(200, data2);

    const p1 = api.get('api/channels/me1');
    const p2 = api.get('api/channels/me2');

    const [r1, r2] = await Promise.all([p1, p2].map(p => p.catch(e => e)));

    // assert on the response
    expect(r1).toBe(error);
    expect(r2).toBe(error);

    expect(auth.refreshToken).toBeCalledTimes(1);
  });

  it('should prompt for 2fa if required and repeat the call', async () => {
    try {
      NavigationService.navigate.mockImplementation((screen, params) => {
        // mock user entered code
        params && params.onConfirm && params.onConfirm('123123');
      });

      const params = { p: 1 };

      mock
        .onPost('api/channels/me1')
        .replyOnce(
          401,
          { status: 'error', errorId: TWO_FACTOR_ERROR },
          { 'x-minds-email-2fa-key': 'kkkey' },
        )
        .onPost('api/channels/me1')
        .reply(config => {
          expect(config.url).toBe('api/channels/me1');
          expect(config.data).toBe(JSON.stringify(params));
          expect(config.headers['X-MINDS-2FA-CODE']).toBe('123123');
          expect(config.headers['X-MINDS-EMAIL-2FA-KEY']).toBe('kkkey');
          return [200, { status: 'success' }];
        });

      await api.post('api/channels/me1', params);
      expect(NavigationService.navigate).toBeCalled();
    } catch (error) {
      console.log(error);
    }
  });

  it('should throw if 2FA is canceled', async () => {
    try {
      NavigationService.navigate.mockImplementation((screen, params) => {
        console.log('CANCEL CALLED');
        // mock user entered code
        params && params.onCancel && params.onCancel();
      });

      const params = { p: 1 };

      mock
        .onPost('api/channels/me1')
        .replyOnce(
          401,
          { status: 'error', errorId: TWO_FACTOR_ERROR },
          { 'x-minds-email-2fa-key': 'kkkey' },
        );

      await api.post('api/channels/me1', params);
      expect(NavigationService.navigate).toBeCalled();
    } catch (error) {
      console.log('error', error);
      expect(error).toBeInstanceOf(UserError);
      console.log(error);
    }
  });
});
