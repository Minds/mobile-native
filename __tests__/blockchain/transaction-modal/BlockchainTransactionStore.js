import {toJS, when} from 'mobx';

import BlockchainTransactionStore from '../../../src/blockchain/transaction-modal/BlockchainTransactionStore';
import BlockchainWalletService from '../../../src/blockchain/wallet/BlockchainWalletService';
import BlockchainApiService from '../../../src/blockchain/BlockchainApiService';
import Web3Service from '../../../src/blockchain/services/Web3Service';


jest.mock('../../../src/blockchain/wallet/BlockchainWalletService');
jest.mock('../../../src/blockchain/BlockchainApiService');
jest.mock('../../../src/blockchain/services/Web3Service');

function mockAddresses(count) {
  return ([...Array(count)].map((_, i) => {
    return {address: '0x'+(++i), current: i === 2, privateKey: i > 5, alias: (i > 1 && i < 5) ? false : i.toString()}
  }));
}

/**
 * Blockchain transaction store
 */
describe('blockchain transaction store', () => {
  let store;
  beforeEach(() => {
    store = new BlockchainTransactionStore();
    BlockchainWalletService.getFunds.mockClear();
  });

  it('should reset all the observables', () => {

    store.isApproving = true;
    store.approvalMessage = 'some message';
    store.approval = void 0;
    store.baseOptions = {
      someOption: ''
    };
    store.estimateGasLimit = 22222;
    store.funds = 1;
    store.gweiPriceCents = 2;
    store.weiValue = 123;

    store.reset();

    // should reset the data
    expect(store.isApproving).toBe(false);
    expect(store.approvalMessage).toBe('');
    expect(store.approval).toBe(void 0);
    expect(store.baseOptions).toEqual({});
    expect(store.estimateGasLimit).toBe(0);
    expect(store.funds).toBe(null);
    expect(store.gweiPriceCents).toBe(null);
    expect(store.weiValue).toBe(0);
  });

  it('should get gwei price in dolars', async (done) => {
    BlockchainApiService.getUSDRate.mockResolvedValue(2);
    Web3Service.web3.utils.fromWei.mockReturnValue(1000000000);
    await store.getGweiPriceCents();

    try {
      expect(store.gweiPriceCents).toEqual(2e-7);
    } catch(e) {
      done.fail(e);
    }
    done();
  });

  it('should return if gwei price in dolars returns null', async (done) => {
    BlockchainApiService.getUSDRate.mockResolvedValue(null);

    await store.getGweiPriceCents();

    try {
      expect(store.gweiPriceCents).toEqual(null);
    } catch(e) {
      done.fail(e);
    }
    done();
  });

  it('should refresh founds', async(done) => {
    BlockchainWalletService.getFunds.mockResolvedValue(1);

    try {
      store.baseOptions.from = '0xfakeaddress';
      await store.refreshFunds();
      expect(BlockchainWalletService.getFunds).toBeCalled();
      expect(store.funds).toEqual(1);
    } catch(e) {
      done.fail(e);
    }
    done();
  });

  it('should cancel refresh if from is not set on baseOptions', async(done) => {
    BlockchainWalletService.getFunds.mockResolvedValue(1);

    try {
      store.baseOptions.from = null;
      await store.refreshFunds();
      expect(BlockchainWalletService.getFunds).not.toBeCalled();
      expect(store.funds).toEqual(null);
    } catch(e) {
      done.fail(e);
    }
    done();
  });

  it('should clear values on reject', () => {

    store.isApproving = true;
    store.approvalMessage = 'some message';
    store.approval = true;
    store.baseOptions = {someOption:1};
    store.estimateGasLimit = 2;
    store.funds = 2;
    store.gweiPriceCents = 1;
    store.weiValue = 1;

    store.rejectTransaction();

    // should clear
    expect(store.isApproving).toBe(false);
    expect(store.approvalMessage).toBe('');
    expect(store.approval).toBe(false);
    expect(store.baseOptions).toEqual({});
    expect(store.estimateGasLimit).toBe(0);
    expect(store.funds).toBe(null);
    expect(store.gweiPriceCents).toBe(null);
    expect(store.weiValue).toBe(0);
  });

  it('should clear values and set approval', () => {
    store.isApproving = true;
    store.approvalMessage = 'some message';
    store.approval = true;
    store.estimateGasLimit = 2;
    store.funds = 2;
    store.gweiPriceCents = 1;
    store.weiValue = 1;

    store.baseOptions.someBaseOption = 3;

    store.approveTransaction({data1: 1, data2: 2});

    // shold clear and set approval with base option and data merged
    expect(store.isApproving).toBe(false);
    expect(store.approvalMessage).toBe('');
    expect(store.approval).toEqual({data1: 1, data2: 2, someBaseOption:3});
    expect(store.baseOptions).toEqual({});
    expect(store.estimateGasLimit).toBe(0);
    expect(store.funds).toBe(null);
    expect(store.gweiPriceCents).toBe(null);
    expect(store.weiValue).toBe(0);
  });

  it('should throw error if already approving', () => {
    store.isApproving = true;
    return expect(store.waitForApproval(null, 'some message')).rejects.toThrowError('Already approving a transaction');
  });

  it('should return value on approval', async(done) => {
    BlockchainApiService.getUSDRate.mockResolvedValue(2);
    Web3Service.web3.utils.fromWei.mockReturnValue(1000000000);
    BlockchainWalletService.getFunds.mockResolvedValue(1);

    try {
      const promise = store.waitForApproval(null, 'some message');
      // approve
      store.approveTransaction({some: 1});

      // should finish after approval
      expect(await promise).toEqual({some: 1});
    } catch(e) {
      done.fail(e);
    }
    done();
  });

  it('should return value on approval with all params', async(done) => {
    BlockchainApiService.getUSDRate.mockResolvedValue(2);
    Web3Service.web3.utils.fromWei.mockReturnValue(1000000000);
    BlockchainWalletService.getFunds.mockResolvedValue(1);

    try {
      const promise = store.waitForApproval(null, 'some message', {}, 1 , 2);
      // approve
      store.approveTransaction({some: 1});

      // should finish after approval
      expect(await promise).toEqual({some: 1});
    } catch(e) {
      done.fail(e);
    }
    done();
  });

  it('should return false on approval', async(done) => {
    BlockchainApiService.getUSDRate.mockResolvedValue(2);
    Web3Service.web3.utils.fromWei.mockReturnValue(1000000000);
    BlockchainWalletService.getFunds.mockResolvedValue(1);

    try {
      const promise = store.waitForApproval(null, 'some message');
      // approve
      store.approveTransaction();

      // should finish after approval
      expect(await promise).toEqual({});
    } catch(e) {
      done.fail(e);
    }
    done();
  });

})