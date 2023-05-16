import BlockchainTokenService from '../../../src/blockchain/v2/services/BlockchainTokenService';
import BlockchainBoostService from '../../../src/blockchain/v2/services/BlockchainBoostService';
import mindsService from '../../../src/common/services/minds-config.service';
import fakeTokenContract from '../../../__mocks__/fake/blockchain/services/TokenContract';
import fakeBoostContract from '../../../__mocks__/fake/blockchain/services/BoostContract';
import { createStore } from '../../../src/blockchain/v2/walletconnect/WalletConnectContext';

jest.mock('web3');
jest.mock('../../../src/common/services/minds-config.service');
jest.mock('../../../src/blockchain/v2/walletconnect/modal/registry');

/**
 * Blockchain token service
 */
// TODO: It is freezing the test suite. Fix in case it is used again in the future
xdescribe('blockchain boost service', () => {
  const mindsSettings = {
    blockchain: {
      boost_wallet_address: '0x123123123',
      boost: {
        address: '0x22222222',
        abi: {},
      },
    },
  };

  let blockchainTokenService, blockchainBoostService, wc;

  BlockchainTokenService.encodeParams = jest.fn();

  beforeEach(() => {
    wc = createStore();
    wc.setupProvider();

    blockchainTokenService = new BlockchainTokenService(wc.web3, wc);
    blockchainBoostService = new BlockchainBoostService(wc.web3, wc);
    mindsService.getSettings.mockClear();
    blockchainBoostService.getContract = jest.fn();
    blockchainBoostService.sendContractMethod = jest.fn();
    wc.web3.utils.fromWei.mockClear();
    blockchainBoostService.getContract.mockResolvedValue(fakeBoostContract);
    BlockchainTokenService.encodeParams.mockClear();
    fakeTokenContract.methods.approveAndCall.mockClear();
  });

  it('should create a boost', async () => {
    const amount = 1,
      fakeEncodedParams = 'encodedParams',
      fakeFormatedFromWei = 100,
      fakeGuid = 'guid',
      fakeChecksum = '123213123',
      fakeTokenApproveAndCallBoost = 'fakeTokenApproveAndCallBoost',
      fakeResult = {
        transactionHash: '0x444444444',
      };

    // blockchainTokenService.getContract.mockResolvedValue(fakeTokenContract);
    blockchainBoostService.getContract.mockResolvedValue(fakeTokenContract);
    wc.web3.utils.fromWei.mockReturnValue(fakeFormatedFromWei);
    blockchainBoostService.sendContractMethod.mockReturnValue(fakeResult);
    BlockchainTokenService.encodeParams.mockReturnValue(fakeEncodedParams);
    fakeTokenContract.methods.approveAndCall.mockResolvedValue(
      fakeTokenApproveAndCallBoost,
    );

    mindsService.getSettings.mockReturnValue(mindsSettings);

    // create the boost
    const result = await blockchainBoostService.create(
      fakeGuid,
      amount,
      fakeChecksum,
      'message',
    );

    // should call sendSignedContractMethod
    expect(blockchainBoostService.sendContractMethod).toBeCalled();

    // should call encode params
    expect(BlockchainTokenService.encodeParams).toBeCalledWith(
      [
        {
          type: 'address',
          value: mindsSettings.blockchain.boost_wallet_address,
        },
        { type: 'uint256', value: fakeGuid },
        { type: 'uint256', value: '4884345123' },
      ],
      wc.web3,
    );

    // should call token approveAndCall
    expect(fakeTokenContract.methods.approveAndCall).toBeCalledWith(
      fakeBoostContract.options.address,
      amount,
      fakeEncodedParams,
    );
    // should get the token contract
    expect(blockchainBoostService.getContract).toBeCalled();
    // should return the tx hash
    expect(result).toBe(fakeResult.transactionHash);
  });

  it('should create a peer boost', async () => {
    const amount = 1,
      fakeEncodedParams = 'encodedParams',
      fakeFormatedFromWei = 100,
      fakeReceiver = 'receiver',
      fakeGuid = 'guid',
      fakeChecksum = '123123',
      fakeTokenApproveAndCallBoost = 'fakeTokenApproveAndCallBoost',
      fakeResult = {
        transactionHash: '0x444444444',
      };

    blockchainBoostService.getContract.mockResolvedValue(fakeTokenContract);
    wc.web3.utils.fromWei.mockReturnValue(fakeFormatedFromWei);
    blockchainBoostService.sendContractMethod.mockReturnValue(fakeResult);
    BlockchainTokenService.encodeParams.mockReturnValue(fakeEncodedParams);
    fakeTokenContract.methods.approveAndCall.mockResolvedValue(
      fakeTokenApproveAndCallBoost,
    );

    mindsService.getSettings.mockResolvedValue(mindsSettings);

    // create the boost
    const result = await blockchainBoostService.createPeer(
      fakeReceiver,
      fakeGuid,
      amount,
      fakeChecksum,
      'message',
    );

    // should call sendSignedContractMethod
    expect(blockchainBoostService.sendContractMethod).toBeCalled();

    // should call token approveAndCall
    expect(fakeTokenContract.methods.approveAndCall).toBeCalledWith(
      fakeBoostContract.options.address,
      amount,
      fakeEncodedParams,
    );
    // should get the token contract
    expect(blockchainBoostService.getContract).toBeCalled();
    // should return the tx hash
    expect(result).toBe(fakeResult.transactionHash);
  });
});
