import blockchainTokenService from '../../../src/blockchain/services/BlockchainTokenService';
import web3Service from '../../../src/blockchain/services/Web3Service';
import fakeTokenContract from '../../../__mocks__/fake/blockchain/services/TokenContract';

jest.mock('web3');
jest.mock('../../../src/blockchain/services/Web3Service');

/**
 * Blockchain token service
 */
describe('blockchain token service', () => {

  beforeEach(() => {
    fakeTokenContract.methods.approve.mockClear();
    fakeTokenContract.methods.balanceOf.mockClear();
    web3Service.web3.utils.toWei.mockClear();
    web3Service.web3.utils.fromWei.mockClear();
    web3Service.getContract.mockClear();
    web3Service.getContract.mockResolvedValue(fakeTokenContract);
  });

  it('should return the token contract', async () => {

    const contract = await blockchainTokenService.getContract();

    // should return the contract
    expect(contract).toBe(fakeTokenContract);

    // should fetch token contract from web3 service
    expect(web3Service.getContract).toBeCalledWith('token');
  });

  it('should return the balance', async () => {
    // contract balance method mock
    const balanceMethod = {call: jest.fn()};
    balanceMethod.call.mockResolvedValue(10);

    fakeTokenContract.methods.balanceOf.mockReturnValue(balanceMethod);

    web3Service.web3.utils.fromWei.mockReturnValue(100);

    const result = await blockchainTokenService.balanceOf('1234');

    // should fetch token contract from web3 service
    expect(web3Service.getContract).toBeCalledWith('token');
    // should fetch token contract from web3 service
    expect( fakeTokenContract.methods.balanceOf).toBeCalledWith('1234');
    // should format balance in ether
    expect(web3Service.web3.utils.fromWei).toBeCalledWith(10, 'ether');
    // should return the balance
    expect(result).toEqual(100);
  });

  it('should approve transaction', async () => {

    const tokenApprove = '123456789';

    web3Service.web3.utils.toWei.mockReturnValue(100);
    web3Service.sendSignedContractMethod.mockResolvedValue({transactionHash: 'hash123'});
    fakeTokenContract.methods.approve.mockResolvedValue(tokenApprove);

    const txHash = await blockchainTokenService.increaseApproval('address', 10, 'message');

    // should format amount in ether
    expect(web3Service.web3.utils.toWei).toBeCalledWith('10', 'ether');
    // should call approve method
    expect(fakeTokenContract.methods.approve).toBeCalledWith('address', 100);
    // should call sendSignedContractMethod
    expect(web3Service.sendSignedContractMethod).toBeCalledWith(tokenApprove, 'Approve address to spend 10 tokens in the future. message');
    // should fetch token contract from web3 service
    expect(web3Service.getContract).toBeCalledWith('token');
    // should return the contract
    expect(txHash).toBe('hash123');
  });

  it('should encode params', async () => {
    const encoded = ['encoded'];
    web3Service.web3.eth.abi.encodeParameters.mockReturnValue(encoded);

    const params = [{ type: 'address', value: '0x123123123'},{ type: 'uint256', value: '2222222333232323' }];

    const result = blockchainTokenService.encodeParams(params);

    // should call the web3 encode method
    expect(web3Service.web3.eth.abi.encodeParameters).toBeCalledWith(["uint256", "uint256", "address", "uint256"], [128, 64, "0x123123123", "2222222333232323"]);

    // should return the encoded params
    expect(result).toBe(encoded);
  });
});