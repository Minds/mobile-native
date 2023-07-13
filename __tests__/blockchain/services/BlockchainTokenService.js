import Web3 from 'web3';
import BlockchainTokenService from '../../../src/blockchain/v2/services/BlockchainTokenService';
import { createStore } from '../../../src/blockchain/v2/walletconnect/WalletConnectContext';
import fakeTokenContract from '../../../__mocks__/fake/blockchain/services/TokenContract';

jest.mock('web3');
jest.mock('../../../src/blockchain/v2/walletconnect/modal/registry');

/**
 * Blockchain token service
 */
// TODO: It is freezing the test suite. Fix in case it is used again in the future
xdescribe('blockchain token service', () => {
  let blockchainTokenService, wc;

  beforeEach(() => {
    wc = createStore();
    wc.setupProvider();

    blockchainTokenService = new BlockchainTokenService(wc.web3, wc);
    fakeTokenContract.methods.approve.mockClear();
    fakeTokenContract.methods.balanceOf.mockClear();

    wc.web3.utils.toWei.mockClear();
    wc.web3.utils.fromWei.mockClear();
    blockchainTokenService.getContract = jest.fn();
    blockchainTokenService.sendContractMethod = jest.fn();
    blockchainTokenService.getContract.mockResolvedValue(fakeTokenContract);
  });

  it('should return the balance', async () => {
    // contract balance method mock
    const balanceMethod = { call: jest.fn(), encodeABI: jest.fn() };
    balanceMethod.call.mockResolvedValue(10);

    fakeTokenContract.methods.balanceOf.mockReturnValue(balanceMethod);

    wc.web3.utils.fromWei.mockReturnValue(100);

    const result = await blockchainTokenService.balanceOf('1234');

    // should fetch token contract from web3 service
    expect(blockchainTokenService.getContract).toBeCalledWith('token');
    // should fetch token contract from web3 service
    expect(fakeTokenContract.methods.balanceOf).toBeCalledWith('1234');
    // should format balance in ether
    expect(wc.web3.utils.fromWei).toBeCalledWith(10, 'ether');
    // should return the balance
    expect(result).toEqual(100);
  });

  it('should approve transaction', async () => {
    const tokenApprove = '123456789';

    wc.web3.utils.toWei.mockReturnValue(100);
    blockchainTokenService.sendContractMethod.mockResolvedValue({
      transactionHash: 'hash123',
    });
    fakeTokenContract.methods.approve.mockResolvedValue(tokenApprove);

    const txHash = await blockchainTokenService.increaseApproval(
      'address',
      10,
      'message',
    );

    // should format amount in ether
    expect(wc.web3.utils.toWei).toBeCalledWith('10', 'ether');
    // should call approve method
    expect(fakeTokenContract.methods.approve).toBeCalledWith('address', 100);
    // should call sendContractMethod
    expect(blockchainTokenService.sendContractMethod).toBeCalled();
    // should fetch token contract from web3 service
    expect(blockchainTokenService.getContract).toBeCalledWith('token');
    // should return the contract
    expect(txHash).toBe('hash123');
  });

  it('should encode params', async () => {
    const encoded = ['encoded'];
    wc.web3.eth.abi.encodeParameters.mockReturnValue(encoded);

    const params = [
      { type: 'address', value: '0x123123123' },
      { type: 'uint256', value: '2222222333232323' },
    ];

    const result = BlockchainTokenService.encodeParams(params, wc.web3);

    // should call the web3 encode method
    expect(wc.web3.eth.abi.encodeParameters).toBeCalledWith(
      ['uint256', 'uint256', 'address', 'uint256'],
      [128, 64, '0x123123123', '2222222333232323'],
    );

    // should return the encoded params
    expect(result).toBe(encoded);
  });
});
