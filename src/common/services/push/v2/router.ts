import sessionService from './../../session.service';
import AuthService from '../../../../auth/AuthService';
import { APP_URI } from '../../../../config/Config';
import deeplinksRouterService from '../../deeplinks-router.service';
import logService from '../../log.service';

/**
 * Push Router
 */
export const router = {
  navigate: (data: any) => {
    try {
      let callback;
      if (data?.uri && data.uri.startsWith(APP_URI)) {
        callback = () => deeplinksRouterService.navigate(data.uri);
      } else {
        callback = () =>
          deeplinksRouterService.navigate(`${APP_URI}notifications/`);
      }

      if (
        data?.user_guid &&
        sessionService.activeIndex !==
          sessionService.getIndexSessionFromGuid(data.user_guid)
      ) {
        AuthService.loginWithGuid(data?.user_guid, () => {
          setTimeout(callback, 700);
        });
      } else {
        callback();
      }
    } catch (err) {
      logService.exception('[Push Router Navigate', err);
    }
  },
};
