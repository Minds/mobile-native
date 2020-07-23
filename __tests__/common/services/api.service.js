import api, { ApiError } from '../../../src/common/services/api.service';
import session from '../../../src/common/services/session.service';
import abortableFetch, {
  abort,
} from '../../../src/common/helpers/abortableFetch';
import { MINDS_API_URI } from '../../../src/config/Config';
import { UserError } from '../../../src/common/UserError';
jest.mock('../../../src/common/services/session.service');
jest.mock('../../../src/common/helpers/abortableFetch');

/**
 * POST
 */
describe('api service POST', () => {
  beforeEach(() => {
    abortableFetch.mockClear();
    session.login.mockClear();
  });

  it('POST should fetch and return json decoded', async () => {
    const response = { text: jest.fn(), ok: true };
    const respBody =
      '{"access_token": "a1", "user_id": 1000, "status":"success"}';
    response.text.mockResolvedValue(respBody);
    const params = { p1: 1, p2: 2 };

    abortableFetch.mockResolvedValue(response);

    const res = await api.post('api/path', params);

    // assert on the response
    expect(res).toEqual(JSON.parse(respBody));
    // call fetch post one time
    expect(abortableFetch.mock.calls.length).toEqual(1);
    expect(abortableFetch.mock.calls[0][0]).toContain(
      MINDS_API_URI + 'api/path',
    );
    expect(abortableFetch.mock.calls[0][1].method).toEqual('POST');
    expect(abortableFetch.mock.calls[0][1].body).toEqual(
      JSON.stringify(params),
    );
  });

  it('POST should return server error', async () => {
    const response = {
      text: jest.fn(),
      ok: false,
      body: 'some error',
      status: 500,
    };

    const params = { p1: 1, p2: 2 };

    abortableFetch.mockResolvedValue(response);

    try {
      const res = await api.post('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
    }
  });

  it('POST should return json error', async () => {
    const response = {
      text: jest.fn(),
      ok: false,
      body: 'some error',
      status: 200,
    };

    response.text.mockResolvedValue('Invalid JSON');

    const params = { p1: 1, p2: 2 };

    abortableFetch.mockResolvedValue(response);

    try {
      const res = await api.post('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
    }
  });

  it('POST should return api error', async () => {
    const response = { text: jest.fn(), ok: true };
    const respBody = '{"status": "error", "error": "some error" }';
    response.text.mockResolvedValue(respBody);
    const params = { p1: 1, p2: 2 };

    abortableFetch.mockResolvedValue(response);

    try {
      const res = await api.post('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
    }
  });
});

/**
 * GET
 */
describe('api service GET', () => {
  beforeEach(() => {
    abortableFetch.mockClear();
    session.login.mockClear();
  });
  it('GET should fetch and return json decoded', async () => {
    const response = { text: jest.fn(), ok: true };
    const respBody =
      '{ "access_token": "a1", "user_id": 1000, "status": "success" }';
    response.text.mockResolvedValue(respBody);
    const params = { p1: '1', p2: '2' };

    abortableFetch.mockResolvedValue(response);

    const res = await api.get('api/path', params, null);
    // assert on the response
    expect(res).toEqual(JSON.parse(respBody));
    // call fetch get one time
    expect(abortableFetch.mock.calls.length).toEqual(1);
    expect(abortableFetch.mock.calls[0][0]).toContain(
      MINDS_API_URI + 'api/path?p1=1&p2=2',
    );
  });

  it('GET should return servers error', async () => {
    const response = { text: jest.fn(), ok: false, body: 'some error' };

    const params = { p1: 1, p2: 2 };

    abortableFetch.mockResolvedValue(response);

    try {
      const res = await api.get('api/path', params, null);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
    }
  });

  it('GET should return api error', async () => {
    const response = { text: jest.fn(), ok: true };
    const respBody = '{ "status": "error", "error": "some error" }';
    response.text.mockResolvedValue(respBody);
    const params = { p1: 1, p2: 2 };

    abortableFetch.mockResolvedValue(response);

    try {
      const res = await api.get('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
    }
  });
});

/**
 * DELETE
 */
describe('api service DELETE', () => {
  beforeEach(() => {
    abortableFetch.mockClear();
    session.login.mockClear();
  });
  it('DELETE should fetch and return json decoded', async () => {
    const response = { text: jest.fn(), ok: true };
    const respBody =
      '{ "access_token": "a1", "user_id": 1000, "status": "success" }';
    response.text.mockResolvedValue(respBody);
    const params = { p1: '1', p2: '2' };

    abortableFetch.mockResolvedValue(response);

    const res = await api.delete('api/path', params);

    // assert on the response
    expect(res).toEqual(JSON.parse(respBody));
    // call fetch delete one time
    expect(abortableFetch.mock.calls.length).toEqual(1);
    expect(abortableFetch.mock.calls[0][0]).toContain(
      MINDS_API_URI + 'api/path',
    );
    expect(abortableFetch.mock.calls[0][1].method).toEqual('DELETE');
    expect(abortableFetch.mock.calls[0][1].body).toEqual(
      JSON.stringify(params),
    );
  });

  it('DELETE should return server error', async () => {
    const response = { text: jest.fn(), ok: false, body: 'some error' };

    const params = { p1: 1, p2: 2 };

    abortableFetch.mockResolvedValue(response);

    try {
      const res = await api.delete('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
    }
  });

  it('DELETE should return api error', async () => {
    const response = { text: jest.fn(), ok: true };
    const respBody = '{ "status": "error", "error": "some error" }';
    response.text.mockResolvedValue(respBody);
    const params = { p1: 1, p2: 2 };

    abortableFetch.mockResolvedValue(response);

    try {
      const res = await api.delete('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
    }
  });
});

/**
 * PUT
 */
describe('api service PUT', () => {
  beforeEach(() => {
    abortableFetch.mockClear();
    session.login.mockClear();
  });
  it('PUT should fetch and return json decoded', async () => {
    const response = { text: jest.fn(), ok: true };
    const respBody =
      '{ "access_token": "a1", "user_id": 1000, "status": "success" }';
    response.text.mockResolvedValue(respBody);
    const params = { p1: '1', p2: '2' };

    abortableFetch.mockResolvedValue(response);

    const res = await api.put('api/path', params);

    // assert on the response
    expect(res).toEqual(JSON.parse(respBody));
    // call fetch put one time
    expect(abortableFetch.mock.calls.length).toEqual(1);
    expect(abortableFetch.mock.calls[0][0]).toContain(
      MINDS_API_URI + 'api/path',
    );
    expect(abortableFetch.mock.calls[0][1].method).toEqual('PUT');
    expect(abortableFetch.mock.calls[0][1].body).toEqual(
      JSON.stringify(params),
    );
  });

  it('PUT should return server error', async () => {
    const response = { text: jest.fn(), ok: false, body: 'some error' };

    const params = { p1: 1, p2: 2 };

    abortableFetch.mockResolvedValue(response);

    try {
      const res = await api.put('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
    }
  });

  it('PUT should return api error', async () => {
    const response = { text: jest.fn(), ok: true };
    const respBody = '{ "status": "error", "error": "some error" }';
    response.text.mockResolvedValue(respBody);
    const params = { p1: 1, p2: 2 };

    abortableFetch.mockResolvedValue(response);

    try {
      const res = await api.put('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toBeInstanceOf(ApiError);
    }
  });
});
