import api from '../../src/common/services/api.service';
import BlockchainWireService from '../../src/blockchain/services/BlockchainWireService';
import BlockchainTokenService from '../../src/blockchain/services/BlockchainTokenService';
import BlockchainWalletService from '../../src/blockchain/wallet/BlockchainWalletService';
import WireService from '../../src/wire/WireService';

jest.mock('../../src/common/services/api.service');
jest.mock('../../src/blockchain/services/BlockchainWireService');
jest.mock('../../src/blockchain/services/BlockchainTokenService');
jest.mock('../../src/blockchain/wallet/BlockchainWalletService');

/**
 * Wire service
 */
describe('wire service', () => {

  beforeEach(() => {
    api.get.mockClear();
    api.post.mockClear();
    BlockchainWalletService.selectCurrent.mockClear();
    BlockchainWireService.create.mockClear();
  });

  it('it should unlock an activity and return it', async (done) => {
    const fakeActivity = {activity: {guid: 'fakeActivity'}};

    api.get.mockResolvedValue(fakeActivity);

    try {
      const result = await WireService.unlock('123412341234');
      expect(api.get).toBeCalledWith('api/v1/wire/threshold/123412341234');
      expect(result).toEqual(fakeActivity.activity);
    } catch(e) {
      done.fail(e);
    }
    done();
  });

  it('it should unlock an entity and return it', async (done) => {
    const fakeEntity = {entity: {guid: 'fakeEntity'}};

    api.get.mockResolvedValue(fakeEntity);

    try {
      const result = await WireService.unlock('123412341234');
      expect(api.get).toBeCalledWith('api/v1/wire/threshold/123412341234');
      expect(result).toEqual(fakeEntity.entity);
    } catch(e) {
      done.fail(e);
    }
    done();
  });

  it('it should return false if unlock fails', async (done) => {
    const fakeEntity = {};

    api.get.mockResolvedValue(fakeEntity);

    try {
      const result = await WireService.unlock('123412341234');
      expect(api.get).toBeCalledWith('api/v1/wire/threshold/123412341234');
      expect(result).toEqual(false);
    } catch(e) {
      done.fail(e);
    }
    done();
  });

  it('it should get overview', async (done) => {
    const guid = '123412341234';
    const fakeResponse = {};

    api.get.mockResolvedValue(fakeResponse);

    try {
      const result = await WireService.overview(guid);
      expect(api.get).toBeCalledWith(`api/v1/wire/sums/overview/${guid}?merchant=1`);
      expect(result).toBe(fakeResponse);
    } catch(e) {
      done.fail(e);
    }
    done();
  });

  it('it should get user rewards', async (done) => {
    const guid = '123412341234';
    const fakeResponse = {};

    api.get.mockResolvedValue(fakeResponse);

    try {
      const result = await WireService.userRewards(guid);
      expect(api.get).toBeCalledWith(`api/v1/wire/rewards/${guid}/entity`);
      expect(result).toBe(fakeResponse);
    } catch(e) {
      done.fail(e);
    }
    done();
  });

  it('it should get user rewards', async (done) => {
    const guid = '123412341234';
    const fakeResponse = {
      wire_rewards: {
        rewards: {
          type1: [{}],
          type2: [{}]
        }
      }
    };

    api.get.mockResolvedValue(fakeResponse);

    try {
      const result = await WireService.rewards(guid);
      // should call the wire rewards endpoint
      expect(api.get).toBeCalledWith(`api/v1/wire/rewards/${guid}`);
      // should return mapped data
      expect(result).toEqual({"type1": [{"type": "type1"}], "type2": [{"type": "type2"}]});
    } catch(e) {
      done.fail(e);
    }
    done();
  });

  it('it should return undefined if send is canceled', () => {

    const fakePayload = {
      cancelled: true
    };

    BlockchainWalletService.selectCurrent.mockResolvedValue(fakePayload);

    return expect(WireService.send({amount: 1})).resolves.toBeUndefined();
  });

  it('it should send credit card wire', async(done) => {

    const fakePayload = {
      type: 'creditcard',
      token: 10
    };

    api.post.mockResolvedValue({postresult: 1});

    BlockchainWalletService.selectCurrent.mockResolvedValue(fakePayload);

    try {
      const result = await WireService.send({amount: 1, guid: 123123123});

      // expect post to be called with the payload
      expect(api.post).toBeCalledWith(`api/v1/wire/123123123`, {
        amount: 1,
        method: 'tokens',
        payload: {
          address: 'offchain',
          method: 'creditcard',
          token: 10
        },
        recurring: false
      });

      // expect to return the post result with the payload added
      expect(result).toEqual({
        postresult: 1,
        payload: {
          address: 'offchain',
          method: 'creditcard',
          token: 10
        }
      });

    } catch(e) {
      done.fail(e);
    }
    done();
  });

  it('it should send offchain wire', async(done) => {

    const fakePayload = {
      type: 'offchain',
    };

    api.post.mockResolvedValue({postresult:1});

    BlockchainWalletService.selectCurrent.mockResolvedValue(fakePayload);

    try {
      const result = await WireService.send({amount: 1, guid: 123123123});

      // expect post to be called with the payload
      expect(api.post).toBeCalledWith(`api/v1/wire/123123123`, {
        amount: 1,
        method: 'tokens',
        payload: {
          method: 'offchain',
          address: 'offchain'
        },
        recurring: false
      });

      // expect to return the post result with the payload added
      expect(result).toEqual({
        postresult: 1,
        payload: {
          method: 'offchain',
          address: 'offchain'
        }
      });

    } catch(e) {
      done.fail(e);
    }
    done();
  });

  it('it should send onchain wire', async(done) => {

    const fakePayload = {
      type: 'onchain',
      wallet: {
        address: '0xSource'
      }
    };

    api.post.mockResolvedValue({postresult:1});

    BlockchainWalletService.selectCurrent.mockResolvedValue(fakePayload);
    BlockchainWireService.create.mockResolvedValue('0xtxhash');

    try {
      const result = await WireService.send({amount: 1, guid: 123123123, owner: {eth_wallet: '0xaddress'}});

      // expect post to be called with the payload
      expect(api.post).toBeCalledWith(`api/v1/wire/123123123`, {
        amount: 1,
        method: 'tokens',
        payload: {
          method: 'onchain',
          address: fakePayload.wallet.address,
          receiver: '0xaddress',
          txHash: '0xtxhash'
        },
        recurring: false
      });

      // expect to return the post result with the payload added
      expect(result).toEqual({
        postresult: 1,
        payload: {
          method: 'onchain',
          address: fakePayload.wallet.address,
          receiver: '0xaddress',
          txHash: '0xtxhash'
        }
      });

    } catch(e) {
      done.fail(e);
    }
    done();
  });

  it('it should send onchain recurring wire', async(done) => {

    const fakePayload = {
      type: 'onchain',
      wallet: {
        address: '0xSource'
      }
    };

    api.post.mockResolvedValue({postresult:1});

    BlockchainWalletService.selectCurrent.mockResolvedValue(fakePayload);
    BlockchainWireService.create.mockResolvedValue('0xtxhash');
    BlockchainWireService.getContract.mockResolvedValue({options: {address: '0xrecurring'}});
    BlockchainTokenService.increaseApproval.mockResolvedValue(true);

    try {
      const result = await WireService.send({amount: 1,recurring: true, guid: 123123123, owner: {eth_wallet: '0xaddress'}});

      // expect post to be called with the payload
      expect(api.post).toBeCalledWith(`api/v1/wire/123123123`, {
        amount: 1,
        method: 'tokens',
        payload: {
          method: 'onchain',
          address: fakePayload.wallet.address,
          receiver: '0xaddress',
          txHash: '0xtxhash'
        },
        recurring: true
      });

      // expect to request recurring approval
      expect(BlockchainTokenService.increaseApproval).toBeCalledWith(
        '0xrecurring',
        11,
        'We need you to pre-approve Minds Wire wallet for the recurring wire transactions.'
      );

      // expect to return the post result with the payload added
      expect(result).toEqual({
        postresult: 1,
        payload: {
          method: 'onchain',
          address: fakePayload.wallet.address,
          receiver: '0xaddress',
          txHash: '0xtxhash'
        }
      });

    } catch(e) {
      done.fail(e);
    }
    done();
  });

  it('should throw error when try to send without an address', () => {
    return expect(WireService.send({amount: 1, guid: 123123123, owner: {eth_wallet: null}}))
      .rejects.toThrowError('User cannot receive OnChain tokens because they haven\'t setup an OnChain address. Please retry OffChain.');
  });

  it('should throw error when receive a unexpected type', () => {
    // return an unexpected payload type
    BlockchainWalletService.selectCurrent.mockResolvedValue({type: 'unexpected'});

    return expect(WireService.send({amount: 1, guid: 123123123, owner: {eth_wallet: '0xsome'}}))
      .rejects.toThrowError('Unknown type');
  });

});