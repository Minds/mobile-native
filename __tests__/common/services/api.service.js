import api from '../../../src/common/services/api.service';
import session from '../../../src/common/services/session.service';
import { MINDS_URI } from '../../../src/config/Config';
jest.mock('../../../src/common/services/session.service');

/**
 * POST
 */
describe('api service POST', () => {
  beforeEach(() => {
    fetch.resetMocks();
    session.login.mockClear();
  });

  it('should fetch and return json decoded', async () => {

    const response = { access_token: 'a1', user_id: 1000 };
    const params = {p1: 1, p2: 2};

    fetch.mockResponseOnce(JSON.stringify(response));

    const res = await api.post('api/path', params);

    // assert on the response
    expect(res).toEqual(response);
    // call fetch post one time
    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toContain(MINDS_URI+'api/path')
    expect(fetch.mock.calls[0][1].method).toEqual('POST');
    expect(fetch.mock.calls[0][1].body).toEqual(JSON.stringify(params));
  });

  it('should return server error', async () => {

    const response = 'Some error';
    const params = {p1: 1, p2: 2};

    fetch.mockResponseOnce(response,  { status: 500 });

    try {
      const res = await api.post('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err.body).toEqual(response);
    }
  });

  it('should return api error', async () => {

    const response = { status: 'error', error: 'some error' };
    const params = {p1: 1, p2: 2};

    fetch.mockResponseOnce(JSON.stringify(response));

    try {
      const res = await api.post('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toEqual(response);
    }
  });
});

/**
 * GET
 */
describe('api service GET', () => {
  beforeEach(() => {
    fetch.resetMocks();
    session.login.mockClear();
  });
  it('should fetch and return json decoded', async () => {

    const response = { status: 'success', access_token: 'a1', user_id: 1000 };
    const params = {p1: '1', p2: '2'};

    fetch.mockResponse(JSON.stringify(response), { status: 200 });

    const res = await api.get('api/path', params, null);
    // assert on the response
    expect(res).toEqual(response);
    // call fetch get one time
    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toContain(MINDS_URI+'api/path?p1=1&p2=2');
  });

  it('should return servers error', async () => {

    const response = { status: 'error', error:'some error' };
    const params = {p1: '1', p2: '2'};

    fetch.mockResponse(JSON.stringify(response), { status: 200 });

    try {
      const res = await api.get('api/path', params, null);
    } catch (err){
      // assert on the error
      expect(err).toEqual(response);
    }
  });

  it('should return api error', async () => {

    const response = { status: 'error', error: 'some error' };
    const params = {p1: 1, p2: 2};

    fetch.mockResponseOnce(JSON.stringify(response));

    try {
      const res = await api.get('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toEqual(response);
    }
  });
});

/**
 * DELETE
 */
describe('api service DELETE', () => {
  beforeEach(() => {
    fetch.resetMocks();
    session.login.mockClear();
  });
  it('should fetch and return json decoded', async () => {

    const response = { access_token: 'a1', user_id: 1000 };
    const params = {p1: 1, p2: 2};

    fetch.mockResponseOnce(JSON.stringify(response));

    const res = await api.delete('api/path', params);

    // assert on the response
    expect(res).toEqual(response);
    // call fetch delete one time
    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toContain(MINDS_URI+'api/path')
    expect(fetch.mock.calls[0][1].method).toEqual('DELETE');
    expect(fetch.mock.calls[0][1].body).toEqual(JSON.stringify(params));
  });

  it('should return server error', async () => {

    const response = 'Some error';
    const params = {p1: 1, p2: 2};

    fetch.mockResponseOnce(response,  { status: 500 });

    try {
      const res = await api.delete('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err.body).toEqual(response);
    }
  });

  it('should return api error', async () => {

    const response = { status: 'error', error: 'some error' };
    const params = {p1: 1, p2: 2};

    fetch.mockResponseOnce(JSON.stringify(response));

    try {
      const res = await api.delete('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toEqual(response);
    }
  });
});

/**
 * PUT
 */
describe('api service PUT', () => {
  beforeEach(() => {
    fetch.resetMocks();
    session.login.mockClear();
  });
  it('should fetch and return json decoded', async () => {

    const response = { access_token: 'a1', user_id: 1000 };
    const params = {p1: 1, p2: 2};

    fetch.mockResponseOnce(JSON.stringify(response));

    const res = await api.put('api/path', params);

    // assert on the response
    expect(res).toEqual(response);
    // call fetch put one time
    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toContain(MINDS_URI+'api/path')
    expect(fetch.mock.calls[0][1].method).toEqual('PUT');
    expect(fetch.mock.calls[0][1].body).toEqual(JSON.stringify(params));
  });

  it('should return server error', async () => {

    const response = 'Some error';
    const params = {p1: 1, p2: 2};

    fetch.mockResponseOnce(response,  { status: 500 });

    try {
      const res = await api.put('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err.body).toEqual(response);
    }
  });

  it('should return api error', async () => {

    const response = { status: 'error', error: 'some error' };
    const params = {p1: 1, p2: 2};

    fetch.mockResponseOnce(JSON.stringify(response));

    try {
      const res = await api.put('api/path', params);
    } catch (err) {
      // assert on the error
      expect(err).toEqual(response);
    }
  });
});

