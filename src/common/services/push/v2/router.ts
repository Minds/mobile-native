import { MINDS_URI } from '../../../../config/Config';
import navigation from '../../../../navigation/NavigationService';
import deeplinksRouterService from '../../deeplinks-router.service';
import { error } from './parsers';
import notificationsRouter from './routers/notifications';

/**
 * Push Router
 */
export default class Router {
  /**
   * Navigate to the screen based on the notification data
   * @param {object} notification
   */
  navigate(data: any) {
    if (data.uri && data.uri.startsWith(MINDS_URI)) {
      deeplinksRouterService.navigate(data.uri);
      return;
    }

    if (data.uri === 'chat') {
      navigation.navigate('Messenger');
      //TODO: need sender guid on message to go to conversation
      //navigation.navigate('Conversation', { conversation: { guid: data.user_guid + ':' + session.guid } });
    } else if (data.uri === 'notification') {
      if (!data.json || !data.json.entity_guid) {
        error(data, 'Missing Data in notification');
        return;
      }

      notificationsRouter.navigate(data);
    }
  }
}
