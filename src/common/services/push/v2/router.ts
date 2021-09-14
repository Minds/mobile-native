import AuthService from '../../../../auth/AuthService';
import { MINDS_URI } from '../../../../config/Config';
import navigation from '../../../../navigation/NavigationService';
import deeplinksRouterService from '../../deeplinks-router.service';
import logService from '../../log.service';
import { error } from './parsers';
import notificationsRouter from './routers/notifications';

/**
 * Push Router
 */
export const router = {
  navigate: (data: any) => {
    try {
      let callback;
      if (data.uri && data.uri.startsWith(MINDS_URI)) {
        callback = () => deeplinksRouterService.navigate(data.uri);
      } else if (data.uri === 'chat') {
        callback = () => navigation.navigate('Messenger');
        //TODO: need sender guid on message to go to conversation
        //navigation.navigate('Conversation', { conversation: { guid: data.user_guid + ':' + session.guid } });
      } else if (data.uri === 'notification') {
        if (!data.json || !data.json.entity_guid) {
          error(data, 'Missing Data in notification');
          return;
        }

        callback = () => notificationsRouter.navigate(data);
      }

      if (data.user_guid) {
        AuthService.loginWithGuid(data.user_guid, () => {
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
