import web3Service from '../../../src/blockchain/services/Web3Service';
import mindsService from '../../../src/common/services/minds.service';
import BlockchainApiService from '../../../src/blockchain/BlockchainApiService';
import BlockchainWalletService from '../../../src/blockchain/wallet/BlockchainWalletService';
import web3 from 'web3';
import appStores from '../../../AppStores';
import ethjs from 'ethjs-signer';

jest.mock('web3');
jest.mock('ethjs-signer',() => {
  return {
    sign: jest.fn()
  }
});
jest.mock('../../../src/common/services/minds.service');
jest.mock('../../../src/blockchain/BlockchainApiService');
jest.mock('../../../src/blockchain/wallet/BlockchainWalletService');
jest.mock('../../../AppStores', () => {
  return {
    blockchainTransaction: {
      waitForApproval: jest.fn()
    }
  }
});

global.setTimeout = () => {
  return (cb, time) => cb();
};

/**
 * Blockchain web3 service
 */
describe('blockchain web3 service', () => {

  beforeEach(() => {
    web3Service.web3.utils.fromWei.mockClear();
    BlockchainWalletService.getCurrent.mockClear();
  });

  it('should create a wallet and return address and private key', () => {

    web3Service.web3.eth.accounts.create.mockReturnValue({address:'0x123123123', privateKey: 'myprivate'});

    const { address, privateKey } = web3Service.createWallet();

    // should return the contract
    expect(address).toEqual('0x123123123');

    // should fetch token contract from web3 service
    expect(privateKey).toEqual('myprivate');
  });

  it('should return null if the private is not given', () => {
    const result = web3Service.getAddressFromPK();

    // shoudl return null
    expect(result).toBe(null);
  });

  it('should return the address from the private key', () => {
    web3Service.web3.eth.accounts.privateKeyToAccount.mockReturnValue({address: '0x123123123'});

    const result = web3Service.getAddressFromPK('SomePrivateKey');

    // should prepend 0x and call the method
    expect(web3Service.web3.eth.accounts.privateKeyToAccount).toBeCalledWith('0xSomePrivateKey');

    // should return the address
    expect(result).toBe('0x123123123');
  });
  it('should return the address of the current wallet', async(done) => {
    BlockchainWalletService.getCurrent.mockResolvedValue({address: '0x321321321'})
    try {
      const address = await web3Service.getCurrentWalletAddress();

      // should return the address
      expect(address).toEqual('0x321321321');
      done();
    } catch(e) {
      done.fail(e);
    }
  });

  it('should return the balance of an address', async(done) => {
    web3Service.web3.eth.getBalance.mockResolvedValue(100000000000000000);
    web3Service.web3.utils.fromWei.mockReturnValue(1);
    try {
      const balance = await web3Service.getBalance('0x321321321');

      // should call web3 get balance method
      expect(web3Service.web3.eth.getBalance).toBeCalled();

      // should convert it to ether
      expect(web3Service.web3.utils.fromWei).toBeCalledWith(100000000000000000, 'ether');

      // should return the balance
      expect(balance.toString()).toEqual('1');
      done();
    } catch(e) {
      done.fail(e);
    }
  });

  it('should return a contract', async (done) => {

    const mindsSettings = {
      blockchain: {
        contractId: {
          abi: '123',
          address: '0x123123123'
        }
      }
    };

    mindsService.getSettings.mockResolvedValue(mindsSettings);

    const contract = await web3Service.getContract('contractId');

    // should be an instance of contract
    expect(contract).toBeInstanceOf(web3Service.web3.eth.Contract);
    // should have abi and address
    expect(contract.abi).toEqual(mindsSettings.blockchain.contractId.abi);
    expect(contract.address).toEqual(mindsSettings.blockchain.contractId.address);
    done();
  });

  it('should return the transaction options', async (done) => {
    BlockchainWalletService.getCurrent.mockResolvedValue({address: '0x321321321'})
    const opt = await web3Service.getTransactionOptions();

    // should return an obj with the address in the from property
    expect(opt).toEqual({from: '0x321321321'});
    done();
  });

  it('should return send signed transaction', async (done) => {

    const fakeSendOptions = {
      gasLimit: 100,
      gasPrice: 1,
      from: '0x222333444'
    };
    const fakeNonce = 10, fakeEncodedAbi = 'encodedAbi', fakeEstimatedGas = 1100,
      fakeLastBlock = {gasLimit: 1000};


    BlockchainWalletService.unlock.mockResolvedValue('0xmyPrivateKey');
    BlockchainWalletService.getCurrent.mockResolvedValue({address: '0x321321321'});
    web3Service.web3.eth.getBlock.mockResolvedValue(fakeLastBlock);
    web3Service.web3.utils.toWei.mockReturnValue(100000000);
    web3Service.web3.utils.toHex.mockReturnValue('FFFFFFFFFFFFFF');
    appStores.blockchainTransaction.waitForApproval.mockResolvedValue(fakeSendOptions);
    web3Service.web3.eth.getTransactionCount.mockResolvedValue(fakeNonce);
    ethjs.sign.mockReturnValue('SIGNEDTX');

    // mock web3 promievent
    web3Service.web3.eth.sendSignedTransaction.mockImplementation(() => {
      return {
        once: function(event, cb) {
          if(event == 'transactionHash') cb('txHASH');
          return this;
        }
      }
    });

    const method = {
      _parent: {
        options: {
          address: '0x999888777'
        }
      },
      estimateGas: jest.fn(),
      encodeABI: jest.fn(),
    }
    method.encodeABI.mockReturnValue(fakeEncodedAbi);
    method.estimateGas.mockResolvedValue(fakeEstimatedGas);

    // (FIX) replaced the wait method because runAlltimers doesn't work here
    web3Service.wait = jest.fn();
    web3Service.wait.mockResolvedValue(true);

    try {
      // call the tested method
      const {transactionHash} = await web3Service.sendSignedContractMethodWithValue(method, 11, 'Some fancy message');

      // should call unlock with the current address
      expect(BlockchainWalletService.unlock).toBeCalledWith('0x321321321');

      // should call estimage gas method
      expect(method.estimateGas).toBeCalledWith({
        from: '0x321321321',
        to: method._parent.options.address,
        gas: fakeLastBlock.gasLimit,
        value: 11,
      });

      // should call wait for approval
      expect(appStores.blockchainTransaction.waitForApproval).toBeCalledWith(
        method,
        'Some fancy message',
        {from: '0x321321321'},
        fakeEstimatedGas * 1.5,
        11
      );

      // should sign the transaction
      expect(ethjs.sign).toBeCalledWith({
        nonce: fakeNonce,
        from: fakeSendOptions.from,
        to: method._parent.options.address,
        data: fakeEncodedAbi,
        value: 'FFFFFFFFFFFFFF',
        gas: 'FFFFFFFFFFFFFF',
        gasPrice: 'FFFFFFFFFFFFFF',
      }, '0xmyPrivateKey');

      // should call web3 eth get transaction count
      expect(web3Service.web3.eth.getTransactionCount).toBeCalledWith(fakeSendOptions.from);

      // should send signed transaction
      expect(web3Service.web3.eth.sendSignedTransaction).toBeCalledWith('SIGNEDTX');

      // should return the transaction hash
      expect(transactionHash).toEqual('txHASH');
      done();
    } catch(e) {
      done.fail(e);
    }
  });
});