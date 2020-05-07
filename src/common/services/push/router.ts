//@ts-nocheck
import navigation from '../../../navigation/NavigationService';
import featuresService from '../features.service';
import logService from '../log.service';

/**
 * Push Router
 */
export default class Router {
  /**
   * Navigate to the screen based on the notification data
   * @param {object} notification
   */
  navigate(data) {
    if (data.uri == 'chat') {
      navigation.navigate('Messenger');
      //TODO: need sender guid on message to go to conversation
      //navigation.navigate('Conversation', { conversation: { guid: data.user_guid + ':' + session.guid } });
    } else if (data.uri == 'notification') {
      if (!data.json || !data.json.entity_guid) {
        navigation.navigate('Notifications');
        return;
      }

      switch (data.json.type) {
        case 'friends':
          navigation.push('Channel', { guid: data.json.entity_guid });
          break;

        case 'group_invite':
          navigation.push('GroupView', { guid: data.json.entity_guid });
          break;

        case 'like': // not implemented in engine
        case 'downvote': // not implemented in engine
        case 'group_activity':
        case 'feature':
        case 'tag':
          let entity_type = data.json.entity_type.split(':');

          if (entity_type[0] === 'comment') {
            this.navigateToActivityOrGroup(data);
            //navigation.push('Activity', { guid: data.json.parent_guid });
          } else if (entity_type[0] === 'activity') {
            navigation.push('Activity', { guid: data.json.entity_guid });
          } else if (entity_type[1] === 'blog') {
            navigation.push('BlogView', { guid: data.json.entity_guid });
          } else if (entity_type[0] === 'object') {
            navigation.push('Activity', { guid: data.json.entity_guid });
          } else {
            const err = new Error(
              `[DeepLinkRouter] Unknown notification, entity_type: ${entity_type}`,
            );
            logService.exception('[DeepLinkRouter] Unknown notification:', err);
          }

          break;

        case 'remind':
          navigation.push('Activity', { guid: data.json.entity_guid });
          break;

        case 'comment':
          if (data.json.entity_type == 'group') {
            navigation.push('GroupView', {
              guid: data.json.child_guid
                ? data.json.child_guid
                : data.json.entity_guid,
              tab: 'conversation',
            });
          } else {
            navigation.push('Activity', {
              guid: data.json.child_guid
                ? data.json.child_guid
                : data.json.entity_guid,
            });
          }
          break;

        case 'rewards_reminder':
        case 'rewards_summary':
          if (featuresService.has('crypto')) {
            navigation.navigate('Wallet', {});
          } else {
            navigation.navigate('Notifications', {});
          }
          break;

        default:
          navigation.navigate('Notifications', {});
          logService.error(
            '[DeepLinkRouter] Unknown notification:' + JSON.stringify(data),
          );
          break;
      }
    }
  }

  /**
   * Temporary fix until the push notification includes the necessary data to decide
   * @param {Object} data
   */
  async navigateToActivityOrGroup(data) {
    const entitiesService = require('../entities.service');
    try {
      const entity = await entitiesService.single(
        'urn:entity:' + data.json.parent_guid,
      );

      if (entity.type === 'group') {
        navigation.push('GroupView', {
          guid: data.json.parent_guid,
          tab: 'conversation',
        });
      } else {
        navigation.push('Activity', { entity: entity });
      }
    } catch (err) {}
  }
}
