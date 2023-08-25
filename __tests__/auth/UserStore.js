import { whenWithTimeout } from 'mobx-utils';
import channelService from '../../src/channel/ChannelService';
import UserStore from '../../src/auth/UserStore';
import meFactory from '../../__mocks__/fake/auth/MeFactory';
import UserModel from '../../src/channel/UserModel';

jest.mock('../../src/channel/ChannelService');

// mock the static create method
// UserModel.create = jest.fn();

let store;

describe('user store', () => {
  beforeEach(() => {
    channelService.load.mockClear();
    // UserModel.create.mockClear();
    store = new UserStore();
  });

  it('should call channel service load and update me', async () => {
    expect.assertions(3);
    // fake api response
    const apiResponseFake = { channel: meFactory(1) };

    // mock methods called
    channelService.load.mockResolvedValue(apiResponseFake);
    // UserModel.create.mockReturnValue(apiResponseFake.channel);

    // me observable should be updated with the api returned data
    await whenWithTimeout(
      () => store.me.guid,
      () => expect(store.me.guid).toEqual(apiResponseFake.channel.guid),
      200,
      () => {
        throw new Error("store didn't set me observable");
      },
    );

    // me must be empty before call load
    expect(store.me.guid).toEqual('');

    const res = await store.load();

    // call api post one time
    expect(channelService.load).toBeCalledWith('me');
  });

  it('should create a new model on setUser', done => {
    expect.assertions(2);

    // fake user
    const fakeUser = meFactory(1);

    // me observable should be updated with the new user
    whenWithTimeout(
      () => store.me.guid,
      () => expect(store.me.guid).toEqual(fakeUser.guid),
      200,
      () => done.fail("store didn't set me observable"),
    );

    try {
      // me must be empty before call load
      expect(store.me.guid).toEqual('');

      const res = store.setUser(fakeUser);

      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('should set rewards on the observable', done => {
    expect.assertions(1);

    // fake user
    const fakeUser = meFactory(1);

    // me observable should be updated with the new user
    whenWithTimeout(
      () => store.me.rewards === true,
      () => expect(store.me.rewards).toEqual(true),
      200,
      () => done.fail("store didn't set me observable"),
    );

    try {
      // set the user
      store.setUser(fakeUser);
      // change reward
      store.setRewards(false);
      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('should set wallet on the observable', done => {
    try {
      // fake user
      const fakeUser = meFactory(1);

      // me observable should be updated with the new user
      whenWithTimeout(
        () => store.me.eth_wallet === '0xFFFFFFFF',
        () => done(),
        200,
        () => done.fail("store didn't set me observable"),
      );

      // set the user
      store.setUser(fakeUser);
      // change wallet
      store.setWallet('0xFFFFFFFF');
      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('should clear the user', done => {
    expect.assertions(1);

    // fake user
    const fakeUser = meFactory(1);

    try {
      // set the user
      store.setUser(fakeUser);

      // me observable should be updated with the new user
      whenWithTimeout(
        () => store.me.guid !== 1,
        () => expect(store.me.guid).toEqual(''),
        200,
        () => done.fail("store didn't set me observable"),
      );

      // clear
      store.clearUser();

      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('should clear the user on reset', done => {
    expect.assertions(1);

    // fake user
    const fakeUser = meFactory(1);

    try {
      // set the user
      store.setUser(fakeUser);

      // me observable should be updated with the new user
      whenWithTimeout(
        () => store.me.guid !== 1,
        () => expect(store.me.guid).toEqual(''),
        200,
        () => done.fail("store didn't set me observable"),
      );

      // clear
      store.reset();

      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('should returns if the user has rewards', done => {
    // fake user
    const fakeUser = meFactory(1);

    try {
      // set the user
      store.setUser(fakeUser);

      expect(store.hasRewards()).toEqual(true);

      store.setRewards(false);

      expect(store.hasRewards()).toEqual(false);

      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('should returns if the user has wallet', done => {
    // fake user
    const fakeUser = meFactory(1);

    try {
      // set the user
      store.setUser(fakeUser);

      expect(store.hasEthWallet()).toEqual(true);

      store.setWallet(null);

      expect(store.hasEthWallet()).toEqual(false);

      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('should returns if the user is admin', done => {
    // fake user
    const fakeUser = meFactory(2);
    fakeUser.is_admin = true;

    const entity = new UserModel();
    entity.assign(fakeUser);

    try {
      // set the user
      store.setUser(fakeUser);

      expect(store.isAdmin()).toEqual(true);

      done();
    } catch (e) {
      done(e);
    }
  });
});
