import { CAPTCHA_ENABLED_ENDPOINTS } from '~/config/Config';
import { friendlyCaptchaReference } from '../components/friendly-captcha/FriendlyCaptchaProvider';

const friendlyCaptchaInterceptor = async config => {
  if (!config.url) {
    return config;
  }

  const endpointConfig = CAPTCHA_ENABLED_ENDPOINTS.find(
    ({ url, method }) => url.test(config.url!) && method === config.method,
  );

  if (endpointConfig) {
    try {
      console.log('[ApiService] Checking captcha');
      const solution = await friendlyCaptchaReference?.solveAPuzzle(
        endpointConfig.origin,
      );
      console.log('[ApiService] Captcha solved with solution ', solution);
      // TODO: move to request header once backend supports it
      config.data.puzzle_solution = solution;
    } catch (e) {
      console.error(
        '[ApiService] Captcha failed for friendly captcha interceptor',
        e,
      );
    }
  }

  return config;
};

export default friendlyCaptchaInterceptor;
