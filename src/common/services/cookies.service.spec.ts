import { MINDS_URI } from '~/config/Config';
import { cookieService, Cookie, Cookies } from './cookies.service';
import CookieManager from '@react-native-cookies/cookies';

describe('CookieService', () => {
  const testUri = MINDS_URI;
  const testCookie: Cookie = { name: 'testCookie', value: 'testValue' };
  const testCookies: Cookies = { testCookie };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get cookies', async () => {
    CookieManager.get = jest.fn().mockResolvedValue(testCookies);
    const cookies = await cookieService.get();
    expect(CookieManager.get).toHaveBeenCalledWith(testUri);
    expect(cookies).toEqual(testCookies);
  });

  it('should set a cookie', async () => {
    CookieManager.set = jest.fn().mockResolvedValue(testCookie);
    const result = await cookieService.set(testCookie);
    expect(CookieManager.set).toHaveBeenCalledWith(
      testUri,
      expect.objectContaining(testCookie),
    );
    expect(result).toEqual(testCookie);
  });

  it('should get a specific cookie by key', async () => {
    CookieManager.get = jest.fn().mockResolvedValue({ testCookie });
    const cookieValue = await cookieService.getCookie('testCookie');
    expect(CookieManager.get).toHaveBeenCalledWith(testUri);
    expect(cookieValue).toEqual('testValue');
  });

  it('should set multiple cookies from Cookies object', async () => {
    CookieManager.set = jest.fn().mockResolvedValue(testCookies);
    const result = await cookieService.setFromCookies(testCookies);
    expect(CookieManager.set).toHaveBeenCalledTimes(
      Object.keys(testCookies).length,
    );
    expect(result).toHaveLength(Object.keys(testCookies).length);
  });

  it('should clear a cookie by name', async () => {
    CookieManager.clearByName = jest.fn().mockResolvedValue(true);
    const result = await cookieService.clearByName('testCookie');
    expect(CookieManager.clearByName).toHaveBeenCalledWith(
      testUri,
      'testCookie',
    );
    expect(result).toBe(true);
  });
});
