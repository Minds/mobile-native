import bn from 'bn.js';

let Web3 = function () {
  jest.mockim;
  return {
    utils: {
      fromWei: jest.fn(),
      toWei: jest.fn(),
      isAddress: jest.fn(),
      toHex: jest.fn(),
      toBN: jest.fn().mockImplementation((v) => new bn(v)),
    },
    eth: {
      getBalance: jest.fn(),
      getBlock: jest.fn(),
      getTransactionCount: jest.fn(),
      sendSignedTransaction: jest.fn(),
      accounts: {
        create: jest.fn(),
        privateKeyToAccount: jest.fn(),
      },
      abi: {
        encodeParameters: jest.fn(),
      },
      Contract: function (abi, address) {
        this.abi = abi;
        this.address = address;
      },
    },
  };
};

Web3.providers = {
  HttpProvider: jest.fn(),
};

module.exports = Web3;
