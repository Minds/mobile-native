import blockchainTokenService from '../../../src/blockchain/services/BlockchainTokenService';
import blockchainBoostService from '../../../src/blockchain/services/BlockchainBoostService';
import web3Service from '../../../src/blockchain/services/Web3Service';
import mindsService from '../../../src/common/services/minds.service';
import fakeTokenContract from '../../../__mocks__/fake/blockchain/services/TokenContract';
import fakeBoostContract from '../../../__mocks__/fake/blockchain/services/BoostContract';


jest.mock('web3');
jest.mock('../../../src/blockchain/services/Web3Service');
jest.mock('../../../src/blockchain/services/BlockchainTokenService');
jest.mock('../../../src/common/services/minds.service');

/**
 * Blockchain token service
 */
describe('blockchain boost service', () => {

  const mindsSettings = {
    blockchain: {
      boost_wallet_address: '0x123123123'
    }
  };

  beforeEach(() => {
    mindsService.getSettings.mockClear();
    web3Service.getContract.mockClear();
    blockchainTokenService.getContract.mockClear();
    web3Service.web3.utils.fromWei.mockClear();
    web3Service.getContract.mockResolvedValue(fakeBoostContract);
    web3Service.sendSignedContractMethod.mockClear();
    blockchainTokenService.encodeParams.mockClear();
    fakeTokenContract.methods.approveAndCall.mockClear();
  });

  it('should return the boost contract', async () => {

    const contract = await blockchainBoostService.getContract();

    // should return the contract
    expect(contract).toBe(fakeBoostContract);

    // should fetch boost contract from web3 service
    expect(web3Service.getContract).toBeCalledWith('boost');
  });

  it('should create a boost', async () => {

    const amount = 1,
      fakeEncodedParams = 'encodedParams',
      fakeFormatedFromWei = 100,
      fakeGuid = 'guid',
      fakeChecksum = 'checksum',
      fakeTokenApproveAndCallBoost = 'fakeTokenApproveAndCallBoost',
      fakeResult = {
        transactionHash: '0x444444444'
      };

    blockchainTokenService.getContract.mockResolvedValue(fakeTokenContract);
    web3Service.web3.utils.fromWei.mockReturnValue(fakeFormatedFromWei);
    web3Service.sendSignedContractMethod.mockReturnValue(fakeResult);
    blockchainTokenService.encodeParams.mockReturnValue(fakeEncodedParams);
    fakeTokenContract.methods.approveAndCall.mockResolvedValue(fakeTokenApproveAndCallBoost);

    mindsService.getSettings.mockResolvedValue(mindsSettings);

    // create the boost
    const result = await blockchainBoostService.create(fakeGuid, amount, fakeChecksum, 'message');

    // should format the amount to ether
    expect(web3Service.web3.utils.fromWei).toBeCalledWith(amount, 'ether');
    // should call sendSignedContractMethod
    expect(web3Service.sendSignedContractMethod).toBeCalledWith(
      fakeTokenApproveAndCallBoost,
      `Network Boost for ${fakeFormatedFromWei} Minds Tokens. message`
    );

    // should call encode params
    expect(blockchainTokenService.encodeParams).toBeCalledWith([
      { type: 'address', value: mindsSettings.blockchain.boost_wallet_address },
      { type: 'uint256', value: fakeGuid },
      { type: 'uint256', value: fakeChecksum }
    ]);

    // should call token approveAndCall
    expect(fakeTokenContract.methods.approveAndCall).toBeCalledWith(
      fakeBoostContract.options.address,
      amount,
      fakeEncodedParams
    );
    // should get the token contract
    expect(blockchainTokenService.getContract).toBeCalled();
    // should return the tx hash
    expect(result).toBe(fakeResult.transactionHash);
  });

  it('should create a peer boost', async () => {

    const amount = 1,
      fakeEncodedParams = 'encodedParams',
      fakeFormatedFromWei = 100,
      fakeReceiver = 'receiver',
      fakeGuid = 'guid',
      fakeChecksum = 'checksum',
      fakeTokenApproveAndCallBoost = 'fakeTokenApproveAndCallBoost',
      fakeResult = {
        transactionHash: '0x444444444'
      };

    blockchainTokenService.getContract.mockResolvedValue(fakeTokenContract);
    web3Service.web3.utils.fromWei.mockReturnValue(fakeFormatedFromWei);
    web3Service.sendSignedContractMethod.mockReturnValue(fakeResult);
    blockchainTokenService.encodeParams.mockReturnValue(fakeEncodedParams);
    fakeTokenContract.methods.approveAndCall.mockResolvedValue(fakeTokenApproveAndCallBoost);

    mindsService.getSettings.mockResolvedValue(mindsSettings);

    // create the boost
    const result = await blockchainBoostService.createPeer(fakeReceiver, fakeGuid, amount, fakeChecksum, 'message');

    // should format the amount to ether
    expect(web3Service.web3.utils.fromWei).toBeCalledWith(amount, 'ether');
    // should call sendSignedContractMethod
    expect(web3Service.sendSignedContractMethod).toBeCalledWith(
      fakeTokenApproveAndCallBoost,
      `Channel Boost for ${fakeFormatedFromWei} Minds Tokens to ${fakeReceiver}. message`
    );

    // should call encode params
    expect(blockchainTokenService.encodeParams).toBeCalledWith([
      { type: 'address', value: fakeReceiver},
      { type: 'uint256', value: fakeGuid },
      { type: 'uint256', value: fakeChecksum }
    ]);

    // should call token approveAndCall
    expect(fakeTokenContract.methods.approveAndCall).toBeCalledWith(
      fakeBoostContract.options.address,
      amount,
      fakeEncodedParams
    );
    // should get the token contract
    expect(blockchainTokenService.getContract).toBeCalled();
    // should return the tx hash
    expect(result).toBe(fakeResult.transactionHash);
  });
});