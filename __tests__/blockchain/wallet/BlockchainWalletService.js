import appStores from '../../../AppStores';
import StorageService from '../../../src/common/services/storage.service';
import Web3Service from '../../../src/blockchain/services/Web3Service';
import BlockchainTokenService from '../../../src/blockchain/services/BlockchainTokenService';
import KeychainService from '../../../src/common/services/keychain.service';
import api from '../../../src/common/services/api.service';
import noExponents from '../../../src/common/helpers/no-exponents';

// we import the class not the instance
import { BlockchainWalletService } from '../../../src/blockchain/wallet/BlockchainWalletService';

jest.mock('../../../AppStores', () => {
  return {
    blockchainWalletSelector: {
      waitForSelect: jest.fn()
    }
  }
});

jest.mock('../../../src/common/services/storage.service');
jest.mock('../../../src/blockchain/services/Web3Service');
jest.mock('../../../src/blockchain/services/BlockchainTokenService');
jest.mock('../../../src/common/services/keychain.service');
jest.mock('../../../src/common/services/api.service');
jest.mock('../../../src/common/helpers/no-exponents');

/**
 * Blockchain wallet service
 */
describe('blockchain wallet service', () => {

  let blockchainWalletService;

  beforeEach(() => {
    StorageService.getItem.mockClear();
    StorageService.setItem.mockClear();
    StorageService.hasItem.mockClear();
    Web3Service.web3.utils.isAddress.mockClear();
    blockchainWalletService = new BlockchainWalletService();
  });

  it('should load the current wallet from the storage on init', async () => {
    StorageService.getItem.mockReturnValueOnce('0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B3');
    StorageService.getItem.mockReturnValueOnce([{address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B3", current: false, privateKey: true}]);
    StorageService.hasItem.mockReturnValueOnce(true);


    await blockchainWalletService.init();

    expect(blockchainWalletService.current).toEqual({address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B3", current: false, privateKey: true});
  });

  it('should validate address', () => {
    Web3Service.web3.utils.isAddress.mockReturnValueOnce(true);
    Web3Service.web3.utils.isAddress.mockReturnValueOnce(false);

    // should return false if the address is not given
    expect(blockchainWalletService.isValidAddress()).toEqual(false);

    // should return true
    expect(blockchainWalletService.isValidAddress('0xSomeAddress')).toEqual(true);

    // should call web3 is address
    expect(Web3Service.web3.utils.isAddress).toBeCalledWith('0xSomeAddress');

    // should return false
    expect(blockchainWalletService.isValidAddress('0xSomeAddress')).toEqual(false);

    // should call web3 is address
    expect(Web3Service.web3.utils.isAddress).toBeCalledWith('0xSomeAddress');
  });

  it('should normalize private key', () => {

    // should throw error if the private key is not given
    expect( () => blockchainWalletService.normalizePrivateKey() ).toThrowError();

    // should throw error if the private key is not a string
    expect( () => blockchainWalletService.normalizePrivateKey(123) ).toThrowError();

    // should convert to lowecase
    expect( blockchainWalletService.normalizePrivateKey('0xAbc123123') ).toEqual('0xabc123123');

    // should add 0x if necessary
    expect( blockchainWalletService.normalizePrivateKey('Abc123123') ).toEqual('0xabc123123');
  });

  it('should validate private key', () => {

    // should return false if the private key is not given
    expect( blockchainWalletService.isValidPrivateKey()).toEqual(false);

    // should return false if the private key is too short
    expect( blockchainWalletService.isValidPrivateKey('72684b92d352cbad07f544217a644f62a619a73cd216373335333e160b3990') ).toEqual(false);

    Web3Service.getAddressFromPK.mockReturnValueOnce('0xb49894C3E3C721D9933f7b0ABCD3aAAA9F04e7A3');
    // should return true if the private key is valid
    expect( blockchainWalletService.isValidPrivateKey('72684b92d352cbad07f544217a644f62a619a73cd216373335333e160b399120') ).toEqual(true);

  });

  it('should get all the wallets from the storage', async(done) => {
    const fakeWallets = [
      {address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B3", current: false},
      {address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B4", current: false}
    ];

    StorageService.getItem.mockReturnValueOnce(fakeWallets);
    StorageService.hasItem.mockReturnValueOnce(true);
    StorageService.hasItem.mockReturnValueOnce(false);

    const wallets = await blockchainWalletService.getAll();

    StorageService.getItem.mockReturnValueOnce(fakeWallets);
    StorageService.hasItem.mockReturnValueOnce(true);
    StorageService.hasItem.mockReturnValueOnce(false);

    blockchainWalletService.current = {address:'0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B4'};
    const walletsCurrent = await blockchainWalletService.getAll();

    // should return wallets
    expect(wallets).toEqual(fakeWallets);
    // should mark the second wallet as the current
    expect(walletsCurrent[1].current).toEqual(true);

    done();
  });

  it('should get a single wallet from the storage', async(done) => {
    const fakeWallets = [
      {address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B3", current: false},
      {address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B4", current: false}
    ];

    StorageService.getItem.mockReturnValue(fakeWallets);
    StorageService.hasItem.mockReturnValue(true);

    try {
      const wallet = await blockchainWalletService.get('0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B3');
      const noWallet = await blockchainWalletService.get('0x754bad6873e690DB74dDB0BdF5D59C6dd391c710');

      // should return the wallet
      expect(wallet.address).toEqual('0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B3');

      // should return undefined if the wallet is not in the list
      expect(noWallet).toBeUndefined();
    } catch(e) {
      done.fail();
    }

    done();
  });

  it('should throw error on call set without the address', async(done) => {

    try {
      // should throw error if the  address is not given
      await blockchainWalletService.set('');
      done.fail();
    } catch(e) {
      done();
    }

  });

  it('should throw error on call set and the address is not in the list', async(done) => {
    const fakeWallets = [
      {address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B3", current: false},
      {address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B4", current: false}
    ];

    StorageService.getItem.mockReturnValue(fakeWallets);
    StorageService.hasItem.mockReturnValue(true);

    try {
      // should throw error if the  address is not given
      await blockchainWalletService.set('0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B6');
      done.fail();
    } catch(e) {
      done();
    }
  });

  it('should set the wallet alias', async(done) => {
    const fakeWallets = [
      {address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B3", current: false},
      {address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B4", current: false}
    ];

    const fakeParams = [
      {address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B3", current: false},
      {address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B4", current: false, alias: 'Alias'}
    ];

    StorageService.getItem.mockReturnValue(fakeWallets);
    StorageService.hasItem.mockReturnValue(true);

    // should throw error if the  address is not given
    await blockchainWalletService.set('0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B4', {alias: 'Alias'});

    expect(StorageService.setItem).toBeCalledWith(
      'BlockchainWallet:wallets',
      fakeParams
    );

    done();
  });

  it('should throw error on call delete without the address', async(done) => {


    try {
      // should throw error if the address is not given
      await blockchainWalletService.delete();
      done.fail();
    } catch(e) {
      done();
    }
  });

  it('should throw error on call delete and the address is not in the list', async(done) => {
    const fakeWallets = [
      {address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B3", current: false},
      {address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B4", current: false}
    ];

    StorageService.getItem.mockReturnValue(fakeWallets);
    StorageService.hasItem.mockReturnValue(true);

    try {
      // should throw error if the  address is not given
      await blockchainWalletService.delete('0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B6');
      done.fail();
    } catch(e) {
      done();
    }
  });

  it('should delete the wallet and store the new list', async(done) => {
    const fakeWallets = [
      {address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B3", current: false},
      {address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B4", current: false}
    ];

    StorageService.getItem.mockReturnValue(fakeWallets);
    StorageService.hasItem.mockReturnValue(true);
    StorageService.removeItem.mockResolvedValue(true);


    try {
      // should throw error if the  address is not given
      await blockchainWalletService.delete('0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B4');

      // should store the wallets
      expect(StorageService.setItem).toBeCalledWith(
        'BlockchainWallet:wallets',
        fakeWallets
      );

      // should remove a wallet from the list
      expect(fakeWallets.length).toEqual(1);

      done();
    } catch(e) {
      done.fail();
    }
  });

  it('should get the current wallet if already set', async (done) => {
    const fakeAddress = {address: 'someAddress'};
    blockchainWalletService.current = fakeAddress;

    const result = await blockchainWalletService.getCurrent();

    // should return the current wallet
    expect(result).toEqual(fakeAddress);

    done();
  });

  it('should call selectCurrent if the current wallet if not set', async (done) => {
    const fakePayload = {wallet:{address:'0xwallet'}, type:'onchain'};
    blockchainWalletService.selectCurrent = jest.fn().mockResolvedValue(fakePayload)

    const result = await blockchainWalletService.getCurrent();

    // should return the payload wallet
    expect(result).toEqual(fakePayload.wallet);
    // should set the current wallet
    expect(result).toEqual(blockchainWalletService.current);

    done();
  });

  it('should throw an error if get current is canceled', async (done) => {
    const fakePayload = null;
    blockchainWalletService.selectCurrent = jest.fn().mockResolvedValue(fakePayload)

    try {
      await blockchainWalletService.getCurrent();
      done.fail();
    } catch(e) {
      done()
    }
  });

  it('should throw error on call unlock without the address', async(done) => {
    try {
      // should throw error if the address is not given
      await blockchainWalletService.unlock();
      done.fail();
    } catch(e) {
      done();
    }
  });

  it('should throw error if unlock fails', () => {
    StorageService.getItem.mockResolvedValue(null);

    return expect(blockchainWalletService.unlock('0xaddress')).rejects.toThrowError('E_CANNOT_UNLOCK_WALLET');
  });

  it('should return the private key after unlock ', async(done) => {

    const fakePrivate = '0xPrivate';

    StorageService.getItem.mockResolvedValue(fakePrivate);

    const privateKey = await blockchainWalletService.unlock('0xFakeAddress');

    // should return the private key
    expect(privateKey).toEqual(fakePrivate);

    done();
  });

  it('should select current wallet', async(done) => {
    appStores.blockchainWalletSelector.waitForSelect.mockResolvedValueOnce(null);
    appStores.blockchainWalletSelector.waitForSelect.mockResolvedValueOnce({type:'offchain', wallet:{}});
    appStores.blockchainWalletSelector.waitForSelect.mockResolvedValueOnce({type:'onchain', wallet:{address:'0xMywallet'}});
    StorageService.setItem.mockResolvedValue(true);

    const result = await blockchainWalletService.selectCurrent('message', {some:'option'});

    // should call waitForSelect with message
    expect(appStores.blockchainWalletSelector.waitForSelect).toBeCalledWith('message', {some:'option'});

    // should return cancelled result
    expect(result.type).toEqual('');
    expect(result.cancelled).toEqual(true);

    const resultOffchain = await blockchainWalletService.selectCurrent('message');

    // should return offchain
    expect(resultOffchain.type).toEqual('offchain');
    expect(resultOffchain.wallet).toBeTruthy();

    const resultOnchain = await blockchainWalletService.selectCurrent('message');

    // should return onchain
    expect(resultOnchain.type).toEqual('onchain');
    expect(resultOnchain.wallet).toBeTruthy();

    // should save the onchain
    expect(StorageService.setItem).toBeCalled();

    // should set the current
    expect(blockchainWalletService.current.address).toEqual('0xMywallet');

    done();
  });

  it('should set the current wallet', async(done) => {
    const fakeWallets = [
      {address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B3", current: false},
      {address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B4", current: false}
    ];

    StorageService.getItem.mockReturnValue(fakeWallets);

    // should return undefined if address is not given
    expect(await blockchainWalletService.setCurrent()).toBeUndefined();

    // should return undefined if address is not in the wallet list
    expect(await blockchainWalletService.setCurrent('0x384bad6873e690DB74dDB0BdF5D59C6dd391c745')).toBeUndefined();

    StorageService.setItem.mockResolvedValue(true);

    // should return the wallet address on success
    expect(
      await blockchainWalletService.setCurrent('0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B4')
    ).toEqual('0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B4');

    // should store the current address
    expect(StorageService.setItem).toBeCalledWith(
      'BlockchainWallet:currentWalletAddress',
      '0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B4'
    );

    done();
  });

  it('should restore the current wallet from storage', async(done) => {
    const fakeAddress = '0xSomeAddress';

    StorageService.getItem.mockReturnValue(null);

    // should return undefined if address is not stored
    expect(await blockchainWalletService.restoreCurrentFromStorage()).toBeUndefined();


    StorageService.getItem.mockClear();
    StorageService.getItem.mockReturnValue(fakeAddress);
    blockchainWalletService.setCurrent = jest.fn().mockResolvedValue(fakeAddress);

    await blockchainWalletService.restoreCurrentFromStorage();

    // should call setCurrent with the address
    expect(blockchainWalletService.setCurrent).toBeCalledWith(fakeAddress);

    done();
  });

  it('should throw an error creating a new wallet if there are already >= 20 wallets', () => {

    const tooManyFakeWallets = ([...Array(20)].map((_, i) => {
      return {address: '0x'+(++i), current: false}
    }))

    StorageService.getItem.mockReturnValue(tooManyFakeWallets);

    // should throw an error if there ara to many wallets (>= 20)
    return expect(blockchainWalletService.create()).rejects.toThrowError('E_TOO_MANY_WALLETS');
  });

  it('should create the wallet if there are less than 20 wallets', () => {

    const tooManyFakeWallets = ([...Array(19)].map((_, i) => {
      return {address: '0x'+(++i), current: false}
    }))

    StorageService.getItem.mockReturnValue(tooManyFakeWallets);
    Web3Service.createWallet.mockReturnValueOnce({address: '0xFakeAddress', privateKey: '0xFakePrivate'});
    // should works with one less
    return expect(blockchainWalletService.create()).resolves.toEqual('0xFakeAddress');
  });

  it('should throw an error if the created wallet already exists', async(done) => {
    const fakeWallets = [
      {address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B3", current: false},
      {address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B4", current: false}
    ];

    const fakeCreatedWallet = {
      address: '0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B4',
      privateKey: '0xFakePrivate'
    };

    StorageService.getItem.mockResolvedValue(fakeWallets);
    Web3Service.createWallet.mockReturnValueOnce(fakeCreatedWallet);

    // should throw an error if already exist
    expect(blockchainWalletService.create()).rejects.toEqual({message:'E_ALREADY_EXISTS'});

    done();
  });

  it('should return the address and save the new wallet after it is created', async(done) => {

    const fakeWallets = [
      {address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B3", current: false},
      {address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B4", current: false}
    ];

    const fakeCreatedWallet = {
      address: '0x6873eDB74dDB0BdF5D5340BdF5D59C6dd391c7B4',
      privateKey: '0xFakePrivate'
    };

    StorageService.getItem.mockResolvedValue(fakeWallets);
    Web3Service.createWallet.mockReturnValue(fakeCreatedWallet);

    const result = await blockchainWalletService.create();

    // should return the new address
    expect(result).toEqual(fakeCreatedWallet.address);

    // should save the private key
    expect(StorageService.setItem).toHaveBeenCalledWith(
      `BlockchainWallet:wallet:${fakeCreatedWallet.address.toLowerCase()}:privateKey`,
      fakeCreatedWallet.privateKey,
      true,
      'wallet'
    );

    // should add the new wallet
    expect(fakeWallets.length).toEqual(3);

    // should save the list with the new wallet added
    expect(StorageService.setItem).toHaveBeenCalledWith(
      `BlockchainWallet:wallets`,
      fakeWallets
    );

    done();
  });

  it('should throw an error importing a new wallet if there are already >= 20 wallets', () => {

    const tooManyFakeWallets = ([...Array(20)].map((_, i) => {
      return {address: '0x'+(++i), current: false}
    }))

    // validate the private key
    blockchainWalletService.isValidPrivateKey = jest.fn().mockReturnValue(true);

    StorageService.getItem.mockReturnValue(tooManyFakeWallets);

    // should throw an error if there ara to many wallets (>= 20)
    return expect(blockchainWalletService.import('0xMyPrivate')).rejects.toThrowError('E_TOO_MANY_WALLETS');
  });

  it('should throw an error importing if the private is not valid', () => {
    // the private key isinvalid!
    blockchainWalletService.isValidPrivateKey = jest.fn().mockReturnValue(false);

    // should throw an error if the private key is invalid
    return expect(blockchainWalletService.import('0xMyPrivate')).rejects.toThrowError('E_INVALID_PRIVATE_KEY');
  });

  it('should throw an error if the imported wallet already exists', () => {
    const fakeWallets = [
      {address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B3", current: false},
      {address: "0x754bad6873e690DB74dDB0BdF5D59C6dd391c7B4", current: false}
    ];

    blockchainWalletService.isValidPrivateKey = jest.fn().mockReturnValue(true);
    StorageService.getItem.mockResolvedValue(fakeWallets);
    // import an existing wallet!
    Web3Service.getAddressFromPK.mockReturnValue(fakeWallets[0].address);

    // should throw an error if already exist
    return expect(blockchainWalletService.import('0xfakeprivate')).rejects.toThrowError('E_ALREADY_EXISTS');
  });

  it('should save the new wallet on import', async(done) => {

    const fakePrivate = '72684b92d352cbad07f544217a644f62a619a73cd216373335333e160b3990';
    const fakeAddress = '0xb49894C3E3C721D9933f7b0ABCD3aAAA9F04e7A3';
    // the private key is valid!
    blockchainWalletService.isValidPrivateKey = jest.fn().mockReturnValue(true);
    Web3Service.getAddressFromPK.mockReturnValue(fakeAddress);
    StorageService.getItem.mockReturnValue([]);

    const result = await blockchainWalletService.import(fakePrivate);

    // should save the private key
    expect(StorageService.setItem).toHaveBeenCalledWith(
      `BlockchainWallet:wallet:${fakeAddress.toLowerCase()}:privateKey`,
      `0x${fakePrivate}`, // normalized
      true,
      'wallet'
    );

    // should save the list with the new wallet added
    expect(StorageService.setItem).toHaveBeenCalledWith(
      `BlockchainWallet:wallets`,
      [{address: fakeAddress}]
    );

    // should return true on success
    expect(result).toEqual(true);

    done();
  });

  it('should get the wallet founds and store it on cache', async(done) => {

    const fakeFunds = {
      tokens: 1,
      eth: 0,
      timestamp: Date.now()
    };

    /**
     * offchain
     */
    blockchainWalletService.getOffchainFunds = jest.fn().mockResolvedValue(fakeFunds);

    const result = await blockchainWalletService.getFunds('offchain');

    // should return the wallet found
    expect(result).toEqual(fakeFunds);

    blockchainWalletService.getOffchainFunds.mockClear();
    const resultCached = await blockchainWalletService.getFunds('offchain');

    // should return cached value
    expect(resultCached).toEqual(result);

    blockchainWalletService.getOffchainFunds.mockResolvedValue(fakeFunds);
    const resultForced = await blockchainWalletService.getFunds('offchain', true);

    // should return cached value
    expect(resultForced).toEqual(fakeFunds);
    expect(blockchainWalletService.getOffchainFunds).toBeCalled();

    /**
     * onchain
     */
    blockchainWalletService.getOnchainFunds = jest.fn().mockResolvedValue(fakeFunds);

    const resultOn = await blockchainWalletService.getFunds('onchain');

    // should return the wallet found
    expect(resultOn).toEqual(fakeFunds);

    blockchainWalletService.getOnchainFunds.mockClear();
    const resultOnCached = await blockchainWalletService.getFunds('onchain');

    // should return cached value
    expect(resultOnCached).toEqual(resultOn);

    blockchainWalletService.getOnchainFunds.mockResolvedValue(fakeFunds);
    const resultOnForced = await blockchainWalletService.getFunds('onchain', true);

    // should return cached value
    expect(resultOnForced).toEqual(fakeFunds);
    expect(blockchainWalletService.getOnchainFunds).toBeCalled();

    done();
  });

  it('should get the onchain wallet founds', async(done) => {
    BlockchainTokenService.balanceOf.mockResolvedValue(1);
    Web3Service.getBalance.mockResolvedValue(1);

    const result = await blockchainWalletService.getOnchainFunds('0xAddress');

    expect(result.tokens).toEqual(1);
    expect(result.eth).toEqual(1);
    done();
  });

  it('should get the offchain wallet founds', async(done) => {
    const fakeApiResponse = {
      addresses: [
        {balance:1},
        {balance:2000000}
      ]
    };

    api.get.mockResolvedValue(fakeApiResponse);
    Web3Service.getBalance.mockResolvedValue(1);
    Web3Service.web3.utils.fromWei.mockReturnValue(2);

    const result = await blockchainWalletService.getOffchainFunds();

    // should return 2 tokens
    expect(result.tokens).toEqual(2);
    // should return 0 eth
    expect(result.eth).toEqual(0);
    // should call noExponents with
    expect(noExponents).toBeCalledWith(2000000);
    done();
  });

  it('should not swipe with not confirmation', () => {
    // should return undefined if confirmation is false
    return expect(blockchainWalletService._DANGEROUS_wipe(false)).resolves.toBeUndefined();
  });

  it('should swipe storage', async(done) => {

    KeychainService._DANGEROUS_wipe.mockResolvedValue();
    StorageService.getKeys.mockResolvedValue(['key1','key2']);

    await blockchainWalletService._DANGEROUS_wipe(true);

    // should swipe keychain
    expect(KeychainService._DANGEROUS_wipe).toBeCalledWith(true, 'wallet');
    // should remove keys
    expect(StorageService.removeItem).toHaveBeenCalledWith('key1');
    expect(StorageService.removeItem).toHaveBeenCalledWith('key2');

    done();
  });

});
