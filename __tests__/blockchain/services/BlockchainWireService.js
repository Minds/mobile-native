import BlockchainTokenService from '../../../src/blockchain/v2/services/BlockchainTokenService';
import BlockchainWireService from '../../../src/blockchain/v2/services/BlockchainWireService';
import fakeTokenContract from '../../../__mocks__/fake/blockchain/services/TokenContract';
import fakeWireContract from '../../../__mocks__/fake/blockchain/services/WireContract';
import { createStore } from '../../../src/blockchain/v2/walletconnect/WalletConnectContext';

jest.mock('web3');
jest.mock('../../../src/blockchain/v2/walletconnect/modal/registry');

/**
 * Blockchain token service
 */
describe('blockchain wire service', () => {
  let blockchainTokenService, blockchainWireService, wc;

  BlockchainTokenService.encodeParams = jest.fn();

  beforeEach(() => {
    wc = createStore();
    wc.setupProvider();

    blockchainTokenService = new BlockchainTokenService(wc.web3, wc);
    blockchainWireService = new BlockchainWireService(wc.web3, wc);

    blockchainWireService.getContract = jest.fn();
    blockchainWireService.sendContractMethod = jest.fn();
    wc.web3.utils.fromWei.mockClear();
    blockchainWireService.getContract.mockResolvedValue(fakeWireContract);
    BlockchainTokenService.encodeParams.mockClear();
    fakeTokenContract.methods.approveAndCall.mockClear();
  });

  it('should create a wire', async () => {
    const amount = 1,
      fakeEncodedParams = 'encodedParams',
      fakeFormatedToWei = 100,
      fakeReceiver = 'guid',
      fakeTokenApproveAndCallBoost = 'fakeTokenApproveAndCallBoost',
      fakeResult = {
        transactionHash: '0x444444444',
      };

    blockchainWireService.getContract.mockResolvedValue(fakeTokenContract);
    wc.web3.utils.toWei.mockReturnValue(fakeFormatedToWei);
    blockchainWireService.sendContractMethod.mockReturnValue(fakeResult);
    BlockchainTokenService.encodeParams.mockReturnValue(fakeEncodedParams);
    fakeTokenContract.methods.approveAndCall.mockResolvedValue(
      fakeTokenApproveAndCallBoost,
    );

    // create the boost
    const result = await blockchainWireService.create(
      fakeReceiver,
      amount,
      'fromAddress',
    );

    // should call sendSignedContractMethod
    expect(blockchainWireService.sendContractMethod).toBeCalled();
    // should call encode params
    expect(BlockchainTokenService.encodeParams).toBeCalledWith(
      [{ type: 'address', value: fakeReceiver }],
      wc.web3,
    );
    // should call token approveAndCall
    expect(fakeTokenContract.methods.approveAndCall).toBeCalledWith(
      fakeWireContract.options.address,
      fakeFormatedToWei,
      fakeEncodedParams,
    );
    // should get the token contract
    expect(blockchainWireService.getContract).toBeCalled();
    // should return the tx hash
    expect(result).toBe(fakeResult.transactionHash);
  });
});
