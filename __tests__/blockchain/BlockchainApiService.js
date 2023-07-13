import api from '../../src/common/services/api.service';
import BlockchainApiService from '../../src/blockchain/BlockchainApiService';

jest.mock('../../src/common/services/api.service');

/**
 * Blockchain api service
 */
describe('blockchain api service', () => {
  const fakeResponse = {
    wallet: {
      address: '0xMyWallet',
    },
  };
  const fakeRateResponse = {
    rate: 1.2,
  };

  beforeEach(() => {
    api.get.mockClear();
  });

  it('should return an error message', done => {
    api.get.mockRejectedValueOnce(new Error('Async error'));

    BlockchainApiService.getWallet(true)
      .then(() => {
        done.fail();
      })
      .catch(e => {
        // should throw an error with the following message
        expect(e.message).toEqual(
          'There was an issue getting your saved wallet info',
        );
        done();
      });
  });

  it('should return the wallet', async () => {
    api.get.mockResolvedValue(fakeResponse);

    const address = await BlockchainApiService.getWallet();

    // should return the address
    expect(address).toEqual(fakeResponse.wallet.address);
  });

  it('should return the cached wallet', async () => {
    api.get.mockClear();

    const address = await BlockchainApiService.getWallet();

    // should return the address
    expect(address).toEqual(fakeResponse.wallet.address);

    expect(api.get).not.toHaveBeenCalled();
  });

  it('should call the endpoint and set the wallet', async () => {
    api.post.mockClear();

    const address = '0xMyWallet';

    await BlockchainApiService.setWallet(address);

    // should call the endpoint
    expect(api.post).toBeCalledWith('api/v2/blockchain/wallet', { address });

    // should set the address
    expect(BlockchainApiService.serverWalletAddressCache).toEqual(address);
  });

  it('should return usd rate', async () => {
    const spy = jest.spyOn(BlockchainApiService, 'getRate');
    api.get.mockResolvedValue(fakeRateResponse);

    const rate = await BlockchainApiService.getUSDRate();

    // should call service getRate with empty string
    expect(spy).toBeCalledWith('');

    // should fetch the endpoint
    expect(api.get).toBeCalledWith('api/v2/blockchain/rate/');

    // should return the rate
    expect(rate).toEqual(fakeRateResponse.rate);
  });

  it('should return tokens rate', async () => {
    api.get.mockResolvedValue(fakeRateResponse);

    const rate = await BlockchainApiService.getRate('tokens');

    // should fetch the endpoint
    expect(api.get).toBeCalledWith('api/v2/blockchain/rate/tokens');

    // should return the rate
    expect(rate).toEqual(fakeRateResponse.rate);
  });
});
