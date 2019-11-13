import referralsService from '../../src/share/ReferralsService';
import ReferralsStore from '../../src/share/ReferralsStore';
import ReferralModel from '../../src/share/ReferralModel';
import OffsetListStore from '../../src/common/stores/OffsetListStore';
import { whenWithTimeout } from 'mobx-utils';

jest.mock('../../src/share/ReferralsService');
jest.mock('../../src/share/ReferralModel');
jest.mock('../../src/common/stores/OffsetListStore');

//mock referral
ReferralModel.createMany = jest.fn();

// we return the same array converted to strings as a model representation
ReferralModel.createMany.mockImplementation((r) => r.map(u => u.toString()));

/**
 * Tests referral store
 */
describe('referral store', () => {
  let store;

  beforeEach(() => {
    store = new ReferralsStore();
  });

  it('should call referrals service getReferrals and update the list', async (done) => {

    const fakeData = {entities: [1,2,3], 'load-next': 'a0'};

    referralsService.getReferrals.mockResolvedValue(fakeData);

    try {
      // tested method
      const res = await store.loadList();

      // call blogs service loadlist one time
      expect(referralsService.getReferrals.mock.calls.length).toEqual(1);

      // should create models
      expect(ReferralModel.createMany).toBeCalledWith([1,2,3]);

      // should be called with response
      expect(store.list.setList).toBeCalledWith(fakeData);

      // should be converted to models
      expect(fakeData.entities).toEqual(['1', '2', '3']);
      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('should clear list and reload on refresh', async (done) => {
    try {
      const spy = jest.spyOn(store, 'loadList');
      
      // tested method
      const res = await store.refresh();

      // should clear the list
      expect(store.list.refresh).toBeCalled();
      
      // should load new data
      expect(spy).toBeCalled();
      
      done();
    } catch (e) {
      done.fail(e);
    }
  });
});