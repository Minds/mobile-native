import * as CaptureService from '../../src/capture/CaptureService';
import CaptureStore from '../../src/capture/CaptureStore';
import { whenWithTimeout } from 'mobx-utils';
import api from '../../src/common/services/api.service';

CaptureService.post = jest.fn();
jest.mock('../../src/common/services/api.service');

const thirdPartyNetworkResponse = {
  thirdpartynetworks: {
    twitter: { connected: true },
    facebook: { connected: true }
  }
};

/**
 * Tests
 */
describe('cature store post', () => {
  beforeEach(() => {
    CaptureService.post.mockClear();
  });

  it('should call capture service post and update posting', async (done) => {

    expect.assertions(5);

    const store = new CaptureStore();

    CaptureService.post.mockResolvedValue(true);

    const post = {message: 'posted data'};

    let postingWasTrue = false;

    // isPosting should be true while post is running
    whenWithTimeout(
      () => store.isPosting,
      () => postingWasTrue = true,
      200,
      () => done.fail("store didn't set isPosting to true")
    );

    try {
      // isPosting must be false before call post
      expect(store.isPosting).toEqual(false);

      const res = await store.post(post);

      // isPosting must be true at the beginning
      expect(postingWasTrue).toEqual(true);

      // isPosting should be true while post is running
      expect(store.isPosting).toEqual(false);

      // call api post one time
      expect(CaptureService.post.mock.calls.length).toEqual(1);
      // with the post data
      expect(CaptureService.post.mock.calls[0][0]).toEqual(post);

      done();
    } catch (e) {
      done.fail(e);
    }
  });
});

describe('capture store loadThirdPartySocialNetworkStatus', () => {
  beforeEach(() => {
    api.get.mockClear();
  });

  it('should call api get and load data', async (done) => {

    const store = new CaptureStore();

    api.get.mockResolvedValue(thirdPartyNetworkResponse);

    try {
      const res = await store.loadThirdPartySocialNetworkStatus();

      // assert on the response
      expect(res).toEqual(thirdPartyNetworkResponse);
      // call api post one time
      expect(api.get.mock.calls.length).toEqual(1);
      // // with login url
      expect(api.get.mock.calls[0][0]).toEqual('api/v1/thirdpartynetworks/status');

      expect(store.socialNetworks.twitter).toEqual(true);
      expect(store.socialNetworks.facebook).toEqual(true);

      done();
    } catch (e) {
      done.fail(e);
    }
  });
});
