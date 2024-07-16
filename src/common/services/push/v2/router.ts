import { APP_URI } from '~/config/Config';
import sp from '~/services/serviceProvider';

/**
 * Push Router
 */
export const router = {
  navigate: (data: any) => {
    try {
      let callback;
      if (data?.uri && data.uri.startsWith(APP_URI)) {
        callback = () => sp.resolve('deepLinks').navigate(data.uri);
      } else {
        callback = () =>
          sp.resolve('deepLinks').navigate(`${APP_URI}notifications/`);
      }

      if (
        data?.user_guid &&
        sp.session.activeIndex !==
          sp.session.getIndexSessionFromGuid(data.user_guid)
      ) {
        sp.resolve('auth').loginWithGuid(data?.user_guid, () => {
          setTimeout(callback, 700);
        });
      } else {
        callback();
      }
    } catch (err) {
      sp.log.exception('[Push Router Navigate', err);
    }
  },
};
