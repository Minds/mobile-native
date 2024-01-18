import CookieManager, { Cookie, Cookies } from '@react-native-cookies/cookies';
import { MINDS_URI } from '~/config/Config';

class CookieService {
  async get() {
    return CookieManager.get(MINDS_URI);
  }
  async set(cookie: Cookie) {
    return CookieManager.set(MINDS_URI, { path: '/', ...cookie });
  }
  async getCookie(key: string) {
    return (await CookieManager.get(MINDS_URI))?.[key]?.value;
  }
  async setFromCookies(cookies: Cookies) {
    return Promise.all(
      Object.keys(cookies).map(async key => this.set(cookies[key])),
    );
  }
  async clearByName(name: string) {
    return CookieManager.clearByName(MINDS_URI, name);
  }
}

export const cookieService = new CookieService();
export type { Cookies, Cookie };
