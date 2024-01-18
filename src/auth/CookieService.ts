import CookieManager, { Cookie, Cookies } from '@react-native-cookies/cookies';
import { IS_IOS, MINDS_URI } from '~/config/Config';
const ANDROID = !IS_IOS;

class CookieService {
  async get() {
    return CookieManager.get(MINDS_URI);
  }
  async set(cookie: Cookie, flush: boolean = true) {
    return CookieManager.set(MINDS_URI, { path: '/', ...cookie })?.then(
      result => {
        ANDROID && flush && CookieManager.flush();
        return result;
      },
    );
  }
  async getCookie(key: string) {
    return (await CookieManager.get(MINDS_URI))?.[key]?.value;
  }
  async setFromCookies(cookies: Cookies) {
    return Promise.all(
      Object.keys(cookies).map(async key => this.set(cookies[key], false)),
    ).then(result => {
      ANDROID && CookieManager.flush();
      return result;
    });
  }
  async clearByName(name: string) {
    return CookieManager.clearByName(MINDS_URI, name)?.then(result => {
      ANDROID && CookieManager.flush();
      return result;
    });
  }
}

export const cookieService = new CookieService();
export type { Cookies, Cookie };
