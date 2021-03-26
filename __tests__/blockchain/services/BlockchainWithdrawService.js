import BlockchainWithdrawService from '../../../src/blockchain/v2/services/BlockchainWithdrawService';
import { createStore } from '../../../src/blockchain/v2/walletconnect/WalletConnectContext';
jest.mock('web3');
jest.mock('../../../src/blockchain/v2/walletconnect/modal/registry');

/**
 * Blockchain withdraw service
 */
describe('blockchain withdraw service', () => {
  const fakeWithdrawContract = {
    methods: {
      request: jest.fn(),
    },
  };

  let wc, blockchainWithdrawService;

  beforeEach(() => {
    wc = createStore();
    wc.setupProvider();
    wc.web3.utils.fromWei.mockClear();
    wc.web3.utils.toWei.mockClear();

    blockchainWithdrawService = new BlockchainWithdrawService(wc.web3, wc);
    blockchainWithdrawService.getContract = jest.fn();
    blockchainWithdrawService.getContract.mockResolvedValue(
      fakeWithdrawContract,
    );
    blockchainWithdrawService.sendContractMethodWithValue = jest.fn();
  });

  it('should request a withdraw', async () => {
    const amount = 1,
      fakeFormattedToWei = 100,
      fakeFormattedFromWei = 101,
      fakeGuid = 'guid',
      withdrawRequest = 'withdrawRequest',
      fakeCurrentAddress = '0xCurrentAddress',
      fakeResult = {
        transactionHash: '0x444444444',
      };

    wc.web3.utils.toWei.mockReturnValue(fakeFormattedToWei);
    wc.web3.utils.fromWei.mockReturnValue(fakeFormattedFromWei);
    blockchainWithdrawService.sendContractMethodWithValue.mockReturnValue(
      fakeResult,
    );
    fakeWithdrawContract.methods.request.mockResolvedValue(withdrawRequest);

    // create the boost
    const result = await blockchainWithdrawService.request(
      fakeGuid,
      amount,
      fakeCurrentAddress,
    );

    // should format the amount to ether
    expect(wc.web3.utils.toWei).toBeCalledWith(amount.toString(), 'ether');
    // should format gas price
    expect(wc.web3.utils.toWei).toHaveBeenLastCalledWith('1', 'Gwei');

    // should call request method of the contract
    expect(fakeWithdrawContract.methods.request).toBeCalledWith(
      fakeGuid,
      fakeFormattedToWei,
    );

    // should call sendSignedContractMethod
    expect(blockchainWithdrawService.sendContractMethodWithValue).toBeCalled();
    // should return the tx hash, address, amount and gas
    expect(result).toEqual({
      address: fakeCurrentAddress,
      amount: fakeFormattedToWei.toString(),
      tx: fakeResult.transactionHash,
      gas: (167839 * fakeFormattedToWei).toString(),
    });
  });
});
