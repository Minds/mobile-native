import api from '../../src/common/services/api.service';
import referralService from '../../src/share/ReferralsService';

jest.mock('../../src/common/services/api.service');

/**
 * Tests
 */
describe('referral service', () => {
  beforeEach(() => {
    api.get.mockClear();
    api.put.mockClear();
  });

  it('should call api get when getReferrals is called and return the referrals', async () => {

    const apiResponse = {referrals: [1,2,3], 'load-next': 'a1'};

    api.get.mockResolvedValue(apiResponse);
    
    const res = await referralService.getReferrals('a0');

    expect(res.entities).toEqual(apiResponse.referrals);
    expect(res.offset).toEqual(apiResponse['load-next']);

    expect(api.get.mock.calls.length).toEqual(1);
    
    expect(api.get.mock.calls[0][0]).toEqual('api/v2/referrals/');
    
    expect(api.get.mock.calls[0][1].offset).toEqual('a0');
  });

  it('should call api put when pingReferral is called and return done', async () => {

    const apiResponse = {done: true};

    api.put.mockResolvedValue(apiResponse);
    
    const done = await referralService.pingReferral('guid1');

    expect(done).toEqual(apiResponse.done);

    expect(api.put.mock.calls.length).toEqual(1);
   
    expect(api.put.mock.calls[0][0]).toEqual('api/v2/referrals/guid1');
  });
});