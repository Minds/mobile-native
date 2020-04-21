export default {
  web3: {
    utils: {
      fromWei: jest.fn(),
      toWei: jest.fn(),
      isAddress: jest.fn(),
    },
    eth: {
      abi: {
        encodeParameters: jest.fn(),
      },
    },
  },
  createWallet: jest.fn(),
  getAddressFromPK: jest.fn(),
  getCurrentWalletAddress: jest.fn(),
  getBalance: jest.fn(),
  getContract: jest.fn(),
  getTransactionOptions: jest.fn(),
  sendSignedContractMethod: jest.fn(),
  sendSignedContractMethodWithValue: jest.fn(),
};
