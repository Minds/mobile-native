import { when } from 'mobx';
import wireService from '../../src/wire/WireService';
import WireStore from '../../src/wire/WireStore';

jest.mock('../../src/wire/WireService');

/**
 * Wire service
 */
describe('wire store', () => {
  let store;

  beforeEach(() => {
    store = new WireStore();
    wireService.userRewards.mockClear();
  });

  it('should set the owner', () => {
    const owner = { name: 'someone', guid: '123123' };
    // should have a default null
    expect(store.owner).toBe(undefined);

    store.setOwner(owner);

    // should change to the new value
    expect(store.owner).toEqual(owner);
  });

  it('should set the guid of the owner', () => {
    // should have a default null
    const owner = { guid: '123123' };

    expect(store.guid).toBe(null);

    store.setOwner(owner);

    // should change to the new value
    expect(store.guid).toBe('123123');
  });

  it('should set the amount', () => {
    // should have a default 1
    expect(store.amount).toBe(1);

    store.setAmount(2);

    // should change to the new value
    expect(store.amount).toBe(2);
  });

  it('should set recurring', () => {
    // should have a default 1
    expect(store.recurring).toBe(false);

    store.setRecurring(true);

    // should change to the new value
    expect(store.recurring).toBe(true);
  });

  it('should set sending in false', () => {
    store.sending = true;

    store.stopSending();

    // should change to the new value
    expect(store.sending).toBe(false);
  });

  it('should toggle recurring', () => {
    // should have a default 1
    expect(store.recurring).toBe(false);

    store.toggleRecurring();
    // should toggle to true
    expect(store.recurring).toBe(true);

    store.toggleRecurring();
    // should toggle to false
    expect(store.recurring).toBe(false);
  });

  it('should load the user rewards from the service', async () => {
    const fakeOwner = { name: 'someone', guid: '123123' };
    const fakeOwnerResponse = { name: 'someone', guid: '123123' };

    wireService.userRewards.mockResolvedValue(fakeOwnerResponse);

    store.setOwner(fakeOwner);
    const result = await store.loadUserRewards();
    // should return the owner
    expect(result).toEqual(fakeOwnerResponse);
    // should set the owner
    expect(store.owner).toEqual(fakeOwnerResponse);
  });

  it('should not set the owner if load rewards fails', async () => {
    store.setOwner({ guid: '123123', name: 'someone' });
    wireService.userRewards = jest.fn();
    wireService.userRewards.mockRejectedValue(new Error('fakeError'));

    try {
      await store.loadUserRewards();
      fail('It should not reach this point');
    } catch (e) {
      // should not set the owner
      expect(store.owner).toEqual({ guid: '123123', name: 'someone' });
    }
  });

  it('should round a number', () => {
    // should round with the correct precision
    expect(store.round(2.345, 2)).toEqual(2.35);
    expect(store.round(2.342, 2)).toEqual(2.34);
    expect(store.round(2.3422, 3)).toEqual(2.342);
    expect(store.round(2.3426, 3)).toEqual(2.343);
  });

  it('should format the amount', () => {
    expect(store.formatAmount(12222.3333)).toEqual('12,222.333 tokens');
    expect(store.formatAmount(222.3333)).toEqual('222.333 tokens');
    expect(store.formatAmount(245)).toEqual('245 tokens');
  });

  it('should reset the obvservable values', () => {
    store.amount = 2;
    store.currency = 'usd';
    store.sending = true;
    store.owner = {};
    store.recurring = true;
    store.guid = '123123';
    store.showBtc = true;
    store.showCardselector = true;
    store.loaded = true;
    store.errors = [{ message: 'error' }];

    store.reset();

    // should reset all
    expect(store.amount).toEqual(1);
    expect(store.sending).toEqual(false);
    expect(store.showBtc).toEqual(false);
    expect(store.showCardselector).toEqual(false);
    expect(store.loaded).toEqual(false);
    expect(store.owner).toEqual(undefined);
    expect(store.currency).toEqual('tokens');
    expect(store.errors).toEqual([]);
    expect(store.recurring).toEqual(false);
    expect(store.guid).toEqual('');
  });

  it('should return if already sending', () => {
    store.sending = true;
    return expect(store.send()).resolves.toBeUndefined();
  });

  it('should send a wire', async () => {
    const fakeDone = { done: true };
    wireService.send.mockResolvedValue(fakeDone);

    expect.assertions(4);

    // should set sending in true
    when(
      () => store.sending,
      () => expect(store.sending).toEqual(true),
    );

    store.setOwner({ guid: '123123', name: 'someone' });

    const result = await store.send();

    // should return the service call result
    expect(result).toBe(fakeDone);

    // should set sending in false on finish
    expect(store.sending).toEqual(false);

    // should call the service
    expect(wireService.send).toBeCalledWith(
      {
        currency: 'tokens',
        amount: store.amount,
        guid: store.guid,
        owner: store.owner,
        offchain: true,
        recurring: store.recurring,
        paymentMethodId: '',
      },
      undefined,
    );
  });

  it('should throw on send a wire', async () => {
    const fakeDone = { done: true };
    wireService.send.mockRejectedValue(fakeDone);

    expect.assertions(3);
    try {
      // should set sending in true
      when(
        () => store.sending,
        () => expect(store.sending).toEqual(true),
      );

      store.setOwner({ guid: '123123', name: 'someone' });
      await store.send();
    } catch (e) {
      // should set sending in false on finish
      expect(store.sending).toEqual(false);
      // should call the service
      expect(wireService.send).toBeCalledWith(
        {
          currency: 'tokens',
          amount: store.amount,
          guid: store.guid,
          owner: store.owner,
          offchain: true,
          recurring: store.recurring,
          paymentMethodId: '',
        },
        undefined,
      );
    }
  });
});
