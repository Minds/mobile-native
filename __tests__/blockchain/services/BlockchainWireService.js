import blockchainTokenService from '../../../src/blockchain/services/BlockchainTokenService';
import blockchainWireService from '../../../src/blockchain/services/BlockchainWireService';
import web3Service from '../../../src/blockchain/services/Web3Service';
import fakeTokenContract from '../../../__mocks__/fake/blockchain/services/TokenContract';
import fakeWireContract from '../../../__mocks__/fake/blockchain/services/WireContract';


jest.mock('web3');
jest.mock('../../../src/blockchain/services/Web3Service');
jest.mock('../../../src/blockchain/services/BlockchainTokenService');

/**
 * Blockchain token service
 */
describe('blockchain wire service', () => {

  beforeEach(() => {
    web3Service.getContract.mockClear();
    blockchainTokenService.getContract.mockClear();
    web3Service.web3.utils.fromWei.mockClear();
    web3Service.getContract.mockResolvedValue(fakeWireContract);
    web3Service.sendSignedContractMethod.mockClear();
    blockchainTokenService.encodeParams.mockClear();
    fakeTokenContract.methods.approveAndCall.mockClear();
  });

  it('should return the wire contract', async () => {

    const contract = await blockchainWireService.getContract();

    // should return the contract
    expect(contract).toBe(fakeWireContract);

    // should fetch boost contract from web3 service
    expect(web3Service.getContract).toBeCalledWith('wire');
  });

  it('should create a wire', async () => {

    const amount = 1,
      fakeEncodedParams = 'encodedParams',
      fakeFormatedToWei = 100,
      fakeReceiver = 'guid',
      fakeTokenApproveAndCallBoost = 'fakeTokenApproveAndCallBoost',
      fakeResult = {
        transactionHash: '0x444444444'
      };

    blockchainTokenService.getContract.mockResolvedValue(fakeTokenContract);
    web3Service.web3.utils.toWei.mockReturnValue(fakeFormatedToWei);
    web3Service.sendSignedContractMethod.mockReturnValue(fakeResult);
    blockchainTokenService.encodeParams.mockReturnValue(fakeEncodedParams);
    fakeTokenContract.methods.approveAndCall.mockResolvedValue(fakeTokenApproveAndCallBoost);

    // create the boost
    const result = await blockchainWireService.create(fakeReceiver, amount, 'message');

    // should format the amount to ether
    expect(web3Service.web3.utils.toWei).toBeCalledWith(amount.toString(), 'ether');
    // should call sendSignedContractMethod
    expect(web3Service.sendSignedContractMethod).toBeCalledWith(
      fakeTokenApproveAndCallBoost,
      `Send ${amount} Minds Tokens to ${fakeReceiver}. message`
    );
    // should call encode params
    expect(blockchainTokenService.encodeParams).toBeCalledWith([
      { type: 'address', value: fakeReceiver }
    ]);
    // should call token approveAndCall
    expect(fakeTokenContract.methods.approveAndCall).toBeCalledWith(
      fakeWireContract.options.address,
      fakeFormatedToWei,
      fakeEncodedParams
    );
    // should get the token contract
    expect(blockchainTokenService.getContract).toBeCalled();
    // should return the tx hash
    expect(result).toBe(fakeResult.transactionHash);
  });

});