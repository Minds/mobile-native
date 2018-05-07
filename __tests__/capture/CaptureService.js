import api from '../../src/common/services/api.service';
import { post } from '../../src/capture/CaptureService';

jest.mock('../../src/common/services/api.service');

/**
 * Tests
 */
describe('cature service', () => {
  beforeEach(() => {
    api.post.mockClear();
  });

  it('should call post and return the activity as entity', async () => {

    const activity = {title: 'posted data'};
    const response = { activity };

    api.post.mockResolvedValue(response);

    const res = await post({message: 'posted data'});

    // assert on the response
    expect(res.entity).toEqual(activity);
    // call api post one time
    expect(api.post.mock.calls.length).toEqual(1);
    // with login url
    expect(api.post.mock.calls[0][0]).toEqual('api/v1/newsfeed');
  });

  it('should return api errors', async () => {

    const response = {status: 'error', error: 'some error'};

    // api error
    api.post.mockRejectedValue(response);

    try {
      const res = await post({message: 'posted data'});
    } catch(err) {
      // assert on the response
      expect(err).toEqual(response);
    }
  });

  it('should return errors', async () => {

    const response = {status: 'error', error: 'some error'};

    api.post.mockRejectedValue(new Error("some post error"));

    try {
      const res = await post({message: 'posted data'});
    } catch(err) {
      // assert on the response
      expect(err.message).toEqual("some post error");
    }
  });
});
