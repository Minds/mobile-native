import { SubscriptionProService } from './subscription.pro.service'; // Replace with the correct import path
import { ApiService } from './api.service'; // Replace with the correct import path

jest.mock('./api.service'); // Mock the API service
// @ts-ignore
const api = new ApiService() as jest.Mocked<ApiService>;

describe('SubscriptionProService', () => {
  let mockApiResponse;
  let subscriptionProService: SubscriptionProService;

  beforeEach(() => {
    subscriptionProService = new SubscriptionProService(api);
    mockApiResponse = {
      expires: 4833978931,
      has_subscription: false,
      isActive: true,
      status: 'success',
    };

    api.get = jest.fn().mockResolvedValue(mockApiResponse);
    api.delete = jest.fn().mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should check if the subscription is active', async () => {
    const isActive = await subscriptionProService.isActive();
    expect(isActive).toBe(true);
    expect(api.get).toHaveBeenCalledWith('api/v2/pro');
  });

  it('should check if the user has a subscription from cache', async () => {
    const hasSubscription = await subscriptionProService.hasSubscription();
    expect(hasSubscription).toBe(false);
  });

  it('should check if the user has a subscription', async () => {
    subscriptionProService.cachedResponse = undefined;
    const hasSubscription = await subscriptionProService.hasSubscription();

    expect(hasSubscription).toBe(false);
    expect(api.get).toHaveBeenCalledWith('api/v2/pro'); // Since isActive() is called internally
  });

  it('should get the expiration date', async () => {
    subscriptionProService.cachedResponse = undefined;
    const expirationDate = await subscriptionProService.expires();
    expect(expirationDate).toBe(4833978931);
    expect(api.get).toHaveBeenCalledWith('api/v2/pro'); // Since isActive() is called internally
  });

  it('should disable the Pro subscription', async () => {
    const disabled = await subscriptionProService.disable();
    expect(disabled).toBe(true);
    expect(api.delete).toHaveBeenCalledWith('api/v2/pro');
  });

  it('should get the expiry string', async () => {
    await subscriptionProService.isActive();
    const expiryString = subscriptionProService.expiryString;
    expect(expiryString).toBe('7:55pm on Mar 8th, 2123');
  });
});
