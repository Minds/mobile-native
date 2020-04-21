//@ts-nocheck
export default {
  getSecret: jest.fn(),
  setSecretIfEmpty: jest.fn(),
  storeToCache: jest.fn(),
  hasSecret: jest.fn(),
  _DANGEROUS_wipe: jest.fn(),
};
