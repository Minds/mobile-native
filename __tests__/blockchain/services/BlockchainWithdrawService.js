import blockchainWithdrawService from '../../../src/blockchain/services/BlockchainWithdrawService';
import web3Service from '../../../src/blockchain/services/Web3Service';

jest.mock('web3');
jest.mock('../../../src/blockchain/services/Web3Service');

/**
 * Blockchain withdraw service
 */
describe('blockchain withdraw service', () => {

  const fakeWithdrawContract = {
    methods: {
      request: jest.fn()
    }
  }

  beforeEach(() => {
    web3Service.getContract.mockClear();
    web3Service.web3.utils.fromWei.mockClear();
    web3Service.web3.utils.toWei.mockClear();
    web3Service.getContract.mockResolvedValue(fakeWithdrawContract);
    web3Service.sendSignedContractMethodWithValue.mockClear();
  });

  it('should return the withdraw contract', async () => {

    const contract = await blockchainWithdrawService.getContract();

    // should return the contract
    expect(contract).toBe(fakeWithdrawContract);

    // should fetch boost contract from web3 service
    expect(web3Service.getContract).toBeCalledWith('withdraw');
  });

  it('should request a withdraw', async () => {

    const amount = 1,
      fakeFormatedToWei = 100,
      fakeFormatedFromWei = 101,
      fakeGuid = 'guid',
      withdrawRequest = 'withdrawRequest',
      fakeCurrentAddress = '0xCurrentAddress',
      fakeResult = {
        transactionHash: '0x444444444'
      };

    web3Service.web3.utils.toWei.mockReturnValue(fakeFormatedToWei);
    web3Service.web3.utils.fromWei.mockReturnValue(fakeFormatedFromWei);
    web3Service.getCurrentWalletAddress.mockReturnValue(fakeCurrentAddress);
    web3Service.sendSignedContractMethodWithValue.mockReturnValue(fakeResult);
    fakeWithdrawContract.methods.request.mockResolvedValue(withdrawRequest);

    // create the boost
    const result = await blockchainWithdrawService.request(fakeGuid, amount, 'message');

    // should format the amount to ether
    expect(web3Service.web3.utils.toWei).toBeCalledWith(amount.toString(), 'ether');
    // should format gas price
    expect(web3Service.web3.utils.toWei).toHaveBeenLastCalledWith('1', 'Gwei');

    // should call request method of the contract
    expect(fakeWithdrawContract.methods.request).toBeCalledWith(fakeGuid, fakeFormatedToWei);

    // should call sendSignedContractMethod
    expect(web3Service.sendSignedContractMethodWithValue).toBeCalledWith(
      withdrawRequest,
      167839 * fakeFormatedToWei,
      `Request a withdrawal of ${amount} Minds Tokens. ${fakeFormatedFromWei.toString()} ETH will be transferred to cover the gas fee. If you send a low amount of gas fee, your withdrawal may fail. message`
    );
    // should return the tx hash, address, amount and gas
    expect(result).toEqual({
      address: fakeCurrentAddress,
      amount: fakeFormatedToWei.toString(),
      tx: fakeResult.transactionHash,
      gas: (167839 * fakeFormatedToWei).toString(),
    });
  });
});