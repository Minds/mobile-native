import {toJS, when} from 'mobx';

import BlockchainWalletStore from '../../../src/blockchain/wallet/BlockchainWalletStore';
import BlockchainApiService from '../../../src/blockchain/BlockchainApiService';
import BlockchainWalletService from '../../../src/blockchain/wallet/BlockchainWalletService';

jest.mock('../../../src/blockchain/BlockchainApiService');
jest.mock('../../../src/blockchain/wallet/BlockchainWalletService');

function mockAddresses(count) {
  return ([...Array(count)].map((_, i) => {
    return {address: '0x'+(++i), current: i === 2, privateKey: i > 5, alias: (i > 1 && i < 5) ? false : i.toString()}
  }));
}

/**
 * Blockchain wallet store
 */
describe('blockchain wallet store', () => {
  let store;
  beforeEach(() => {
    store = new BlockchainWalletStore();
    BlockchainWalletService.getAll.mockClear();
    BlockchainApiService.getWallet.mockClear();
  });

  it('should validate private key',() => {
    // should return true
    BlockchainWalletService.isValidPrivateKey.mockReturnValue(true);
    expect(store.canImport('0xSomeKey')).toBeTruthy();
    // should call the service method with the private key
    expect(BlockchainWalletService.isValidPrivateKey).toBeCalledWith('0xSomeKey');

    // should return false
    BlockchainWalletService.isValidPrivateKey.mockReturnValue(false);
    expect(store.canImport('0xSomeKey')).toBeFalsy();
  });

  it('should return signable wallets',() => {
    // set some fake wallets
    store.wallets = mockAddresses(10);

    // should return only the wallets with private keys
    expect(store.signableWallets.length).toEqual(5);
  });

  it('should list wallets',() => {
    // set some fake wallets
    store.wallets = mockAddresses(10);

    // should return only the wallets with private keys
    expect(store.getList(true).length).toEqual(5);

    // should return only the wallets with private keys and the offchain
    expect(store.getList(true, true).length).toEqual(6);
    expect(store.getList(true, true)[5].address).toEqual('offchain');

    // should return all the wallets
    expect(store.getList(false).length).toEqual(10);
    // should return all the wallets by default
    expect(store.getList().length).toEqual(10);
    // should return all the wallets and the offchain
    expect(store.getList(false, true).length).toEqual(11);
    expect(store.getList(false, true)[10].address).toEqual('offchain');
  });

  it('should list should return false if it is in progress',() => {
    store.inProgress = true;
    return expect (store.load()).resolves.toEqual(false);
  });

  it('should load the wallets', async() => {
    BlockchainWalletService.getAll.mockResolvedValue(mockAddresses(10));
    BlockchainApiService.getWallet.mockResolvedValue(null);

    await store.load();
    // should return 10 fake wallets in order
    return expect(toJS(store.wallets.length)).toEqual(10);
  });

  it('should load the wallets and mark as remote the correct wallet', async(done) => {
    BlockchainWalletService.getAll.mockResolvedValue(mockAddresses(10));
    BlockchainApiService.getWallet.mockResolvedValue('0x1');

    await store.load();

    // should return 10 fake wallets
    expect(store.wallets.length).toEqual(10);
    // should mark as remote and move it to the end
    expect(store.wallets[9].remote).toEqual(true);
    done();
  });

  it('should add remote wallet to the list if not exist', async(done) => {
    BlockchainWalletService.getAll.mockResolvedValue(mockAddresses(10));
    BlockchainApiService.getWallet.mockResolvedValue('0x11');

    await store.load();

    // should return 11 fake wallets
    expect(store.wallets.length).toEqual(11);
    // should add the remote wallet into the list
    expect(store.wallets[10]).toEqual({ address: '0x11', alias: 'Desktop', remote: true });
    done();
  });

  it('should force the load of wallets', async(done) => {
    BlockchainWalletService.getAll.mockResolvedValue(mockAddresses(10));
    BlockchainApiService.getWallet.mockResolvedValue('0x11');

    store.inProgress = true;

    await store.load(true);

    // should return 11 fake wallets
    expect(store.wallets.length).toEqual(11);
    // should add the remote wallet into the list
    expect(store.wallets[10]).toEqual({ address: '0x11', alias: 'Desktop', remote: true });
    done();
  });

  it('should set observable inProgress to true while loading', async(done) => {
    BlockchainWalletService.getAll.mockResolvedValue(mockAddresses(10));
    BlockchainApiService.getWallet.mockResolvedValue(null);

    expect.assertions(2);

    when(
      () => store.inProgress,
      // should be true while loading
      () => expect(store.inProgress).toEqual(true),
    );

    await store.load();

    // should be false at the end
    expect(store.inProgress).toEqual(false);
    done();
  });

  it('should import private key and then load the wallets with force in true', async(done) => {
    BlockchainWalletService.getAll.mockResolvedValue(mockAddresses(10));
    BlockchainWalletService.import.mockResolvedValue(true);

    const spy = jest.spyOn(store, 'load');
    await store.import('0xFakePrivateKey');

    // should call import with the pkey
    expect(BlockchainWalletService.import).toBeCalledWith('0xFakePrivateKey');
    // should load with force in true
    expect(spy).toBeCalledWith(true);

    done();
  });

  it('should return undefined if the address is not given on save', () => {
    return expect(store.save()).resolves.toBeUndefined();
  });

  it('should return undefined if the address doesnt start with 0x on save', () => {
    return expect(store.save('ax0x')).resolves.toBeUndefined();
  });

  it('should save private key and then load the wallets with force in true', async(done) => {
    BlockchainWalletService.getAll.mockResolvedValue(mockAddresses(10));
    BlockchainWalletService.set.mockResolvedValue(true);

    const spy = jest.spyOn(store, 'load');
    await store.save('0xFakeAddress', {alias:'myWallet'});

    // should save the wallet
    expect(BlockchainWalletService.set).toBeCalledWith('0xFakeAddress', {alias:'myWallet'});
    // should load with force in true
    expect(spy).toBeCalledWith(true);

    done();
  });

  it('should throw error if unlock fails on delete', () => {
    BlockchainWalletService.unlock.mockRejectedValue(new Error());

    return expect(store.delete('0xaddress')).rejects.toThrowError();
  });

  it('should throw error if unlock fails on delete', () => {
    BlockchainWalletService.unlock.mockRejectedValue(new Error());

    return expect(store.delete('0xaddress')).rejects.toThrowError();
  });

  it('should throw error if unlock return a false', () => {
    BlockchainWalletService.unlock.mockResolvedValue(false);

    return expect(store.delete('0xaddress')).rejects.toThrowError();
  });

  it('should delete the wallet and then load the wallets with force in true', async(done) => {
    BlockchainWalletService.getAll.mockResolvedValue(mockAddresses(10));
    BlockchainWalletService.unlock.mockResolvedValue(true);
    BlockchainWalletService.delete.mockResolvedValue(true);

    const spy = jest.spyOn(store, 'load');
    await store.delete('0xFakeAddress');

    // should delete the wallet
    expect(BlockchainWalletService.delete).toBeCalledWith('0xFakeAddress');
    // should load with force in true
    expect(spy).toBeCalledWith(true);

    done();
  });


  it('should delete clear data on reset', () => {
    store.inProgress = true;
    store.loaded = true;
    store.wallets = [{fake:'data'}];

    store.reset();

    expect(store.inProgress).toBe(false);
    expect(store.loaded).toBe(false);
    expect(toJS(store.wallets)).toEqual([]);
  });

  it('should return undefined on _DANGEROUS_wipe unconfirmed', () => {
    return expect(store._DANGEROUS_wipe(false)).resolves.toBeUndefined();
  });

  it('should swipe data and then load wallets with force in true',async(done) => {
    BlockchainWalletService._DANGEROUS_wipe.mockResolvedValue();
    const spy = jest.spyOn(store, 'load');

    try {
      await store._DANGEROUS_wipe(true);
    } catch(e) {
      done.fail(e);
    }

    // should call swipe method on the service
    expect(BlockchainWalletService._DANGEROUS_wipe).toBeCalledWith(true);
    // should load with force in true
    expect(spy).toBeCalledWith(true);
    done();
  });
});